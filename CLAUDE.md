# CLAUDE.md - PokemonStudio V3.0 Development Context

**Purpose:** Central knowledge base for Claude Code sessions working on v3.0  
**Last Updated:** 5 mei 2026  
**Status:** Active v3.0 development

---

## Project Overview

**What:** PokemonStudio v3.0 — Complete event editor & modular system for Pokémon game development  
**Where:** GitHub fork: `https://github.com/TimbreukelIT/PokemonStudio`  
**Base:** Fork from `PokemonWorkshop/PokemonStudio` at v2.9.1 (March 7, 2026)  
**Scope:** 6 phases, ~27 weeks, 100+ event commands, modular architecture

**Repository Structure:**
```
src/
├── @types/         — Type definitions
├── backendTasks/   — Electron main process (file I/O)
├── hooks/          — React custom hooks
├── models/         — Data models
├── services/       — Business logic
├── utils/          — Utilities
└── views/
    ├── components/ — Reusable UI components
    └── pages/      — Full-page components
```

---

## Current Development Focus

### Phase 0: Foundation Setup (Week 1-2)
**Status:** ⬜ Not started  
**What's needed:**
1. Merge upstream `develop` branch (16 commits with React 19 migration)
2. Create feature branches for phases 1-5
3. Setup CI/CD pipeline
4. Local dev environment validation

**Key Commands:**
```bash
# View the plan
cat V3_ROADMAP.md
cat V3_IMPLEMENTATION_PLAN.md

# Track progress
cat V3_TRACKING.md

# Merge upstream
git fetch upstream
git checkout develop  # Create if doesn't exist
git merge upstream/develop --no-ff
```

---

## Documentation Files (All in Root)

**Navigation:**
- `V3_INDEX.md` ← **START HERE** — Navigation hub for all v3.0 docs

**Strategic:**
- `V3_ROADMAP.md` — 6-phase roadmap with timelines & deliverables
- `V3_PROJECT_OVERVIEW.md` — Project context, vision, tech stack, languages
- `V3_IMPLEMENTATION_PLAN.md` — Technical guide with code patterns & examples

**Tracking:**
- `V3_TRACKING.md` — Progress tracking per phase & issue
- `CodeGuidelines.md` — Code style & architecture patterns
- `CONTRIBUTING.md` — Contribution workflow

---

## Technology Stack

**Frontend:** React 19, TypeScript, styled-components, @xyflow/react (node graphs)  
**Desktop:** Electron 37.2.0, Electron Forge  
**Development:** Node.js 22.17.0 (Volta), Jest, ESLint (flat config)  
**Languages:** 95% TypeScript, 5% JavaScript  
**User Languages:** EN, FR, ES, IT, DE, PT, NL

---

## Key Architecture Decisions

### Event System (v3.0 Core)

**Architecture:** Tree-based command nodes
```typescript
EventTree
  ├── EventNode (id, commandType, parameters, children)
  ├── EventNode
  │   └── EventNode (nested)
  └── metadata

CommandFactory (registry)
  ├── MessageCommands
  ├── FlowCommands
  ├── BattleCommands
  └── ... (all command types)

EventService (business logic)
  ├── createNode()
  ├── updateNode()
  ├── deleteNode()
  ├── validateTree()
```

**Files to Know:**
- `src/models/event/EventNode.ts` — Event data structure
- `src/models/event/Command.ts` — Base command interface
- `src/services/EventService.ts` — Event management logic
- `src/services/event/CommandFactory.ts` — Command registry
- `src/views/pages/world/Event.page.tsx` — Event editor UI
- `src/views/components/world/event/` — Event tree components
- `src/backendTasks/saveEventTree.ts` — Persistence

---

## Development Workflow

### Branch Strategy
```
release/2.9.1 (current stable, v2.9.1)
develop (base for all features)
├── feature/v3-event-editor
├── feature/v3-commands-batch1
├── feature/v3-commands-batch2
├── feature/v3-data-packs
└── feature/v3-dashboard
```

