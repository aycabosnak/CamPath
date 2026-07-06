# CamPath — Technical Decisions

> Format: Decision / Reason / Alternative Considered / Why Rejected / Long-Term Benefit.

---

### Why QuestionInput is shared

**Decision:** One component (`components/practice/QuestionInput.tsx`) renders every question type (multiple choice, gap fill, matching, sentence ordering) for the Placement Test, Mixed Tests, and Progress Checks.
**Reason:** All three features need identical rendering + answer-capture behavior for the identical underlying question shape (`PlacementQuestion`).
**Alternative considered:** A separate, test-specific question renderer for the new Tests Architecture, since it was built later and could have been scoped independently.
**Why rejected:** Would have created two implementations of the same four task-type renderers that could silently drift apart (e.g., a matching-question accessibility fix applied to one copy and not the other).
**Long-term benefit:** A new question task type, or an accessibility fix, is written once and applies everywhere automatically.

---

### Why Study Path is reused

**Decision:** `StudyPath`/`StudyPathNode` render both the legacy Study Path preview (My Journey) and the Level Curriculum's sequence view (`/tests/[level]`).
**Reason:** Both need the same visual language: current step emphasized, completed steps quiet, nothing ever shown as locked.
**Alternative considered:** A new, Level-Curriculum-specific "sequence" component, since the two systems have different underlying data.
**Why rejected:** Would have re-solved a visual hierarchy problem (making the "current" item stand out) that Study Path had already solved and validated through a prior UX review.
**Long-term benefit:** Any future visual refinement to "what's next" styling applies to both systems from one change.

---

### Why My Journey became the source of truth

**Decision:** `myJourneyService.getMyJourneySummary()` is the single aggregation point; pages never independently recombine progress data.
**Reason:** A Production Readiness Audit found the dashboard had drifted out of sync with a newer system (the Level Curriculum) precisely because progress data was being read in more than one place with more than one interpretation.
**Alternative considered:** Leave Milestones as a page-level concern (as they were, reading `progressService.getMilestones()` directly in the page component) since they were "just an add-on."
**Why rejected:** This was the exact pattern that caused the original drift — the fix had to bring Milestones into the same aggregator, not just the headline numbers.
**Long-term benefit:** Any future consumer of "how is this learner doing" (a teacher view, a parent view, an export) reads one function and cannot independently drift out of sync with My Journey.

---

### Why timer stores deadline instead of countdown

**Decision:** The Placement Test's timer persists an absolute epoch timestamp (`deadline = Date.now() + 15min`), and remaining time is always recomputed as `deadline - Date.now()`.
**Alternative considered:** Persist a `remainingSeconds` counter, decremented every tick and written to `localStorage` each second.
**Why rejected:** A decrementing counter drifts under `setInterval` throttling (especially in backgrounded tabs) and requires reconciling "how many ticks actually fired" after a refresh — wall-clock math has no such ambiguity.
**Long-term benefit:** The same pattern is immediately reusable for any future timed feature (a Mock Exam) with zero new drift-handling logic.

---

### Why Progress Check updates mastery

**Decision:** `recordProgressCheck` accepts an optional `skillBreakdown` and writes it directly into `progressService.masteryOverrides` — the same field Practice Weakest Skill already writes to.
**Alternative considered:** A second, Progress-Check-specific mastery field, since its measurements are more authoritative than Practice's heuristic bump.
**Why rejected:** Would have required `myJourneyService` to merge two mastery sources with a precedence rule — genuinely new logic for a problem that doesn't need to exist if there's only one field.
**Long-term benefit:** Any future third source of mastery data (e.g., a real Mock Exam) can write to the same field with no changes to how My Journey reads it.

---

### Why test IDs use levelSlug:testId

**Decision:** `progressService.testAttempts` is keyed by a composite string combining the level slug and the test id, not the test id alone.
**Reason:** Test ids like "test-1" are reused as the placeholder id across every level's Coming Soon entry — a bare testId key would silently collide the moment a second level (e.g., A2) has a real "Test 1."
**Alternative considered:** Give every level's test a globally unique id up front (e.g., "a1-test-1", "a2-test-1").
**Why rejected:** Would require renaming every existing test id and updating every route/link that references it, for a problem the composite key solves without touching existing data.
**Long-term benefit:** Levels can keep simple, human-readable test ids ("test-1," "mock-test") indefinitely without a global naming registry.

---

### Why milestones are generated only by Progress Check

**Decision:** No other action in the app (completing a lesson, completing a Mixed Test) can create a Milestone.
**Reason:** A Milestone is meant to represent "this level is genuinely done" — a single lesson or a retakeable rehearsal test doesn't carry that meaning.
**Alternative considered:** A Milestone per lesson, for more frequent positive feedback.
**Why rejected:** Explicitly rejected as too frequent, risking the exact reward-drip feeling the "No Gamification" principle exists to prevent.
**Long-term benefit:** "How many levels has this learner completed" always has exactly one unambiguous answer: their Milestone count.

---

### Why localStorage structure is organized as it is

**Decision:** Four separate keys, each owned by exactly one service:
```
campath_level_test_result   - placementTestService (write), read by myJourneyService/testsService
campath_level_test_session  - testTimerService (Placement Test's in-progress timer/answers)
campath_progress_state      - progressService (everything learner-generated post-placement)
campath_analytics_events    - analyticsService
```
**Alternative considered:** One combined key for everything.
**Why rejected:** Would mean every service needs to read and re-write a shared blob, risking one service's write clobbering another's concurrent change, and making it impossible to reason about one feature's data in isolation.
**Long-term benefit:** Each service can evolve its own stored shape (adding fields, migrating old data — see progressService's migrate() function) without needing to understand any other service's data at all.

---

### A known, accepted piece of duplication worth naming here

`RESULTS_STORAGE_KEY` (the placement result's localStorage key name) is declared independently in both `myJourneyService.ts` and `testsService.ts` rather than imported from a single constant. Harmless today (identical string, read-only in both places) but should be collapsed into one export the moment a third file needs it, to avoid the two copies silently diverging.
