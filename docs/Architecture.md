# CamPath — Architecture

> Internal engineering documentation. Describes the system as it exists today, not as planned or aspirational. Written for an engineer who has never seen this codebase before.

---

## 1. Overall Application Architecture

CamPath is a Next.js 14 (App Router) application, currently running entirely client-side against `localStorage` as its persistence layer — there is no real backend yet. Every service in `services/` is written as if it were already talking to a real API (`async` functions, typed responses), specifically so that swapping `localStorage` reads for real `fetch` calls later touches only the inside of these service files, never the pages or components that call them.

```
Browser
  │
  ▼
Page component (app/**/page.tsx)
  │  calls
  ▼
Service layer (services/*.ts)          ← the only layer allowed to read/write localStorage
  │  reads/writes
  ▼
localStorage (today)  →  future: real API (Database & API Design doc)
```

Static educational content (lessons, tests, progress checks) lives in `lib/mock-data/*.ts` as plain TypeScript object literals — not in `localStorage`. Only *learner-generated* state (completions, scores, milestones, mastery, timers) is persisted.

---

## 2. Folder Organization

```
app/                    Next.js App Router — see Section 3 (Routing Philosophy)
  (public)/             No auth required
  (auth)/               Student-only pages (auth not yet real — see Deferred Features)
  (teacher)/             Teacher-only pages (scaffolded, not built out)
  (internal)/            Dev/QA-only (blocked in production by middleware.ts)
  layout.tsx             Root layout — html/body only, no Navbar/Footer here

components/
  ui/                    Design-system primitives (Button, Card, Badge, ProgressBar, ...)
  study-path/            StudyPath / StudyPathNode — reused by both progress systems
  practice/              QuestionInput — the one shared question-rendering engine
  curriculum/            CurriculumLessonView — the Level Curriculum lesson template
  dashboard/             MyJourneyMetricCard
  nav/                   Navbar, Footer
  lib/cn.ts              classnames helper
  types.ts               UI-facing prop unions (NOT the same as domain/entity types)

services/                One file per responsibility — see Section 4
lib/mock-data/           Static content — see Section 4
constants/               Fixed lookup tables (CEFR/Stage mappings, test level metadata)
```

---

## 3. Routing Philosophy

Route groups exist purely to scope **layout**, not to change URLs (Next.js strips the parenthesized segment from the resolved path).

| Group | Gets | Why |
|---|---|---|
| `(public)` | Navbar + Footer | Home, Placement Test, Tests, Practice — everything a first-time visitor can reach |
| `(auth)` | Navbar + Footer | My Journey and other student-only pages — same chrome as public, different access assumption |
| `(teacher)` | Nothing | Scaffolded only, never built out, never linked from navigation |
| `(internal)` | Nothing | Design System preview — actively blocked in production by `middleware.ts` |

**Dynamic vs. static routes:** Content that's fixed and small (Study Path's `unit-1`, `unit-2`, `unit-3`; `login`) gets its own static folder. Content that scales with the curriculum (`/tests/[level]`, `/tests/[level]/[testId]`, `/tests/[level]/lessons/[lessonId]`, `/tests/[level]/progress-check`) uses dynamic segments so that adding B1, B2, or C1 requires **zero new route files** — only new entries in the `lib/mock-data/*.ts` content tables.

A technical note worth documenting explicitly: `unit-1/2/3` (static routes, under `(public)/learn/`) and `/tests/[level]/lessons/[lessonId]` (dynamic route) are **two different route trees serving two different content systems** — see `ProgressSystem.md` for why both still exist.

---

## 4. Separation of Services