### Commit Message Format
```
feat(scope): description

- Bullet point details
- Another detail

Closes #123
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### Local Development
```bash
npm ci                # Clean install
npm start             # Dev server
npm run lint          # Check style
npm run test          # Run tests
npm run test:watch    # Watch mode
```

---

## Phase Breakdown (Quick Reference)

| Phase | Focus | Duration | Commands | Status |
|-------|-------|----------|----------|--------|
| **0** | Foundation, merge upstream | Week 1-2 | — | ⬜ TODO |
| **1** | Event editor core | Week 3-6 | Core system | ⬜ TODO |
| **2** | Message, Flow, Game Data cmds | Week 7-11 | 16 cmds | ⬜ TODO |
| **3** | Battle, Audio, Visual, etc. cmds | Week 12-17 | 37 cmds | ⬜ TODO |
| **4** | Data packs, plugin manager | Week 18-21 | 2 systems | ⬜ TODO |
| **5** | Dashboard, polish, UX | Week 22-24 | Features | ⬜ TODO |
| **6** | Testing, RC, release | Week 25-27 | Release | ⬜ TODO |

**See:** `V3_ROADMAP.md` for full details

---

## Important Code Patterns

### Creating a Command (All Phases 2+)

**Pattern:**
```typescript
import { BaseCommand, CommandCategory, EventNodeParameter } from '../../Command';
import { ExecutionContext } from '../../ExecutionContext';

export class ShowMessageCommand extends BaseCommand {
  readonly type = 'ShowMessage';
  readonly category = CommandCategory.MESSAGE;
  readonly displayName = 'Show Message';
  readonly description = 'Display message dialog to player';
  readonly icon = 'message-icon';
  readonly color = '#4CAF50';
  
  readonly parameters: EventNodeParameter[] = [
    {
      name: 'text',
      type: 'string',
      displayName: 'Message Text',
      required: true
    },
    {
      name: 'speaker',
      type: 'string',
      displayName: 'Speaker Name',
      required: false
    }
  ];

  validate(params: Record<string, any>) {
    const errors: string[] = [];
    if (!params.text) errors.push('Text is required');
    return { valid: errors.length === 0, errors };
  }

  async execute(params: Record<string, any>, context: ExecutionContext) {
    // Implementation
  }
}
```

### Event Service Pattern
```typescript
const eventService = new EventService();

// Create node
const node = eventService.createNode('ShowMessage', {
  text: 'Hello',
  speaker: 'NPC'
});

// Update node
eventService.updateNode(node, { parameters: { text: 'Hi' } });

