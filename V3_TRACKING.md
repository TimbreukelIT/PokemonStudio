# V3.0 Progress Tracking

**Purpose:** Central tracker for v3.0 implementation progress  
**Updated:** 21 juli 2026  
**Total Progress:** Phase 0 ~80% + Phase 1 ~50% (git sync + partial Phase 1 implemented locally)

---

## Phase 0: Foundation Setup

**Target Duration:** Week 1-2  
**Actual Duration:** ~11 weeks (2026-05-05 to 2026-07-21)  
**Progress:** 5/5 completed

| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Initial fork & setup | ✅ DONE | 2026-05-05 | Forked from upstream, created feature branches |
| Create feature branches | ✅ DONE | 2026-05-05 | feature/v3-event-editor, feature/v3-commands-batch1/2, feature/v3-data-packs, feature/v3-dashboard |
| Merge upstream develop (initial) | ✅ DONE | 2026-05-05 | Merged upstream at commit 0139431 (v2.9.1 era, React 19 migration complete) |
| Local Phase 1 work (partial Phase 1) | ✅ DONE | 2026-05-05 | EventService.ts, commandParameters.ts, duplication/context menu, saveEventTree extensions — 4 commits |
| **Re-sync with upstream v2.10.0 (CRITICAL)** | ✅ DONE | 2026-07-21 | Merged upstream/develop (13 commits ahead, through v2.10.0 + 7). feature/v3-event-editor merged (1 merge conflict resolved). See V3_ROADMAP for upstream overlap analysis. |
| Setup CI/CD (GitHub Actions) | 🔄 DEFERRED | — | Out of scope for this sync pass; scheduled for Phase 1 completion |
| Documentation setup | ✅ DONE | 2026-05-05 + 2026-07-21 | V3_ROADMAP.md, V3_TRACKING.md updated with current state, architecture changes, backlog items |
| Local dev environment validation | ✅ DONE | 2026-07-21 | npm ci (1089 packages), npm run lint (348 warnings, 0 errors) — no breaking changes |

