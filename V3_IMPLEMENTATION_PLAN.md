# V3.0 Implementation Plan - Detailed Execution Guide

**Purpose:** Step-by-step technical guide for implementing PokemonStudio v3.0  
**Audience:** Developers implementing each phase  
**Status:** In Progress  
**Last Updated:** 5 mei 2026

---

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Project Structure](#project-structure)
3. [Phase 0: Foundation](#phase-0-foundation)
4. [Phase 1: Event Editor Core](#phase-1-event-editor-core)
5. [Development Workflow](#development-workflow)
6. [Testing Strategy](#testing-strategy)
7. [Common Patterns & Utilities](#common-patterns--utilities)
8. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Prerequisites
- Node.js 22.17.0 (managed by Volta)
- Git (with submodules)
- PSDK binaries in `psdk-binaries/`
- Electron dev tools

### Quick Start

```bash
# Clone & setup
git clone https://github.com/TimbreukelIT/PokemonStudio.git
cd PokemonStudio
npm ci

# Run dev server
npm start

# Lint & format
npm run lint
```

### Local Configuration

**`.env` (create if needed):**
```
NODE_ENV=development
DEBUG=pokemon-studio:*
REACT_APP_VERSION=3.0.0-dev
```

---

## Project Structure

### Core Directories

```
src/
├── @types/              # TypeScript type definitions
│   ├── AppTheme.d.ts   # NEW: Theme system (Phase 0)
│   └── ...
├── models/              # Data models
│   ├── event/          # Event system (Phase 1+)
│   │   ├── Command.ts
│   │   ├── EventNode.ts
│   │   ├── EventTree.ts
│   │   └── commands/   # Individual command implementations
│   ├── DataPack.ts     # NEW: Phase 4
│   └── ...
├── services/           # Business logic
│   ├── EventService.ts # NEW: Phase 1+
│   ├── DataPackService.ts # NEW: Phase 4
│   └── ...
├── backendTasks/       # Electron main process tasks
│   ├── saveEventTree.ts # EXTEND: Phase 1
│   └── ...
├── hooks/              # React hooks
│   ├── useEvent/       # Event hooks (Phase 1)
│   │   └── useEvents.ts
│   └── ...
└── views/              # UI Components
    ├── pages/          # Full-page components
    │   └── world/
    │       └── Event.page.tsx  # EXTEND: Phase 1
    └── components/     # Reusable components
        └── world/event/ # Event editor components
            ├── EventTree.tsx
            ├── EventList.tsx
            └── ...
```

### New Directories to Create

```
src/
├── models/event/commands/
│   ├── MessageCommands.ts         # Phase 2
│   ├── FlowCommands.ts            # Phase 2
│   ├── GameDataCommands.ts        # Phase 2
│   ├── BattleCommands.ts          # Phase 3
│   ├── InventoryCommands.ts       # Phase 3
│   ├── AudioCommands.ts           # Phase 3
│   ├── VisualEffectCommands.ts    # Phase 3
│   ├── EnvironmentCommands.ts     # Phase 3
│   ├── MovementCommands.ts        # Phase 3
│   ├── InterfaceCommands.ts       # Phase 3
│   └── CommandFactory.ts          # Registry for all commands
└── services/
    ├── EventCommandService.ts     # Phase 2+
    ├── VariableService.ts         # Phase 2
    ├── DataPackService.ts         # Phase 4
    └── PluginService.ts           # Phase 4

docs/
├── V3_ARCHITECTURE.md
├── EVENT_SYSTEM.md
├── COMMAND_SPECS.md
└── API.md
```

---

## Phase 0: Foundation

### 0.1 Merge Upstream Develop

**Objective:** Integrate React 19 migration and event system foundation from upstream

**Steps:**

```bash
# 1. Add upstream remote (if not already there)
git remote add upstream https://github.com/PokemonWorkshop/PokemonStudio.git
git fetch upstream

# 2. Create develop branch
git checkout release/2.9.1
git checkout -b develop

# 3. Merge upstream develop
git merge upstream/develop --no-ff -m "Merge v3.0 foundation from upstream"

# 4. Resolve conflicts (if any)
# - Check: src/views/pages/world/Event.page.tsx
# - Check: src/hooks/useEvent/useEvents.ts
# - Check: package.json (dependencies)

git status  # Review conflicts
# ... resolve manually ...
git add .
git commit -m "Resolve merge conflicts with upstream develop"

# 5. Push to fork
git push -u origin develop
```

**Expected Changes:**
- React 18.2.0 → React 19
- ESLint legacy config → flat config (`eslint.config.mjs`)
- New AppTheme system (`src/@types/AppTheme.d.ts`)
- Event management foundation (16 commits)
- New command category icons

**Testing:**
```bash
npm ci
npm run lint
npm start  # Should launch without errors
```

### 0.2 Create Development Branches

```bash
# Create feature branches for each phase
git checkout develop

# Phase 1: Event Editor Core
git checkout -b feature/v3-event-editor

# Phase 2: Commands Batch 1
git checkout -b feature/v3-commands-batch1

# Phase 3: Commands Batch 2
git checkout -b feature/v3-commands-batch2

# Phase 4: Data Packs & Plugins
git checkout -b feature/v3-data-packs

# Phase 5: Dashboard
git checkout -b feature/v3-dashboard

# Push all branches
git push -u origin feature/v3-event-editor
git push -u origin feature/v3-commands-batch1
# ... etc
```

### 0.3 Documentation Setup

**Create `/docs` directory:**
```bash
mkdir -p docs
```

**Create `docs/V3_ARCHITECTURE.md`:**
```markdown
# V3.0 Architecture Overview

## Event System Architecture

```
EventTree (contains EventNodes)
  ├── EventNode (represents a command)
  │   ├── type: string (e.g., "ShowMessage")
  │   ├── parameters: Record<string, any>
  │   ├── condition?: Condition
  │   └── children?: EventNode[]
  └── metadata (version, created, modified)

CommandFactory
  ├── MessageCommands
  ├── FlowCommands
  ├── GameDataCommands
  └── ... (all command types)

EventService
  ├── parseCommand()
  ├── validateCommand()
  ├── executeCommand()
  └── persistEventTree()
```

## Type System

All commands inherit from `BaseCommand`:
```typescript
interface BaseCommand {
  id: string;
  type: CommandType;
  displayName: string;
  category: CommandCategory;
  parameters: CommandParameter[];
  icon: string;
  color: string;
  description: string;
}
```

## Data Models

- `EventTree.ts` - Root container for all events
- `EventNode.ts` - Individual event command node
- `Command.ts` - Base command interface
- `Condition.ts` - Conditional branch evaluation
```

### 0.4 CI/CD Setup

**Create `.github/workflows/test.yml`:**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: volta-cli/action@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 0.5 Update package.json

**Add test scripts:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "electron-forge make",
    "build:dev": "electron-forge package"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

---

## Phase 1: Event Editor Core

### 1.1 Extend Event Data Models

**File:** `src/models/event/EventNode.ts` (extend)

```typescript
export interface EventNodeParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'array';
  displayName: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  required: boolean;
}

export interface EventNode {
  id: string;
  commandType: string;
  displayName: string;
  parameters: Record<string, any>;
  condition?: EventCondition;
  children: EventNode[];
  collapsed?: boolean;
  metadata: {
    created: Date;
    modified: Date;
    author?: string;
  };
}

export interface EventCondition {
  type: 'if' | 'switch' | 'variable' | 'custom';
  parameters: Record<string, any>;
}
```

### 1.2 Create Command Base Classes

**File:** `src/models/event/Command.ts`

```typescript
import { EventNodeParameter } from './EventNode';

export enum CommandCategory {
  MESSAGE = 'message',
  FLOW = 'flow',
  GAME_DATA = 'gameData',
  BATTLE = 'battle',
  INVENTORY = 'inventory',
  AUDIO = 'audio',
  VISUAL = 'visual',
  MOVEMENT = 'movement',
  // ... etc
}

export abstract class BaseCommand {
  abstract readonly type: string;
  abstract readonly category: CommandCategory;
  abstract readonly displayName: string;
  abstract readonly description: string;
  abstract readonly icon: string;
  abstract readonly color: string;
  abstract readonly parameters: EventNodeParameter[];

  validate(params: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    this.parameters.forEach(param => {
      if (param.required && !params[param.name]) {
        errors.push(`${param.displayName} is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  abstract execute(params: Record<string, any>, context: ExecutionContext): Promise<void>;
}

export interface ExecutionContext {
  variables: Map<string, any>;
  localVariables: Map<string, any>;
  gameState: GameState;
  // ... other runtime state
}
```

### 1.3 Create EventService

**File:** `src/services/EventService.ts`

```typescript
import { EventTree, EventNode } from '../models/event';
import { CommandFactory } from './CommandFactory';

export class EventService {
  private commandFactory: CommandFactory;

  constructor() {
    this.commandFactory = new CommandFactory();
  }

  createNode(commandType: string, parameters: Record<string, any>): EventNode {
    const command = this.commandFactory.getCommand(commandType);
    if (!command) {
      throw new Error(`Unknown command type: ${commandType}`);
    }

    const validation = command.validate(parameters);
    if (!validation.valid) {
      throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
    }

    return {
      id: generateId(),
      commandType,
      displayName: command.displayName,
      parameters,
      children: [],
      metadata: {
        created: new Date(),
        modified: new Date()
      }
    };
  }

  updateNode(node: EventNode, updates: Partial<EventNode>): EventNode {
    return {
      ...node,
      ...updates,
      metadata: {
        ...node.metadata,
        modified: new Date()
      }
    };
  }

  deleteNode(tree: EventTree, nodeId: string): EventTree {
    // Recursively remove node
    const removeNode = (nodes: EventNode[]): EventNode[] => {
      return nodes
        .filter(n => n.id !== nodeId)
        .map(n => ({
          ...n,
          children: removeNode(n.children)
        }));
    };

    return {
      ...tree,
      nodes: removeNode(tree.nodes)
    };
  }

  validateTree(tree: EventTree): ValidationResult {
    // Validate entire tree
    const errors: string[] = [];
    const warnings: string[] = [];

    const validate = (nodes: EventNode[]): void => {
      nodes.forEach(node => {
        const command = this.commandFactory.getCommand(node.commandType);
        if (!command) {
          errors.push(`Node ${node.id}: Unknown command type '${node.commandType}'`);
        }

        validate(node.children);
      });
    };

    validate(tree.nodes);
    return { valid: errors.length === 0, errors, warnings };
  }
}
```

### 1.4 Update Event Page Component

**File:** `src/views/pages/world/Event.page.tsx` (extend)

```typescript
import { EventTree, EventNode } from '../../../models/event';
import { EventService } from '../../../services/EventService';
import { EventTreeComponent } from '../../../views/components/world/event/EventTree';
import { EventNodeEditor } from '../../../views/components/world/event/EventNodeEditor';

export const EventPage = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventTree, setEventTree] = useState<EventTree | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const eventService = useMemo(() => new EventService(), []);

  const handleAddNode = (parentId: string | null, commandType: string) => {
    // Use eventService to create node
    // Update tree
    // Mark as dirty
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<EventNode>) => {
    // Use eventService to update
    // Mark as dirty
  };

  const handleDeleteNode = (nodeId: string) => {
    // Use eventService to delete
    // Mark as dirty
  };

  const handleSave = async () => {
    if (eventTree) {
      // Validate tree
      const result = eventService.validateTree(eventTree);
      if (!result.valid) {
        // Show errors
        return;
      }

      // Save to disk via backendTask
      await saveEventTree(eventTree);
      setIsDirty(false);
    }
  };

  return (
    <div className="event-page">
      <div className="tree-panel">
        <EventTreeComponent
          tree={eventTree}
          selectedNodeId={selectedEventId}
          onSelectNode={setSelectedEventId}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
        />
      </div>

      <div className="editor-panel">
        {selectedEventId && eventTree && (
          <EventNodeEditor
            node={findNodeById(eventTree, selectedEventId)!}
            onUpdate={handleUpdateNode}
            onDelete={handleDeleteNode}
          />
        )}
      </div>

      <div className="controls">
        <button onClick={handleSave} disabled={!isDirty}>
          Save Event Tree
        </button>
      </div>
    </div>
  );
};
```

### 1.5 Create Command Factory

**File:** `src/services/event/CommandFactory.ts`

```typescript
import { BaseCommand, CommandCategory } from '../../models/event';
import { MessageCommands } from '../../models/event/commands/MessageCommands';
import { FlowCommands } from '../../models/event/commands/FlowCommands';
// ... import other command modules

export class CommandFactory {
  private commands: Map<string, BaseCommand> = new Map();

  constructor() {
    this.registerCommands();
  }

  private registerCommands() {
    // Phase 1
    this.register(new MessageCommands());
    this.register(new FlowCommands());

    // Phase 2+
    // ... register other commands
  }

  private register(command: BaseCommand) {
    this.commands.set(command.type, command);
  }

  getCommand(type: string): BaseCommand | undefined {
    return this.commands.get(type);
  }

  getCommandsByCategory(category: CommandCategory): BaseCommand[] {
    return Array.from(this.commands.values())
      .filter(c => c.category === category);
  }

  getAllCommands(): BaseCommand[] {
    return Array.from(this.commands.values());
  }

  getCategoryGroups() {
    const groups = new Map<CommandCategory, BaseCommand[]>();
    
    this.commands.forEach(command => {
      if (!groups.has(command.category)) {
        groups.set(command.category, []);
      }
      groups.get(command.category)!.push(command);
    });

    return groups;
  }
}
```

### 1.6 Phase 1 Testing

**File:** `src/__tests__/event/EventService.test.ts`

```typescript
import { EventService } from '../../services/EventService';
import { CommandFactory } from '../../services/event/CommandFactory';

describe('EventService', () => {
  let eventService: EventService;
  let commandFactory: CommandFactory;

  beforeEach(() => {
    commandFactory = new CommandFactory();
    eventService = new EventService();
  });

  describe('createNode', () => {
    it('should create a valid event node', () => {
      const node = eventService.createNode('ShowMessage', {
        text: 'Hello, World!',
        speaker: 'Player'
      });

      expect(node.commandType).toBe('ShowMessage');
      expect(node.parameters.text).toBe('Hello, World!');
    });

    it('should throw on invalid command type', () => {
      expect(() => {
        eventService.createNode('InvalidCommand', {});
      }).toThrow();
    });

    it('should validate required parameters', () => {
      expect(() => {
        eventService.createNode('ShowMessage', {}); // Missing required fields
      }).toThrow();
    });
  });

  describe('validateTree', () => {
    it('should validate valid tree', () => {
      const tree = {
        id: 'test-tree',
        nodes: [
          eventService.createNode('ShowMessage', {
            text: 'Hello',
            speaker: 'NPC'
          })
        ]
      };

      const result = eventService.validateTree(tree);
      expect(result.valid).toBe(true);
    });
  });
});
```

### 1.7 Documentation

**Create `docs/EVENT_SYSTEM.md`:**
```markdown
# Event System Architecture

## Overview

The event system is built on a tree structure of commands, each representing
a single action or control flow element in the game.

## Command Hierarchy

```
EventTree
├── nodes: EventNode[]
│   ├── id: string
│   ├── commandType: string
│   ├── parameters: Record<string, any>
│   ├── children: EventNode[]
│   └── metadata: { created, modified }
```

## Creating Custom Commands

1. Extend `BaseCommand`
2. Implement required properties
3. Register in `CommandFactory`
4. Add tests

See `COMMAND_SPECS.md` for detailed specifications.
```

---

## Development Workflow

### Branch Strategy

**Main branches:**
- `main` — Production releases (merge PRs here only)
- `develop` — Development base (all PRs target this)
- `feature/*` — Feature branches (one per phase)

**Naming convention:**
```
feature/v3-event-editor
feature/v3-commands-batch1
bugfix/event-tree-rendering
```

### Commit Messages

```
feat(event-editor): implement ShowMessage command

- Add BaseMessageCommand class
- Implement message parameter validation
- Add 5 test cases
- Update CommandFactory registry

Closes #588
```

**Format:** `type(scope): description`

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### Pull Request Process

1. Push to feature branch
2. Create PR with description of changes
3. Ensure tests pass
4. Code review
5. Merge to `develop`

### Local Testing

```bash
# Run all tests
npm run test

# Run specific test
npm run test EventService.test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Lint
npm run lint

# Format
npm run lint -- --fix
```

---

## Testing Strategy

### Unit Tests
- Each command class should have tests
- Service classes tested in isolation
- Mock dependencies

### Integration Tests
- EventService with multiple commands
- Event persistence & loading
- Tree validation

### E2E Tests
- Full event editor workflows
- Complex event chains
- Performance with large trees

### Test File Structure

```
src/__tests__/
├── event/
│   ├── commands/
│   │   ├── MessageCommands.test.ts
│   │   ├── FlowCommands.test.ts
│   │   └── ...
│   ├── EventService.test.ts
│   ├── CommandFactory.test.ts
│   └── EventTree.test.ts
├── services/
│   ├── EventService.test.ts
│   └── ...
└── views/
    ├── EventPage.test.tsx
    └── ...
```

---

## Common Patterns & Utilities

### Error Handling

```typescript
export class CommandExecutionError extends Error {
  constructor(
    public commandType: string,
    public nodeId: string,
    message: string
  ) {
    super(`[${commandType}:${nodeId}] ${message}`);
  }
}
```

### ID Generation

```typescript
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

### Immutable Updates

```typescript
// Always return new objects, don't mutate
function updateNode(node: EventNode, updates: Partial<EventNode>): EventNode {
  return {
    ...node,
    ...updates,
    metadata: {
      ...node.metadata,
      modified: new Date()
    }
  };
}
```

### React Patterns

```typescript
// Custom hook for event management
export function useEventEditor(eventId: string) {
  const [tree, setTree] = useState<EventTree | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const eventService = useMemo(() => new EventService(), []);

  const updateNode = useCallback((nodeId: string, updates: Partial<EventNode>) => {
    setTree(prev => /* update logic */);
    setIsDirty(true);
  }, []);

  return { tree, isDirty, updateNode };
}
```

---

## Troubleshooting

### Build Errors

**React 19 compatibility issues:**
```
Error: Cannot find module '@react/...
```
→ Run `npm ci` and restart dev server

**ESLint errors after merge:**
```
Error: Could not determine node version
```
→ Check `package.json` volta config, run `volta install`

### Runtime Errors

**Event persistence fails:**
- Check `saveEventTree.ts` implementation
- Verify disk permissions
- Check event tree validation

**Command not found:**
- Ensure command registered in `CommandFactory`
- Check command type string matches

### Performance Issues

**Event tree sluggish with large trees:**
- Implement tree virtualization
- Memoize EventNode components
- Profile with DevTools

---

## References & Resources

- **React 19 Migration:** https://react.dev/blog/2024/12/05/react-19
- **Electron Forge:** https://www.electronforge.io/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Jest Testing:** https://jestjs.io/docs/getting-started
