# CamPath — Progress System

> Explains how learner progress is tracked, aggregated, and displayed — and how two historically separate systems now coexist under one dashboard.

---

## 1. My Journey — What It Is

`app/(auth)/my-journey/page.tsx` is the single dashboard screen. It contains no business logic of its own — every number and recommendation it displays comes from one function call: `myJourneyService.getMyJourneySummary()`. If a future page needs the same data (e.g., a future "Teacher view of a student"), it should call this same function rather than re-deriving any of these numbers.

---

## 2. Overall Progress

**Owned by:** `myJourneyService.ts`
**Source of truth:** `curriculumService.getLevelProgress(currentLevelSlug)` — the count of completed vs. total items (lessons + Mixed Test + Progress Check) in the learner's **current level**.

This was, until the architecture unification, computed from the legacy Study Path instead (a fixed 3-unit path tied to CamPath Stage). It now reflects real Level Curriculum progress — see Section 9 for why both systems exist and how this changed.

---

## 3. Current Level

**Owned by:** `myJourneyService.getCurrentLevelSlug()`
**Logic:** Start at the Tests-level slug matching the Placement Test's recommended CamPath Stage (`constants/testLevels.getTestLevelSlugForStage`). Then walk forward through `TEST_LEVELS` (skipping `grammar-shorts`, which isn't sequential) past any level whose Milestone already exists (`progressService.getMilestones()`). The first level *without* a Milestone is "current."

This single function is what makes the whole system scale to B1 through C1 with no further code changes — see `TechnicalDecisions.md`.

---

## 4. Completed Learning Items

**Displayed as:** "Completed Learning Items" (renamed from "Completed Units" for clarity)
**Meaning:** Completed vs. total items in the **current level only** — the same numbers behind Overall Progress's percentage, shown as a raw count instead.

**Deliberately not combined** with the legacy Study Path's 3-unit count. Two systems measuring different things (a fixed legacy path vs. a growing multi-level curriculum) were kept as one clear number rather than one confusing merged one.

---

## 5. Milestones

**Owned by:** `progressService.ts` (`recordProgressCheck`, `getMilestones`)
**Fires:** Exactly once per level, only when a Progress Check is completed (never from a lesson, never from a Mixed Test). Idempotent — retaking a Progress Check updates its score record but never duplicates the Milestone.
**Displayed:** Flows through `myJourneyService`'s summary (`summary.milestones`) — the page component does not call `progressService.getMilestones()` directly (this was a specific fix; see `TechnicalDecisions.md`).
**Data shape:** `{ id: levelSlug, label, achievedAt, isBridge }` — `id` is the levelSlug itself (structured data), not just a display string, so future features can reason about "which levels are done" programmatically.

---

## 6. Mastery

**Owned by:** `progressService.masteryOverrides` (a single `Partial<Record<Skill, number>>`)
**Written by two different sources, deliberately using the same field:**
- **Practice Weakest Skill** — a heuristic "bump toward mastery" (`recordPracticeSession`), simulating a short practice session
- **Progress Check** — a real, measured per-skill breakdown computed from the check's own questions (`recordProgressCheck`'s `skillBreakdown` parameter), which **sets** rather than bumps the value

`myJourneyService` reads this one field without caring which source wrote it most recently — no merge logic needed, because there's only one field to read.

---

## 7. Progress Checks

**Owned by:** `progressService.ts` (`recordProgressCheck`, `getProgressCheckRecord`)
Stores `{ completedAt, correctCount, totalCount }` per level. Retaking overwrites the score record (the latest attempt is what's shown) without affecting the already-fired Milestone.

---

## 8. Practice Weakest Skill

**Page:** `app/(public)/practice/weakest-skill/page.tsx`
Reads `masteryBySkill` from `myJourneyService`, finds the two lowest, and — since no real Practice exercise content exists yet — "Start Practice" simulates completing a session via `recordPracticeSession`. This is an explicitly named placeholder heuristic, not a permanent design (see `PROJECT_STATUS.md`).

---

## 9. How Legacy Study Path Coexists With the New Level Curriculum

**Why two systems exist:** Study Path (`unit-1/2/3`, tied to CamPath Stage) predates the Level Curriculum (Tests-level-based: `a1-elementary`, etc.). When the Level Curriculum was built, Study Path was deliberately left untouched to avoid cross-contaminating a working system with an unproven new one.

**The problem this created:** a Production Readiness Audit found My Journey's headline metrics were reading *only* from Study Path — meaning a learner doing 100% of their real work in the new A1/A2 curriculum would see a dashboard that never reflected it.

**The fix (architecture unification):** `myJourneyService` now treats the Level Curriculum as primary for Overall Progress, Completed Learning Items, and Recommended Next Step. Study Path is **not removed** — it's still computed (`buildStudyPathPreview`) and still shown in its own labeled "Study Path" card — it simply no longer drives the dashboard's headline numbers.

**Current state:** two parallel data namespaces inside `progressService`'s single `ProgressState`:
```ts
completions: Record<string, LessonCompletionRecord>            // legacy Study Path (unit-1/2/3)
curriculumCompletions: Record<string, LessonCompletionRecord>  // Level Curriculum (a1-grammar-1, etc.)
```
These are kept in explicitly separate fields, on purpose, so a bug in one can never silently corrupt the other's data.

**What isn't yet resolved:** Study Path itself has not been retired or migrated into the Level Curriculum system. It remains a smaller, parallel, unexpanded feature. See `PROJECT_STATUS.md` for whether/when this should happen.