**Blockers:** None  
**Notes:** Phase 1.5 (Feature Flags config, #662) must complete before Phase 2 starts. Phase 1 Event Editor work awaits upstream ShowMessage reconciliation decision (see V3_ROADMAP).

---

## Phase 1: Event Editor Core

**Target Duration:** Week 3-6  
**Actual Duration:** Partially complete (2026-05-05 — ongoing)  
**Progress:** 5/7 tasks done, 2 blocked on design/integration decisions

| Task | Status | Owner | Upstream Issue | Notes |
|------|--------|-------|-----------------|-------|
| Extend EventNode models | ✅ DONE | Claude | #729 | Full type system via commandParameters.ts (1091 lines) |
| Implement EventService | ✅ DONE | Claude | — | CRUD, validation, persistence in src/services/EventService.ts (410 lines) |
| Enhanced event persistence | ✅ DONE | Claude | — | saveEventTree.ts extended with backup/atomic-write/validation (+251 lines) |
| Event duplication & context menu | ✅ DONE | Claude | #1.4 (local) | Ctrl+D keyboard shortcut, right-click menu with Delete option |
| **Upstream ShowMessage reconciliation** | ⏳ BLOCKED | — | #758 (upstream) | **Open decision:** adapt EventService/commandParameters to wrap upstream's real ShowMessageCommand, or drop Message placeholder metadata? Must resolve before Phase 1 gate |
| Create CommandFactory registry | ⬜ TODO | — | — | Extensible registry for all 70+ command types (currently EventService handles generically) |
| Unit tests (EventService + Phase 1) | ⬜ TODO | — | — | 80%+ coverage target for all Phase 1 code |
| Documentation (EVENT_SYSTEM.md) | ⬜ TODO | — | — | Architecture & usage guide for EventService, commandParameters, duplication system |

**Critical Path:**
1. **GATE:** Upstream ShowMessage reconciliation (blocks further message-command work)
2. CommandFactory registry + Command base classes
3. EventService → Event.page.tsx integration (already partially done)
4. Testing & documentation

**Blockers:** None (Phase 0 complete, but ShowMessage reconciliation is an internal gate)  
**Dependencies:** Feature Flags config (#662, Phase 1.5) must be in place before shipping Phase 1 to develop

---

## Phase 1.5: Technical Foundation — Feature Flags

**Target Duration:** Week 6-7  
**Current Status:** Not started  
**Progress:** 0/1 completed

| Task | Issue | Status | Owner | Notes |
|------|-------|--------|-------|-------|
| Feature flag config file (#662) | #662 | ⬜ TODO | — | Must complete BEFORE Phase 2 merges to develop to avoid exposing unfinished v3 features |

**Blockers:** None (can start immediately)  
**Dependencies:** None (independent feature)  
**Blocked By:** None  
**Notes:** CRITICAL blocker for Phase 2. Without this, v3 commands would be visible in release builds and break compatibility.

---

## Phase 2: Event Commands Batch 1

**Target Duration:** Week 7-11 (adjusted: after Phase 1.5 complete)  
**Current Status:** Not started  
**Progress:** 0/13 main commands + Condition Registry/Builder (architectural change)

### Message Commands

| Command | Issue | Status | Owner | Tests | Docs |
|---------|-------|--------|-------|-------|------|
| ShowMessage | #588 | ✅ DONE (upstream) | — | ✅ | ✅ |
| ShowChoices | #590 | ⚠️ UPSTREAM WIP | — | — | — |
| Speakers/Names | #591 | ⬜ TODO | - | ⬜ | ⬜ |
| Message Window | #592 | ⬜ TODO | - | ⬜ | ⬜ |

**Note:** #590 has an active upstream branch — do NOT duplicate. Wait for upstream status.

### Flow Control Commands — Conditional Branching (ARCHITECTURE CHANGE)

| Command/Component | Issue | Status | Owner | Notes |
|-------------------|-------|--------|-------|-------|
| **MVP Condition Registry** | #781 | ⬜ TODO | — | Declarative catalog of conditions. **Blocks:** #780. CRITICAL dependency. |
| **Condition Builder** | #780 | ⬜ TODO | — | Generic visual composer. Depends on #781. |
| Loop | #639 | ⬜ TODO | - | ⬜ TODO |
| Break Loop | #640 | ⬜ TODO | - | ⬜ TODO |
| Wait | #641 | ⬜ TODO | - | ⬜ TODO |
| Stop Event | #642 | ⬜ TODO | - | ⬜ TODO |
| Go To (Jump) | #643 | ⬜ TODO | - | ⬜ TODO |
| Call Event | #644 | ⬜ TODO | - | ⬜ TODO |

### Event Trigger Commands — New Issue Cluster

| Command | Issue | Status | Owner | Notes |
|---------|-------|--------|-------|-------|
| Event Trigger Command | #636 | ⬜ TODO | — | Design prep closed (#752). |
| Trigger Priorities | #765 | ⬜ TODO | — | NEW (2026-07-16) — depends on #636 |
| Event Entry Point Validation | #766 | ⬜ TODO | — | NEW (2026-06-06) — design/analysis needed |
| Preserve RMXP Trigger Semantics | #767 | ⬜ TODO | — | NEW (2026-06-06) — **scope may change due to #743 (v2.10.0)** |

### Game Data Commands

| Command | Issue | Status | Owner | Tests | Docs |
|---------|-------|--------|-------|-------|------|
| Variables | #567 | ⬜ TODO | - | ⬜ | ⬜ |
| Variable Control | #568 | ⬜ TODO | - | ⬜ | ⬜ |
| Local Variables | #569 | ⬜ TODO | - | ⬜ | ⬜ |
| Timer Control | #570 | ⬜ TODO | - | ⬜ | ⬜ |

**Blockers:** Phase 1 + Phase 1.5 (Feature Flags)  
**Notes:** Start after Event Editor Core is solid AND feature flags are gated. Condition Registry/Builder is a major architectural change from the original "Conditional Branch" command plan.

---

## Phase 3: Event Commands Batch 2

**Target Duration:** Week 12-17  
**Current Status:** Not started  
**Progress:** 0/37 completed

### Battle Commands (4 issues)
- [ ] Trainer Battle (#573)
- [ ] Wild Battle (#574)
- [ ] Battle Activation (#575)
- [ ] Custom Rules (#576)

### Inventory Commands (3 issues)
- [ ] Manage Items (#577)
- [ ] Manage Money (#578)
- [ ] Give Items / PSDK (#579)

### Audio Commands (5 issues)
- [ ] Play Sound (#602)
- [ ] Stop Sounds (#603)
- [ ] Change Default Sound (#604)
- [ ] Memorize BG (#605)
- [ ] Restore BG (#606)

### Visual Effects Commands (6 issues)
- [ ] Screen Tone (#609)
- [ ] Show Animation (#610)
- [ ] Show Screen Animation (#611)
- [ ] Camera Control (#612)
- [ ] Show Emotion (#613)
- [ ] Picture Commands (#614)

### Environment Commands (4 issues)
- [ ] Change Weather (#615)
- [ ] Change Map Fog (#616)
- [ ] Change Map Panorama (#617)
- [ ] Change Battle Background (#618)

### Movement Commands (4 issues)
- [ ] Move (#561)
- [ ] Wait for Movement (#562)
- [ ] Teleport (#563)
- [ ] Teleport Player (#564)

### Player Interaction Commands (4 issues)
- [ ] Wait For Key (#631)
- [ ] Record Key (#632)
- [ ] Input Number (#633)
- [ ] Input Name (#634)

### Game Interface Commands (7 issues)
- [ ] Save Menu (#580)
- [ ] Open Save (#581)
- [ ] Open Scene (#583)
- [ ] Open Shop (#584)
- [ ] Main Menu (#585)
- [ ] Title Screen (#586)
- [ ] Plus Quest & Creature Data commands

**Dependencies:** Phase 2 completion  
**Blockers:** None known yet

---

## Phase 4: Data Packs & SDK Plugins

**Target Duration:** Week 18-21  
**Current Status:** Not started  
**Progress:** 0/2 completed

| Task | Issue | Status | Owner | Tests | Docs |
|------|-------|--------|-------|-------|------|
| Data Pack System | #83 | ⬜ TODO | - | ⬜ | ⬜ |
| SDK Plugin Manager | - | ⬜ TODO | - | ⬜ | ⬜ |

**Subtasks:**
- [ ] Create DataPack model
- [ ] Implement DataPackService
- [ ] UI for managing packs
- [ ] Import/export functionality
- [ ] Versioning & dependencies
- [ ] Create Plugin model
- [ ] Implement PluginService
- [ ] Plugin discovery system
- [ ] Plugin configuration UI

**Dependencies:** Phase 2 completion  
**Blockers:** Requires PSDK API documentation

---

## Phase 5: Dashboard & Polish

**Target Duration:** Week 22-24  
**Current Status:** Not started  
**Progress:** 0/8 completed

| Feature | Status | Owner | Priority |
|---------|--------|-------|----------|
| Project Dashboard | ⬜ TODO | - | HIGH |
| Event Editor UX improvements | ⬜ TODO | - | HIGH |
| Command palette / quick search | ⬜ TODO | - | MEDIUM |
| Keyboard shortcuts | ⬜ TODO | - | MEDIUM |
| Dark mode (if needed) | ⬜ TODO | - | LOW |
| RMXP migration tools | ⬜ TODO | - | MEDIUM |
| Supporting features | ⬜ TODO | - | MEDIUM |
| Documentation finalization | ⬜ TODO | - | HIGH |

**Dependencies:** All prior phases  
**Blockers:** None known yet

---

## Phase 6: Testing & Release

**Target Duration:** Week 25-27  
**Current Status:** Not started  
**Progress:** 0/3 completed

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Integration testing | ⬜ TODO | - | All features tested together |
| Release candidate (3.0.0-rc1) | ⬜ TODO | - | Beta testing |
| Final release (3.0.0) | ⬜ TODO | - | Production release |

**Testing Checklist:**
- [ ] All event commands functional
- [ ] Event editor performance OK (no lag with 100+ nodes)
- [ ] Save/load integrity
- [ ] Data packs working
- [ ] Plugins loading correctly
- [ ] Dashboard functional
- [ ] No console errors
- [ ] Auto-updater functional
- [ ] PSDK compatibility verified
- [ ] Multi-language support

**Blockers:** None (testing only after all features complete)

---

## Summary by Week

```
Week 1-2:   [Phase 0] Foundation
Week 3-6:   [Phase 1] Event Core
Week 7-11:  [Phase 2] Commands Batch 1
Week 12-17: [Phase 3] Commands Batch 2
Week 18-21: [Phase 4] Data Packs & Plugins
Week 22-24: [Phase 5] Dashboard & Polish
Week 25-27: [Phase 6] Testing & Release
────────────────────────────────────────
Total: ~27 weeks (estimate)
```

---

## Known Issues & Blockers

| Issue | Severity | Status | Workaround / Action |
|-------|----------|--------|---------------------|
| Upstream ShowMessage reconciliation (Phase 1 gate) | HIGH | OPEN | Decide: wrap upstream's ShowMessageCommand in EventService vs. remove placeholder metadata. See V3_ROADMAP "Upstream Overlap" section. |
| Upstream moving faster than us | MEDIUM | Active | Sync regularly with upstream develop (done: 2026-07-21). Next sync: before Phase 2 starts or ~monthly. |
| GitHub Projects Board API access | LOW | Research | Token lacks `read:project` scope. Flag for manual monthly review at https://github.com/orgs/PokemonWorkshop/projects/1/views/1 |
| Accessibility audit scope (#763) | LOW | Research | Not yet integrated into roadmap. Flag for later integration into Phase 5 or as separate accessibility sprint. |
| PSDK API documentation | MEDIUM | Research | Contact PSDK team for API specs (needed for Phase 4 plugin system). |
| Electron 41 compatibility | LOW | Verify | Current version: 41.2.0 (v2.10.0). Test build on target platforms before Phase 3. |

---

## Communication & Escalation

**Slack channels (if applicable):**
- #v3-development
- #v3-testing
- #v3-releases

**Weekly syncs:**
- Monday 10:00: Development standup
- Friday 15:00: Progress review

**Escalation path:**
1. Team lead
2. Tech lead
3. Project manager

---

## Metrics & KPIs

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Code coverage | 80%+ | 0% | Starting |
| Build success rate | 100% | N/A | Setup needed |
| PR review time | < 24h | N/A | Setup needed |
| Test execution time | < 5min | N/A | Setup needed |
| Documentation | 100% | 0% | In progress |

---

## Related Documents & References

**Local Documentation:**
- `V3_ROADMAP.md` — High-level roadmap and strategy (updated 2026-07-21)
- `V3_IMPLEMENTATION_PLAN.md` — Technical implementation details
- `V3_PROJECT_OVERVIEW.md` — Project context and goals
- `CodeGuidelines.md` — Code style and patterns
- `CONTRIBUTING.md` — Contribution guidelines

**Key Upstream Issues (discovered 2026-07-21):**
- **Sync Range (v2.9.1 → v2.10.0):** PR #727–#773 (22 commits, 259 files changed)
  - #758 "Implement the show message event command" (key overlap)
  - #743 "Deprecate RPG Maker XP for map management" (scope impact on #767)
- **Flow Control Architecture (NEW):**
  - #781 "Implement the MVP Condition Registry" (foundational, blocks #780)
  - #780 "Design and Implement the Condition Builder" (replaces old "Conditional Branch" idea)
- **Trigger-Related Cluster:**
  - #636 "Implement the Event Trigger Command"
  - #765 "Manage Trigger Priorities" (NEW 2026-07-16)
  - #766 "Validate Event Entry Points" (NEW 2026-06-06)
  - #767 "Preserve RPG Maker XP Trigger Semantics During Migration" (NEW 2026-06-06, scope TBD)
- **Design System:**
  - #624 "Prepare the Visual Scripting Design" (closed, Figma design kit established)
  - #733, #734 Figma design kit work (closed)
  - #625 "Implement the Form Design System" (open, needed for Phase 2+)
- **Feature Flags (Phase 1.5 CRITICAL):**
  - #662 "Create a config file to handle feature flags and hide event features in release mode"
- **Supporting Work:**
  - #628 "Implement the Comment Feature" (Phase 5)
  - #629 "Preview capability for Event movements" (Phase 5)
  - #763 "Accessibility Audit and Keyboard Navigation Strategy" (not yet scheduled)

**Upstream Resources (manual check required):**
- GitHub Projects Board: https://github.com/orgs/PokemonWorkshop/projects/1/views/1 (not API-queryable, `read:project` scope missing)