| Service | Owns | Reads/writes |
|---|---|---|
| `placementTestService.ts` | Placement Test scoring, question review, study plan generation | Nothing itself — pure functions over data passed in |
| `myJourneyService.ts` | The **aggregated** My Journey dashboard summary — the only file allowed to combine data from multiple other services into one shape | Reads `placementTestService`, `progressService`, `curriculumService` output; writes nothing |
| `progressService.ts` | All learner-generated state: lesson completions (both systems), test attempts, progress check results, milestones, study time, mastery overrides | `localStorage["campath_progress_state"]` — the single most important key in the app |
| `curriculumService.ts` | Accessor + traversal logic for the Level Curriculum (lessons, sequencing, next-step resolution) | Reads `lib/mock-data/curriculumLessons.ts`, `progressChecks.ts`, and (via dynamic import) `progressService` |
| `testsService.ts` | Level metadata + Mixed Test accessors, Placement-Test-driven level recommendation | Reads `constants/testLevels.ts`, `lib/mock-data/tests.ts`, `localStorage["campath_level_test_result"]` |
| `testTimerService.ts` | Placement Test's timed-session persistence (deadline, index, answers) | `localStorage["campath_level_test_session"]` |
| `analyticsService.ts` | Event logging | `localStorage["campath_analytics_events"]` + `console.log` |
| `unitLessonService.ts` | Legacy Study Path lesson accessor | Reads `lib/mock-data/unitLessons.ts` |
| `readinessCalculator.ts` | **Unused today.** Built ahead of the not-yet-implemented Mock Exam feature (converts a future `MockExamSession.overall_result` enum into the UI's `ReadinessStatus`). Left in place intentionally — see `PROJECT_STATUS.md`. |

**Known, accepted duplication:** `RESULTS_STORAGE_KEY = "campath_level_test_result"` is declared independently in both `myJourneyService.ts` and `testsService.ts`, rather than imported from one place. Harmless today (same string, same read-only usage) but worth collapsing into one export if a third consumer appears.

---

## 5. Component Hierarchy

```
ui/*            — never know about domain concepts (no "lesson", no "level")
  ↑ composed by
study-path/*, practice/*, curriculum/*, dashboard/*   — domain-aware, still reusable across features
  ↑ composed by
app/**/page.tsx — one specific screen, wires services to components
```

The rule that has held throughout: a component only moves "up" this hierarchy (from page-local JSX into a shared folder) once a **second** real caller needs it. `QuestionInput` and `getLevelProgress` (a service-layer equivalent of this same rule) are the two clearest examples — both were extracted only after a second consumer appeared, not speculatively.

---

## 6. Data Flow — One Concrete Example

Completing an A2 lesson, traced end to end:

```
CurriculumLessonView (component)
  → progressService.completeCurriculumLesson(lessonId, minutes, allCorrect)
      writes to localStorage["campath_progress_state"].curriculumCompletions
  → curriculumService.getNextStepAfterLesson(levelSlug, lessonId)
      reads the same lesson list, returns { label, href } for the next item
  → learner clicks through
  → (later) my-journey/page.tsx
  → myJourneyService.getMyJourneySummary()
      → curriculumService.getLevelProgress(currentLevelSlug)
          reads progressService.isCurriculumLessonCompleted() per lesson
      → produces Overall Progress / Completed Learning Items / Recommended Next Step
```

No page ever reads `localStorage` directly for this data — `progressService` is the sole gate.

---

## 7. Why This Architecture Was Chosen

- **Service-layer indirection** exists so a real backend can replace `localStorage` later by editing service internals only — every page already treats its service calls as if they were `fetch`.
- **Route groups over a single flat `app/`** exist so role-specific chrome (or its absence, for `(teacher)`/`(internal)`) is enforced structurally, not by convention that could be forgotten on a new page.
- **Mock data as TypeScript objects, not JSON or a database**, was chosen for zero-setup local development and full type-checking of content — the tradeoff (content changes require a code change) is accepted for now and named explicitly in `PROJECT_STATUS.md` as technical debt once a CMS-like authoring flow is needed.

---

## 8. Scalability Decisions

The single most important scalability property in the codebase: **`myJourneyService.getCurrentLevelSlug()` and `curriculumService.getLevelProgress()` are level-agnostic.** Neither function contains a reference to `"a1-elementary"` or `"a2-pre-intermediate"` specifically — they operate on whatever `TEST_LEVELS` and `lib/mock-data/*.ts` contain. This is why A2 required zero service or page changes, only new content-table entries (see `Curriculum.md`).

---

## 9. Reusable Systems

| System | Reused by |
|---|---|
| `components/practice/QuestionInput.tsx` | Placement Test, Mixed Tests, Progress Checks |
| `components/study-path/StudyPath.tsx` | Legacy Study Path preview (My Journey) AND the Level Curriculum's sequence view (`/tests/[level]`) |
| `services/curriculumService.getLevelProgress()` | The level page's StudyPath rendering AND My Journey's dashboard numbers |
| `progressService.masteryOverrides` | Written by both Practice Weakest Skill and Progress Check completion |

---

## 10. Source of Truth — Per Feature

| Feature | Source of truth |
|---|---|
| CEFR level / Stage from Placement Test | `localStorage["campath_level_test_result"]`, written once by the Placement Test, read by `myJourneyService` and `testsService` |
| Current level (for My Journey) | Computed, not stored — `myJourneyService.getCurrentLevelSlug()`, derived fresh every load from placement result + milestones |
| Lesson/test/progress-check completion | `localStorage["campath_progress_state"]`, owned exclusively by `progressService.ts` |
| Level content (lessons, tests, progress checks) | Static TypeScript data in `lib/mock-data/*.ts` — never mutated at runtime |
| Level metadata (names, CEFR, bridge text) | `constants/testLevels.ts` |
