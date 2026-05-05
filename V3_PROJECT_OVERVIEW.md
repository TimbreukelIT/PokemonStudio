# V3.0 Project Overview

**What is this?** Complete context document for PokemonStudio v3.0  
**Updated:** 5 mei 2026  
**Scope:** Full technical and organizational context

---

## Table of Contents

1. [What is PokemonStudio?](#what-is-pokemonstudio)
2. [Vision & Mission](#vision--mission)
3. [Core Technology Stack](#core-technology-stack)
4. [Development Language Breakdown](#development-language-breakdown)
5. [Architecture Overview](#architecture-overview)
6. [Project Goals](#project-goals)
7. [Success Criteria](#success-criteria)

---

## What is PokemonStudio?

### Executive Summary

**PokemonStudio** is a professional desktop application that allows game developers to create
Pokémon-style games without having to write code. It's a comprehensive game editor that combines
data management, visual scripting, and asset management into a single integrated environment.

Think of it as a modern replacement for **RPG Maker XP** (RMXP), specifically tailored for
Pokémon game development.

### Who Uses It?

- Indie game developers
- Pokémon fan game creators
- Game design educators
- Modders and enthusiasts

### What Can You Do With It?

**Game Data Management:**
- Edit creatures (Pokémon), moves, abilities, items
- Manage trainers, NPCs, and dialogue
- Configure game mechanics (evolution, leveling, stats)
- Define quests and challenges
- Manage game saves and player data

**Visual Design:**
- Edit maps (2D tile-based, converted from Tiled)
- Manage game visuals (sprites, animations, effects)
- Create events and cutscenes (v3.0 feature)
- Preview changes in real-time

**Game Configuration:**
- Set up game constants and settings
- Configure UI elements
- Manage translations (7 languages supported)
- Handle game packs and modular content

**Code-Free Event Creation (v3.0):**
- Visual node-based scripting
- Complex event chains without coding
- Battle events, dialogue trees, item interactions
- Conditional logic and branching

### Current Version

- **Stable Release:** v2.9.1 (March 7, 2026)
- **Next Major Version:** v3.0 (this project)

**Version History:**
- v2.9.1 (March 2026) — Last stable
- v2.9.0 (Feb 2026)
- v2.8.x (Nov-Dec 2025)
- v2.7.0 (Sep 2025)
- v2.x - Active development since 2024

---

## Vision & Mission

### Mission Statement

*"Enable developers of all skill levels to create professional-quality Pokémon games
without coding, through an intuitive, powerful, and extensible visual editor."*

### Strategic Vision (v3.0 & beyond)

**Version 3.0 Goals:**
1. **Break free from RPG Maker XP dependency** — Provide complete event system replacement
2. **Become the standard Pokémon game editor** — Industry standard for fan game creation
3. **Support modular development** — Data packs and plugin system for extensibility
4. **Improve accessibility** — Visual scripting makes game creation approachable
5. **Foster community** — Support for translations, plugins, and community content

**Strategic Pillars:**
- **Usability first** — Intuitive, no coding required
- **Power & flexibility** — Support complex game logic
- **Open & extensible** — Plugin system, data packs, translations
- **Professional quality** — Production-ready, industry-standard tools
- **Community-driven** — Open source, community contributions welcome

### Product Vision for v3.0+

> PokemonStudio 3.0 is the definitive game creation platform for Pokémon-style games.
> It bridges the gap between casual game makers and professional developers, providing:
>
> - Complete RPG creation without coding
> - Modular, scalable project structure
> - Industry-standard visual design patterns
> - Active community and extensive documentation
>
> By 2027, we aim to be the #1 choice for Pokémon fan game development worldwide.

---

## Core Technology Stack

### Frontend / UI Layer

**Framework:** React 19 (as of v2.9.1 / v3.0)
- Modern hooks-based architecture
- Component-driven development
- Strong ecosystem and community

**State Management:**
- React hooks (useState, useContext, useCallback)
- React Tracked (for complex state)
- Custom service layer pattern

**UI Libraries & Styling:**
- **styled-components** v5.3.11 — CSS-in-JS styling
- **@xyflow/react** v12.3.2 — Node-based graph visualization (event editor)
- **react-router-dom** v6.26.2 — Client-side routing
- **react-virtualized** — Efficient list rendering
- **i18next** v23.15.1 — Internationalization (translation support)

**Developer Tools:**
- **ESLint** (flat config, v9+) — Code linting
- **TypeScript** 4.9+ — Static type checking
- **Volta** — Node.js version management

### Desktop / Runtime

**Framework:** Electron 37.2.0
- Cross-platform desktop app (Windows, macOS, Linux)
- Native desktop capabilities
- Auto-updates via electron-updater

**Build Tools:**
- **Electron Forge** — Build, package, and publish
- **Vite** — Fast development server and bundling
- **Node.js** 22.17.0 — Runtime

### Backend / Data Layer

**Architecture:**
- **Electron Main Process** — Backend logic, file system access, OS integration
- **Renderer Process** — React UI, user interactions
- **IPC (Inter-Process Communication)** — Communication between main & renderer

**Data Persistence:**
- **File System** — Store game data as structured files (JSON, binary)
- **Project Structure** — Modular files per game element
- **PSDK Integration** — Load/save with Pokémon SDK compatibility

**External Integration:**
- **Pokémon SDK** — binaries in `psdk-binaries/`
- **Tiled Map Editor** — Map format conversion
- **PSDK Plugins** — Third-party extensibility (v3.0)

### Development & Testing

**Testing Framework:**
- **Jest** — Unit and integration tests
- **@testing-library/react** — Component testing
- **@testing-library/jest-dom** — DOM matchers

**CI/CD:**
- **GitHub Actions** — Automated testing & building
- **GitHub Releases** — Release distribution

---

## Development Language Breakdown

### Primary Languages

**TypeScript** (90%+ of codebase)
```
├── src/          — All application code
├── config/       — Build configurations
└── forge.config.ts — Electron Forge config
```
- **Percentage:** ~95% of code
- **Why:** Type safety, better IDE support, scalability
- **Usage:** All business logic, components, services

**JavaScript / JSX** (5%-)
```
├── updater_i18n.js    — Translation updater
└── vite-env.d.ts      — Vite environment types
```
- **Percentage:** ~5% of code
- **Usage:** Build scripts, configuration

### Supported Languages (User Facing)

The application supports users in 7 languages:

| Language | Code | Status | Completeness |
|----------|------|--------|--------------|
| English | EN | Active | 100% |
| French | FR | Active | 100% |
| Spanish | ES | Active | 100% |
| Italian | IT | Active | 100% |
| German | DE | Active | 100% |
| Portuguese | PT | Active | 100% |
| Dutch | NL | Active | 100% |
| Chinese (Simplified) | zh_Hans | Inactive | 60% |
| Chinese (Traditional) | zh_Hant | Inactive | 60% |
| Japanese | ja | Inactive | 40% |

**Translation System:** i18next (`assets/i18n/`)

### File Type Breakdown

| File Type | Count | Purpose |
|-----------|-------|---------|
| `.ts` | ~800+ | TypeScript components, services, models |
| `.tsx` | ~300+ | React components |
| `.json` | ~200+ | Configuration, localization, data |
| `.css` / styled-components | ~100+ | Styling |
| `.md` | ~20+ | Documentation |

### Code Organization

```
src/
├── @types/            — Type definitions & interfaces
├── backendTasks/      — Electron main process work
├── hooks/             — React custom hooks
├── migrations/        — Version migrations
├── models/            — Data models & interfaces
├── services/          — Business logic (soon: EventService)
├── utils/             — Utility functions
└── views/
    ├── components/    — Reusable UI components
    ├── pages/         — Full-page components
    └── styles/        — Shared styling
```

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│         User (Developer)                    │
│      Creating a Pokémon Game                │
└──────────────┬──────────────────────────────┘
               │ User Actions (clicks, edits)
               ↓
┌─────────────────────────────────────────────┐
│      React UI (Renderer Process)            │
│  - Event Editor (v3.0)                      │
│  - Game Data Management                     │
│  - Map Editor                               │
│  - Settings & Config                        │
│  - Dashboard (v3.0)                         │
└──────────────┬──────────────────────────────┘
               │ IPC Messages
               ↓
┌─────────────────────────────────────────────┐
│    Electron Main Process (Backend)          │
│  - File I/O                                 │
│  - Project Management                       │
│  - Data Persistence                         │
│  - PSDK Integration                         │
│  - Auto-Updates                             │
└──────────────┬──────────────────────────────┘
               │ File System Access
               ↓
┌─────────────────────────────────────────────┐
│   Project Files on Disk                     │
│  - Game Data (creatures, moves, etc.)       │
│  - Maps (Tiled format)                      │
│  - Events (v3.0)                            │
│  - Configuration                            │
│  - Project Metadata                         │
└─────────────────────────────────────────────┘
```

### Event System Architecture (v3.0)

```
EventTree (root container)
  ├── EventNode (command)
  │   ├── type: "ShowMessage"
  │   ├── parameters: { text, speaker, ... }
  │   ├── condition?: { type, parameters }
  │   └── children: [EventNode]
  │       ├── EventNode (next command)
  │       └── EventNode (nested)
  └── metadata: { created, modified, version }

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
  └── persistTree()
```

### Data Persistence Model

```
project.json
├── metadata
├── settings
└── maps/
    └── map-1/
        ├── data.json
        ├── tileset.json
        └── events.json (v3.0)

creatures/
├── creature-1.json
├── creature-2.json
└── ...

moves/
├── move-1.json
└── ...

[etc for items, abilities, trainers, etc]
```

---

## Project Goals

### Primary Goals (v3.0)

1. **Complete Event System** — Full replacement for RMXP events
   - Node-based visual scripting
   - 100+ event commands
   - Conditional logic & flow control
   - Testing & documentation

2. **Modular Architecture** — Data packs & plugins
   - Data pack management system
   - Plugin API & lifecycle
   - Dependency resolution
   - Version management

3. **Professional Quality** — Production-ready release
   - 80%+ test coverage
   - Comprehensive documentation
   - Performance optimization
   - Zero critical bugs

4. **Community Ready** — Support for extensions
   - Plugin ecosystem
   - Translation support
   - Open development process
   - Community feedback integration

### Secondary Goals

- [ ] Improve performance with large projects (1000+ events)
- [ ] Add visual effects preview in editor
- [ ] Multi-user collaboration (future)
- [ ] Cloud project sync (future)
- [ ] Mobile companion app (future)

---

## Success Criteria

### Technical Success

| Criterion | Target | Validation |
|-----------|--------|-----------|
| Event commands implemented | 100+ working | All commands documented & tested |
| Test coverage | 80%+ | Coverage reports in CI |
| Performance | <100ms for common ops | Benchmarks in tests |
| Build time | <2min | CI/CD logs |
| Auto-update | 100% success | Test on staging |
| PSDK compat | 100% compatible | Integration tests |

### Product Success

| Criterion | Target | Validation |
|-----------|--------|-----------|
| Feature complete | All planned features | Feature checklist ✓ |
| Documentation | 100% coverage | Doc site + in-app help |
| Usability | 90%+ developer satisfaction | User testing & surveys |
| Stability | <5 critical bugs | Issue tracking |
| Community | Active contributions | GitHub stars, issues, PRs |
| Release | v3.0.0 published | GitHub release published |

### Business Success

| Criterion | Target | Notes |
|-----------|--------|-------|
| Adoption | 1000+ users | Downloads + community size |
| Community | 50+ active contributors | GitHub + Discord community |
| Ecosystem | 20+ community plugins | Plugin marketplace |
| Longevity | 2+ years of support | Release schedule |

---

## References

- **Main Repository:** https://github.com/PokemonWorkshop/PokemonStudio
- **Upstream v3.0 Milestone:** https://github.com/PokemonWorkshop/PokemonStudio/milestone/4
- **Code Guidelines:** `CodeGuidelines.md`
- **Contributing Guide:** `CONTRIBUTING.md`
- **React 19 Docs:** https://react.dev
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Electron Documentation:** https://www.electronjs.org/docs

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-05 | Claude | Initial creation |
| | | | - Added overview section |
| | | | - Technology stack documented |
| | | | - Architecture diagrams |
| | | | - Project goals & success criteria |

---

**Next Steps:**
1. Share this document with the team
2. Schedule kickoff meeting
3. Begin Phase 0 setup
4. Start merging upstream develop branch
