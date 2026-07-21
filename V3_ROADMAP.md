# PokemonStudio v3.0 - Roadmap & Implementation Strategy

**Status:** Custom fork development voor v3.0 — synced to upstream v2.10.0 + 7 commits (2026-07-19)  
**Base Release:** v2.10.0 (23 juni 2026)  
**Upstream Milestone:** [Version 3.0](https://github.com/PokemonWorkshop/PokemonStudio/milestone/4) (TBD — see notes)  
**Last Updated:** 21 juli 2026  
**Sync Status:** ✅ develop branch merged (13 commits) + feature/v3-event-editor merged (1 merge conflict, 3 files resolved)

---

## Executive Summary

Dit document beschrijft onze strategie om PokemonStudio v3.0 volledig zelf te implementeren en uit te voeren.

**Update (2026-07-21):** Upstream is sneller vormen gegaan dan de 23%-schatting van mei suggereerde. Sinds 2026-05-04 heeft upstream 13 commits geshipt, inclusief een volledig werkende "Show Message" event-command (PR #758). De roadmap moet daarom bijgesteld worden voor reeds-geshipte werk (zie Phase 2.1) en nieuwe architectuurrichtingen (zie Phase 2.2 Condition Registry/Builder). Lokale Phase 1 Event Editor werk (duplication, context menu, EventService, commandParameters) is succesvol met v2.10.0 gemerged — geen functionaliteit verloren.

We zullen systematisch de 4 kernpijlers bouwen:

1. **Event Editor** (~80% van het werk) — node-based scripting als RPG Maker XP vervanging
2. **Data Packs Management** — modulair project data beheer  
3. **SDK Plugins Management** — integratie met Pokémon SDK plugins
4. **Project Dashboard** — overzicht van projecten

---

## Phase Overview

| Phase | Doel | Duur | Status |
|-------|------|------|--------|
| **0. Foundation** | Merge upstream develop, setup CI/CD | 1-2 weken | Niet gestart |
| **1. Event Editor Core** | Tree UI, node system, basics | 3-4 weken | Niet gestart |
| **2. Event Commands (Batch 1)** | Messages, Flow Control, Game Data | 4-5 weken | Niet gestart |
| **3. Event Commands (Batch 2)** | Battle, Inventory, Audio, Visuals | 5-6 weken | Niet gestart |
| **4. Data Packs & Plugins** | Data pack system, plugin manager | 3-4 weken | Niet gestart |
| **5. Dashboard & Polish** | Project dashboard, UI/UX finalization | 2-3 weken | Niet gestart |
| **6. Testing & Release** | Integration testing, RC builds, v3.0 release | 2-3 weken | Niet gestart |

**Totaal geschatte duur: 20-28 weken (~5-7 maanden)**

---

## Phase 0: Foundation Setup (Week 1-2)

### Doelen
- [x] Fork upstream repository
- [ ] Merge upstream `develop` branch (16 commits met React 19 migration)
- [ ] Setup development environment
- [ ] Create CI/CD pipeline
- [ ] Documentation & communication setup

### Taken

#### 0.1 Branch Strategy
```
release/2.9.1 (current stable)
  ↓
develop (upstream merges)
  ├→ feature/v3-event-editor
  ├→ feature/v3-data-packs
  ├→ feature/v3-sdk-plugins
  └→ feature/v3-dashboard
```

**Acties:**
- [ ] `git fetch upstream` (sync latest)
- [ ] Create `develop` branch from `release/2.9.1`
- [ ] Merge `upstream/develop` into our `develop`
- [ ] Resolve conflicts (React 19 changes)
- [ ] Run tests: `npm run lint && npm start`

#### 0.2 Development Environment
- [ ] Node.js 22.17.0 (already required)
- [ ] Verify Volta lockfile (package.json)
- [ ] `npm ci` (clean install)
- [ ] PSDK binaries available in `psdk-binaries/`
- [ ] Set up local dev database if needed

#### 0.3 Documentation Setup
- [ ] Create `/docs` directory for v3.0 specs
- [ ] Create `DEVELOPMENT.md` (local setup guide)
- [ ] Create `V3_IMPLEMENTATION_PLAN.md` (this file)
- [ ] Create `V3_TRACKING.md` (progress tracker)
- [ ] Create Architecture docs per phase

#### 0.4 CI/CD & Testing
- [ ] Setup GitHub Actions for PR checks
- [ ] Configure ESLint (new flat config in develop)
- [ ] Setup TypeScript compilation validation
- [ ] Package/build testing
- [ ] Auto-release workflow for release candidates

---

## Phase 1: Event Editor Core (Week 3-6)

### Doelen
- Volledig werkende event tree UI met CRUD operations
- Node-based command system foundation
- Command categorization & UI polish

### Analysis van huidig werk
**Upstream heeft al afgemaakt:**
- Events management basic UI (#648) ✓
- Event tree read/update (#729) ✓
- Minimaal node design (#731) ✓
- Event editor in event page (#736) ✓
- Icons + kleuren per categorie (#750) ✓
- Script Command basis (#619) ✓

**Lokale Phase 1 Event Editor werk (completed 2026-05-05):**
- ✅ EventService.ts — generieke CRUD/validatie layer voor commands
- ✅ commandParameters.ts — typed parameter registry voor alle command types
- ✅ Event node duplication + context menu (Ctrl+D, rechterklik) — #1.4
- ✅ Extended saveEventTree.ts met backup/atomic-write/validation logic

**Upstream Overlap / Reconciliation Needed:**
- PR #758 ("Implement the show message event command", 2026-06-06) shipped een volledige `ShowMessageCommand` implementatie met editor UI, which overlaps met lokale `commandParameters.ts` placeholder entries.
  - **Decision point (open):** moet lokale `EventService`/`commandParameters.ts` upstream's echte `StudioEventCommandShowMessage` type hergebruiken/wrappen, of moet de placeholder-metadata voor Message commands verwijderd worden?
  - **Impact:** niet functioneel blockerend (merge geslaagd, beide systemen coëxisteren), maar semantisch redundant. Voor Phase 2 planning nodig om te bepalen of het generieke command-authoring-systeem upstream's real command types gaat wrappen vs. duplicate metadata.
  - **Affected files:** `commandParameters.ts` (lokaal, bevat Message command placeholders), `src/models/entities/event/command.ts` (upstream, bevat echt `StudioEventCommandShowMessage` type en editor imports)

**Wat nog moet gebeuren (Phase 1 gate):**
- [ ] Upstream ShowMessage reconciliation (audit + decision)
- [ ] Event preview/preview mode
- [ ] Undo/redo systeem
- [ ] Comment feature voor nodes (#628 upstream issue)

### Kritische bestanden
- `src/views/pages/world/Event.page.tsx` — main event editor page
- `src/views/components/world/event/` — tree, list, contextmenu
- `src/hooks/useEvent/useEvents.ts` — state management
- `src/backendTasks/saveEventTree.ts` — persistence

### Deliverables
- [x] Merked develop branch
- [ ] Event tree met full CRUD
- [ ] Command categorization system
- [ ] Basic persistence working
- [ ] Testing & documentation

---

## Phase 1.5: Technical Foundation — Feature Flags (Week 6-7)

**Issue:** #662 "Create a config file to handle feature flags and hide event features in release mode"

**Purpose:** Enable safe incremental development of v3 features on top of the active v2.x release line. Without feature flags, untested v3 commands would be accidentally exposed to end users, breaking compatibility.

**Critical dependency for Phase 2+** — do NOT merge v3 event commands into `develop` without this gate in place.

**Deliverables:**
- Feature flag configuration file (YAML/JSON structure)
- Flag-driven rendering in event command UI (dev mode shows all commands, release mode hides v3-WIP)
- CI/CD integration to validate flag usage
- Documentation on adding new feature flags

---

## Phase 2: Event Commands Batch 1 (Week 7-11)

Implementeer fundamentele event commando's: **Messages**, **Flow Control**, **Game Data**.

### 2.1 Message Commands
| Issue | Commando | Status | Afhankelijkheden |
|-------|----------|--------|------------------|
| #588 | Show Message | ✅ DONE (upstream PR #758, v2.10.0) | — |
| #590 | Show Choices | ⚠️ Upstream WIP (branch exists) | Message system, do NOT duplicate |
| #591 | Speakers/Names | ⬜ TODO | Message system |
| #592 | Message Window | ⬜ TODO | Message system |

**Implementatie:** Upstream's `src/views/components/world/event/commands/ShowMessageCommand.tsx` + editors  
**Opmerking:** `#590` heeft een actieve upstream-branch (`590-implement-the-show-choices-event-command`) — plannen tot upstream-status geverifieerd is.

### 2.2 Flow Control Commands

#### Conditional Branching — Condition Registry + Builder Architecture (NEW)
**⚠️ Architecture changed since original roadmap:** The original plan of a single hardcoded "Conditional Branch" command has been replaced by upstream's newer design (issues #780 / #781, opened 2026-07-13/2026-07-19):
- **#781 - Implement the MVP Condition Registry** (OPEN, foundational)
  - Declarative catalog of conditions available for composition
  - Defines which conditions exist, provides metadata (display, configure, validate, serialize)
  - Does NOT manage visual composition or execution logic
  - Must include every condition needed to replace RPG Maker XP's Conditional Branch
  - Must include Pokémon-specific and PSDK-specific conditions
  - **Blocks:** #780
- **#780 - Design and Implement the Condition Builder** (OPEN, depends on #781)
  - Generic visual composer that builds logical expressions from conditions exposed by Registry
  - Modern replacement for RPG Maker XP's hardcoded Conditional Branch command
  - Completely reusable — doesn't know which conditions exist (consumes #781)
  - Enables new gameplay systems (Quests, Day Care, Pokédex, Plugins) to extend conditions without code

**Note:** Do NOT implement a bespoke "Conditional Branch" command — target the Registry/Builder pattern instead.

#### Other Flow Control Commands
| Issue | Commando | Prioriteit | Status |
|-------|----------|-----------|--------|
| #639 | Loop | CRITICAL | ⬜ TODO |
| #640 | Break Loop | CRITICAL | ⬜ TODO |
| #641 | Wait | HIGH | ⬜ TODO |
| #642 | Stop Event | HIGH | ⬜ TODO |
| #643 | Go To (Jump) | MEDIUM | ⬜ TODO |
| #644 | Call Event | MEDIUM | ⬜ TODO |

#### Event Trigger Commands — Cluster of Related Issues
| Issue | Commando | Prioriteit | Status | Notes |
|-------|----------|-----------|--------|-------|
| #636 | Event Trigger Command | CRITICAL | ⬜ TODO | Initialize events; design prep closed (#752) |
| #765 | Manage Trigger Priorities | HIGH | ⬜ TODO | NEW (2026-07-16) — related to #636 |
| #766 | Validate Event Entry Points | HIGH | ⬜ TODO | NEW (2026-06-06) — related to #636, design TBD |
| #767 | Preserve RMXP Trigger Semantics | HIGH | ⬜ TODO | NEW (2026-06-06) — **scope may change due to #743 RMXP deprecation (v2.10.0)** |

**Opmerking:** #743 (Deprecate RPG Maker XP for map management) al geshipt in v2.10.0 — controleer of #767's scope is veranderd.  
**Implementatie:** `src/models/event/commands/FlowCommands.ts` + Condition Registry/Builder in eigen subsysteem

### 2.3 Game Data Commands
| Issue | Commando | Prioriteit | Afhankelijkheden |
|-------|----------|-----------|------------------|
| #567 | Variables | CRITICAL | State system |
| #568 | Variable Control | CRITICAL | Variable system |
| #569 | Local Variables | HIGH | Variable system |
| #570 | Timer Control | MEDIUM | Variable system |

**Implementatie:** `src/models/event/commands/GameDataCommands.ts`

### Deliverables
- [ ] Alle 3 categoriëen volledig geïmplementeerd
- [ ] Event execution engine werkt
- [ ] Variable/state system actief
- [ ] Tests voor elk commando type
- [ ] Upstream issue tracking

---

## Phase 3: Event Commands Batch 2 (Week 12-17)

Implementeer specialistische commando's: **Battle**, **Inventory**, **Audio**, **Visuals**, **Movement**, **Interactions**.

### 3.1 Battle Commands
| Issue | Commando | Prioriteit |
|-------|----------|-----------|
| #573 | Trainer Battle | CRITICAL |
| #574 | Wild Battle | CRITICAL |
| #575 | Battle Activation | HIGH |
| #576 | Custom Rules | MEDIUM |

**Implementatie:** `src/models/event/commands/BattleCommands.ts`

### 3.2 Inventory Commands
| Issue | Commando | Prioriteit |
|-------|----------|-----------|
| #577 | Manage Items | CRITICAL |
| #578 | Manage Money | CRITICAL |
| #579 | Give Items (PSDK) | HIGH |

**Implementatie:** `src/models/event/commands/InventoryCommands.ts`

### 3.3 Audio Commands
| Issue | Commando | Prioriteit |
|-------|----------|-----------|
| #602 | Play Sound | HIGH |
| #603 | Stop Sounds | HIGH |
| #604-606 | Sound Management | MEDIUM |

**Implementatie:** `src/models/event/commands/AudioCommands.ts`

### 3.4 Visual Commands
| Issue | Commando | Prioriteit |
|-------|----------|-----------|
| #609 | Screen Tone | HIGH |
| #610-614 | Animations, Camera, Emotions, Pictures | MEDIUM |
| #615-618 | Environment (Weather, Fog, Panorama, BG) | MEDIUM |

**Implementatie:** 
- `src/models/event/commands/VisualEffectCommands.ts`
- `src/models/event/commands/EnvironmentCommands.ts`

### 3.5 Movement & Interaction Commands
| Issue | Commando | Prioriteit |
|-------|----------|-----------|
| #561-564 | Movement, Teleport | HIGH |
| #631-634 | Player Input | MEDIUM |

**Implementatie:** `src/models/event/commands/MovementCommands.ts`

### 3.6 Game Interface Commands
| Issue | Commando | Prioriteit |
|-------|----------|-----------|
| #580-586 | Save Menu, Open Scenes, Shop, Main Menu | HIGH |

**Implementatie:** `src/models/event/commands/InterfaceCommands.ts`

### Deliverables
- [ ] Alle 6 command categoriëen
- [ ] ~40 individuele commando's
- [ ] Full game logic integration
- [ ] Performance optimization
- [ ] Extensive testing

---

## Phase 4: Data Packs & SDK Plugins (Week 18-21)

### 4.1 Data Packs System
**Issue:** #83 (Manage project data by using data packs)

**Doelen:**
- Modularize project data
- Import/export data packs
- Dependency management
- Pack versioning

**Implementatie:**
- `src/models/DataPack.ts`
- `src/models/DataPackManager.ts`
- `src/services/DataPackService.ts`
- UI in `src/views/pages/DataPacks.page.tsx`

### 4.2 SDK Plugins Management
**Doelen:**
- Plugin discovery & installation
- Plugin configuration UI
- Plugin dependency resolution
- Plugin lifecycle management

**Implementatie:**
- `src/models/PSKPlugin.ts`
- `src/services/PluginService.ts`
- UI in `src/views/pages/Plugins.page.tsx`

### Deliverables
- [ ] Data pack system fully functional
- [ ] Plugin manager fully functional
- [ ] Integration tests
- [ ] Documentation

---

## Phase 5: Dashboard & Polish (Week 22-24)

### 5.1 Project Dashboard
**Issue:** Implicitly part of v3.0

**Features:**
- Recent projects
- Project statistics
- Quick actions
- News/updates feed

**Implementatie:** `src/views/pages/Dashboard.page.tsx`

### 5.2 Event Editor Features
- **#628 - Implement the Comment Feature** (open, user story)
  - Comments display in node footer
  - Comment UI/UX for adding/editing comments
- **#629 - Preview capability for Event movements** (open, user story)
  - Visual preview of event execution flow
  - Shows node traversal order, loop iterations, etc.

### 5.3 UI/UX Refinements
- Event editor usability improvements
- Command palette / quick search
- Keyboard shortcuts
- Dark mode support (if not present)
- Responsive design fixes

### 5.4 Supporting Features
- [ ] RMXP map management removal (#743 — already in v2.10.0)
- [ ] RMXP→Studio event converter prep (#480)
- [ ] Form Design System (#625)
- [ ] Copy/paste optimization (#732)

### Deliverables
- [ ] Polished dashboard
- [ ] Refined UI across all features
- [ ] Supporting features complete

---

## Phase 6: Testing & Release (Week 25-27)

### 6.1 Integration Testing
- [ ] Full event editor workflow
- [ ] All command types tested
- [ ] Data pack import/export
- [ ] Plugin system
- [ ] Dashboard functionality
- [ ] PSDK compatibility
- [ ] Save file integrity

### 6.2 Release Candidate
- [ ] Version bump: `2.9.1` → `3.0.0-rc1`
- [ ] Changelog creation
- [ ] Build & package testing
- [ ] Auto-updater testing
- [ ] Beta release on GitHub

### 6.3 Bug Fixes & Release
- [ ] RC testing feedback
- [ ] Critical bug fixes
- [ ] `3.0.0` final release
- [ ] Documentation finalization
- [ ] Announcement

### Deliverables
- [ ] v3.0.0 final release
- [ ] Complete documentation
- [ ] Release notes

---

## Design System & Visual Consistency

**Event Node Design Kit (upstream):**
- ✅ **#624 - Prepare the Visual Scripting Design** (closed, 2026-03-29)
- ✅ Figma design kit work: **#733** (closed), **#734** (closed)
- These define the canonical visual language for event nodes and command UI

**Design-Consistency Gap (local):**
- Local Phase 1.4 work (`CommandNode.tsx`, `CommandContextMenu.tsx`, node styling) was built without reference to the upstream Figma design kit
- **Action required:** Post-Phase 1, add a design-consistency pass to align local node UI with upstream's established patterns

**Related upstream work:**
- **#625 - Implement the Form Design System** (open, user story, design)
  - Generic form components for command parameter UI
  - Should be consumed by Phase 2+ command implementations

---

## Out of Band Backlog — Unscheduled but Real Scope

These are open upstream issues relevant to v3 that don't yet have a scheduled phase:

| Issue | Title | Type | Status | Notes |
|-------|-------|------|--------|-------|
| #763 | Accessibility Audit and Keyboard Navigation Strategy | Documentation, Accessibility, Analysis | OPEN | Not yet integrated into v3 roadmap; impacts all UI work |
| #784 | Introduce Trainer Classes as a First-Class Database Entity | User story | OPEN | Informational — unrelated to event editor but affects game data model |
| —    | GitHub Projects Board (upstream) | Resource | Manual check | https://github.com/orgs/PokemonWorkshop/projects/1/views/1 — not queryable via API (token lacks `read:project` scope) — flag for manual monthly review |

---

## Resource Allocation

| Rol | Verantwoordelijkheid | Afhankelijkheden |
|-----|----------------------|------------------|
| **Core Team** | Event editor architecture & core commands | Setup & foundation |
| **Command Developers** | Individual command implementations | Core architecture |
| **QA** | Testing, bug reporting, validation | All phases |
| **DevOps** | CI/CD, build, deployment | Phase 0 |
| **Docs** | Technical docs, user guides | All phases |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Event system complexity | HIGH | Break into small incremental commands, early testing |
| Upstream changes | MEDIUM | Regular syncing with upstream develop |
| Plugin system scope creep | MEDIUM | Clear plugin API specification first |
| Performance (large events) | MEDIUM | Load testing early, optimize command tree rendering |
| PSDK compatibility | HIGH | Close liaison with PSDK team, version alignment |

---

## Success Criteria

- ✓ All event commands implemented & tested
- ✓ Data packs system fully functional
- ✓ SDK plugins integrable
- ✓ Project dashboard operational
- ✓ Zero critical bugs in RC phase
- ✓ Documentation complete
- ✓ v3.0.0 released & stable

---

## Progress Tracking

See `V3_TRACKING.md` for detailed issue tracking and progress updates.

---

## References

- **Upstream Milestone:** https://github.com/PokemonWorkshop/PokemonStudio/milestone/4
- **Code Guidelines:** `CodeGuidelines.md`
- **Epic Cleanup:** `EPIC_Cleanup_responsibility_of_Studio.md`
- **Contributing:** `CONTRIBUTING.md`