// Validate tree
const result = eventService.validateTree(eventTree);
if (!result.valid) {
  console.error(result.errors);
}
```

### Testing Pattern
```typescript
describe('ShowMessageCommand', () => {
  let command: ShowMessageCommand;

  beforeEach(() => {
    command = new ShowMessageCommand();
  });

  test('validates required text parameter', () => {
    const result = command.validate({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Text is required');
  });

  test('executes message display', async () => {
    const context = createMockContext();
    await command.execute({ text: 'Hello' }, context);
    expect(context.messageShown).toBe(true);
  });
});
```

---

## Common Tasks for New Sessions

### Task: Implement a New Event Command

1. **Find the spec** → `V3_ROADMAP.md` Phase 2 or 3
2. **Create the class** → `src/models/event/commands/[Category]Commands.ts`
3. **Extend BaseCommand** with parameters & execute logic
4. **Register in CommandFactory** → `src/services/event/CommandFactory.ts`
5. **Add tests** → `src/__tests__/event/commands/[Category]Commands.test.ts`
6. **Update tracking** → `V3_TRACKING.md`

### Task: Fix a Bug in Event Editor

1. **Identify issue** → Check `V3_TRACKING.md` or GitHub issues
2. **Find relevant file** → Usually `src/views/pages/world/Event.page.tsx` or services
3. **Add test first** → Regression test in `src/__tests__/`
4. **Fix code** → Minimal, focused change
5. **Run tests** → `npm run test` to verify
6. **Commit** → `fix(event-editor): description`

### Task: Update Documentation

1. **Check relevant doc** → Which of the V3_*.md files?
2. **Update content** → Keep in sync with code
3. **Cross-reference** → Link to related sections
4. **Commit** → `docs: what changed`

---

## Quick Debugging

### Build Errors

**"Cannot find module React"**
```bash
npm ci  # Clean install
```

**"ESLint error after merge"**
```bash
# Check Volta is managing Node
node --version  # Should be 22.17.0
volta install   # Reinstall deps
```

### Runtime Issues

**Event tree not saving**
- Check: `src/backendTasks/saveEventTree.ts`
- Verify: File permissions, disk space
- Test: `eventService.validateTree()` first

**Command not showing in UI**
- Check: Registered in `CommandFactory.ts`
- Verify: Command type string matches
- Test: `commandFactory.getAllCommands()` includes it

---

## Upstream Synchronization

**Our repo:** `TimbreukelIT/PokemonStudio`  
**Upstream:** `PokemonWorkshop/PokemonStudio`

**Sync regularly:**
```bash
git fetch upstream
git merge upstream/develop  # Merge latest from upstream

# OR rebase if you want linear history
git rebase upstream/develop
```

**Issues to watch:**
- React 19 migration changes (already merged in Phase 0)
- New command implementations upstream
- Bug fixes we should cherry-pick

---

## Testing Strategy

**Target:** 80%+ code coverage by release

**Test Files:**
```
src/__tests__/
├── event/
│   ├── commands/
│   │   ├── MessageCommands.test.ts
│   │   └── ...
│   ├── EventService.test.ts
│   └── EventTree.test.ts
├── services/
│   └── EventService.test.ts
└── views/
    └── EventPage.test.tsx
```

**Run Tests:**
```bash
npm run test              # Run all
npm run test EventService # Specific
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## Phase 0 Checklist (First Session)

When starting Phase 0:

- [ ] Read `V3_INDEX.md` (5 min)
- [ ] Read `V3_PROJECT_OVERVIEW.md` (30 min)
- [ ] Read `V3_ROADMAP.md` phases 0-1 (20 min)
- [ ] Read `V3_IMPLEMENTATION_PLAN.md` section 0 (15 min)
- [ ] `git fetch upstream` (1 min)
- [ ] Create `develop` branch (1 min)
- [ ] Merge `upstream/develop` (5 min + resolve conflicts)
- [ ] Run `npm ci && npm start` (5 min)
- [ ] Create feature branches (5 min)
- [ ] Update `V3_TRACKING.md` (Phase 0 status)

---

## Who's Working on What (Template)

**Update this as team members are assigned:**

| Phase | Owner | Status | Notes |
|-------|-------|--------|-------|
| Phase 0 | — | ⬜ TODO | Awaiting assignment |
| Phase 1 | — | ⬜ TODO | Event editor core |
| Phase 2 | — | ⬜ TODO | Message/Flow/Data commands |
| Phase 3 | — | ⬜ TODO | Battle/Audio/Visual commands |
| Phase 4 | — | ⬜ TODO | Data packs & plugins |
| Phase 5 | — | ⬜ TODO | Dashboard & UX |
| Phase 6 | — | ⬜ TODO | Testing & release |

---

## Important Notes for Claude

### Session Hints

- **Always start with:** `V3_INDEX.md` for navigation
- **Before coding:** Check `V3_IMPLEMENTATION_PLAN.md` for patterns
- **After changes:** Update `V3_TRACKING.md`
- **Questions?** Check the relevant V3_*.md doc first

### Scope Management

- Keep PRs focused (one feature per PR)
- Don't refactor beyond scope (task creep)
- Update docs as code changes
- Commit tests with features

### Communication

- Use clear commit messages with issue references
- Link to GitHub upstream issues when relevant
- Keep V3_TRACKING.md current
- Document gotchas in code comments (sparingly)

---

## Reference Links

- **Our Fork:** https://github.com/TimbreukelIT/PokemonStudio
- **Upstream:** https://github.com/PokemonWorkshop/PokemonStudio
- **v3.0 Milestone:** https://github.com/PokemonWorkshop/PokemonStudio/milestone/4
- **React 19:** https://react.dev
- **Electron:** https://www.electronjs.org/docs
- **TypeScript:** https://www.typescriptlang.org/docs

---

## Last Session Summary

**What was done (5 mei 2026):**
- ✅ Forked `PokemonWorkshop/PokemonStudio` to `TimbreukelIT/PokemonStudio`
- ✅ Created comprehensive V3.0 documentation package:
  - V3_INDEX.md (navigation)
  - V3_ROADMAP.md (6-phase strategy)
  - V3_PROJECT_OVERVIEW.md (context, vision, tech stack)
  - V3_IMPLEMENTATION_PLAN.md (technical guide)
  - V3_TRACKING.md (progress tracker)
- ✅ Created CLAUDE.md (this file)
- ✅ All docs pushed to `release/2.9.1` branch

**Next steps for next session:**
1. Read V3_INDEX.md
2. Begin Phase 0 (merge upstream develop)
3. Create develop branch & feature branches
4. Setup CI/CD
5. Start Phase 1 planning

---

**Document Status:** 📋 Complete for new sessions

**Questions?** Check the V3_*.md files — they have all the details!
