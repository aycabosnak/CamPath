# CamPath — Project Status

> An honest snapshot of exactly where the project stands today. No marketing language.

---

## Latest Implementation Phase — Credible V1 Phase 7 (verification)

Phase 7 is closed. This phase was verification-only: no new features, no redesign, and no storage/URL migration.

**Credible V1 status: verified complete** for the local, single-device learner journey. No unresolved P0/P1 defects were found. Remaining Coming Soon areas and known limitations below are accepted product gaps, not verification failures.

### Commands and results

| Command | Result |
|---|---|
| `npm run validate:content` | Passed: 283 questions, **0 errors**, 22 warnings (21 construct-overlap, 1 generic-prompt). Unchanged from Phase 5. |
| `npx tsc --noEmit` | Passed |
| `npm run build` | Passed (31/31 pages) |
| `npm run lint` | **Not run.** There is no ESLint config; `next lint` would prompt interactively. ESLint was not introduced. |

A clean `next dev` on `http://localhost:3012` was used for browser QA after `npm run build` invalidated `.next` on the previous port.

### Final verification matrix

| Area | Result | How verified |
|---|---|---|
| Placement 12-item flow | Pass | Browser on `localhost:3012` after `localStorage.clear()` |
| Placement refresh/session persistence | Pass | Browser: resume at Q2 with stored `pt_grammar_1`; matching object persisted |
| Q5/Q6 independent two-play limits | Pass | Browser: Plays 0/2 → 1/2 → 2/2; Restart disabled; third play did not increment; Q6 started at 0/2; refresh kept Q5 at 2/2 |
| Transcripts hidden during answering, visible in review | Pass | Browser |
| Result storage + existing 20/40/55/70/85 thresholds | Pass | Browser result shape + harness golden/empty/perfect scoring |
| Empirical calibration still documented | Pass | `docs/AssessmentDesign.md`, this file, `placementQuestions.ts`, `HANDOFF.md` |
| Practice without Placement | Pass | Browser on fresh origin `127.0.0.1:3012` (1/3 scored; mastery not written; no `campath_progress_state`) and service harness |
| Practice with Placement | Pass | Browser: 1/3 blended Grammar 0% → 12% (`PRACTICE_BLEND = 0.35`); Placement result key unchanged |
| Sentence-ordering navigation/refresh | Pass | Browser on `127.0.0.1:3012`: Q8 reorder persisted through refresh; Next stayed enabled |
| Mixed Test E2E | Pass | Browser: 7 questions; review hidden before submit; stored `a1-elementary:test-1` `{completedAt, correctCount: 2, totalCount: 7}`; post-submit review visible |
| Mixed Test Listening placeholder | Pass | Browser: “Audio will be added soon.” |
| Progress Check E2E | Pass | Browser: review hidden before submit; SET mastery (not blend); milestone `Completed A1 Elementary` once; stored `{correctCount: 7, totalCount: 10}`; Mixed Test attempt untouched; post-submit review visible |
| Lesson completion survives refresh | Pass | Browser: `a1-grammar-1` in `curriculumCompletions`; legacy `completions` stayed `{}`; refresh still showed Completed |
| My Journey consistency | Pass | Browser: Master/C2, current level C1 Advanced, mastery matches Placement + practice blend + Progress Check SET, no Study Path card |
| Route integrity (no unexpected 404) | Pass | HTTP 200 on listed learner, legacy, and scaffold routes |
| Coming Soon honesty | Pass | Browser copy on hubs, Practice browse, Mixed Test `review-test`/`mock-test`, C1 Listening, B2 Writing Practice |
| Responsive QA | Pass | Viewport emulation 375 / 768 / 1280: no horizontal overflow on Placement SO, results review, Practice, Mixed Test take, Home, My Journey |
| Persistence regression | Pass | Keys/shapes unchanged after refresh; no migration |

### Browser / manual QA coverage

Clean server: `http://localhost:3012` (learner state after a fresh `localStorage.clear()`, then the full journey). Fresh origin: `http://127.0.0.1:3012` (empty storage) for no-Placement practice, B2 Writing / C1 Listening unavailable copy, and sentence-ordering refresh.

Automation used in-page DOM clicks (`element.click()`), not CDP `Input.*`. Full Placement, Mixed Test, Progress Check, lesson, and practice submissions were performed in the browser.

**Harness-substituted verification**

- Service-level scoring, blend math (`40 + (100-40)*0.35 = 61`), Progress Check SET + milestone-once, Mixed Test coming-soon `null`, curriculum completion idempotency, and legacy `UNIT_LESSONS` presence were asserted in a temporary Node harness (deleted after the run).
- Practice without Placement was **also** browser-verified on `127.0.0.1:3012`. It was not re-tested by deleting `campath_level_test_result` on `localhost:3012` (an interaction guard blocked mutating that key).
- Placement audio layout was verified during the full 12-item run at the default ~608px width. Jumping the in-progress session index to re-open Q5 at 375px was blocked; 375px audio-row layout was not re-run. Sentence-ordering, Next, nav (44px), and overflow were measured at 375px. Practice `.skill-action` chips were 44px at 375px.

**Not claimed as a browser pass**

- Directly deleting the Placement result key on the populated `localhost:3012` origin.

### Unresolved issues

None at P0/P1.

Non-blocking notes (not treated as Phase 7 defects):

- Unlisted `/tests/grammar-shorts` returns HTTP 200 with “Level not found.” (not linked from Home/Tests).
- Legacy `/learn/grammar` and `/practice/grammar/a1-elementary` remain honest scaffold placeholders.
- Sentence-ordering ↑/↓ controls remain 32px secondary buttons; nav, Next, and skill-actions meet 44px. P2 only.

## Completed Systems

- **Navigation & shell:** Navbar (Home / Learn / Tests / Practice / My Journey) with a prominent Placement Test action; simplified footer with real level and platform links. Scoped correctly to `(public)`/`(auth)` only.
- **Home page:** Focused introduction to Find My Level, Learn by Level, Practice/Test, and My Journey, with Placement as the primary CTA and Browse Levels as the secondary CTA.
- **Placement Test:** 12 mixed-task-type questions spanning foundation through advanced non-listening evidence, 15-minute timer (persists deadline + full session across refresh), Time Expired handling, and two unique Listening questions with independent persistent two-play limits.
- **Results page:** CEFR/Stage result, Mastery by Skill, Exam Readiness gauge, Question Review (collapsible, filterable), Recommended Study Plan, "Completed within/after time limit" status.
- **My Journey:** Level Curriculum dashboard prioritising recommended next action, current-level progress, mastery, completed learning, and milestones. The unused Study Path preview was removed in Phase 6; Phase 7 confirmed no dead UI.
- **Tests Architecture:** `/tests` is assessment discovery; `/tests/[level]` is the level hub; lessons, Mixed Tests, and Progress Checks use level-agnostic routes and data-driven services. All available Mixed Tests and Progress/Bridge Checks include authored post-submission item review.
- **Practice:** purpose-owned non-listening questions across genuinely available level/skill combinations, plus the separate Practice-only Listening bank for A1–B1. Weak-skill recommendations require Placement; direct manual level/skill sessions do not.
- **Design System:** full token set (color, type, spacing), component library (Button, Card family, Badge family, ProgressBar, MasteryBar, ReadinessGauge, Form fields), internal preview page.
- **Analytics:** event logging to console + localStorage (no real backend).
- **Content gate:** `npm run validate:content` is a no-dependency build-time check for IDs, answers, signatures, audio ownership/paths, and content-to-level routes. Warnings do not fail the current repository.

## Completed Curriculum

- **A1 Elementary:** 4 lessons (Grammar/Vocabulary/Reading/Writing), 1 Mixed Test, 1 Progress Check. Passed a full UX review and educational review.
- **A2 Pre-Intermediate:** Same structure. Passed a full educational quality audit, including a full assessment-alignment correction (Vocabulary/Reading sections were rewritten after failing the "traces back to a taught lesson" check).
- **B1 Intermediate:** Ported from the legacy Study Path into the Level Curriculum system, expanded to 3 questions per lesson, added a Reading lesson (didn't exist before), and had its Mixed Test rewritten section-by-section for alignment. Progress Check added.
- **B1+ Bridge to B2:** Same 4-lesson structure (Present Perfect Continuous, Environment & Technology, Reading for Inference, For-and-Against Essays), 1 Mixed Test, 1 Bridge Check. Built proactively following the passage-reuse rule from day one — audited before release, not after.
- **B2 Upper-Intermediate:** 7 lessons (4 Grammar, Vocabulary, Reading, Writing), 1 Mixed Test, 1 Progress Check. Writing teaches and assesses formal reporting and controlled paraphrase.
- **C1 Advanced:** 6 lessons (Grammar, Vocabulary, Reading, Writing), 1 Mixed Test, 1 Progress Check.

## Known Limitations / Coming Soon

- **Placement Test is heuristic, not psychometric.** It remains a fixed 12-item test with equal item weighting, only two items per skill, and Listening discrimination only through B1. Its threshold mapping (20/40/55/70/85) has not been empirically calibrated and should not be presented as a validated diagnostic.
- **No real authentication.** /login is an honest placeholder page. All learner data lives in localStorage, tied to one browser on one device.
- **No real backend.** Every service is written to be replaceable by a real API later, but none exists yet.
- **Legacy Study Path still exists, unmigrated.** 3 orphaned but routable lessons (`/learn/unit-1|2|3`), tied to CamPath Stage rather than the Level Curriculum. Its stored completion namespace is preserved for compatibility but it is no longer the learner-facing primary path.
- **Focused B2 Writing Practice remains Coming Soon.** The dedicated lesson exists (Learn only on the B2 hub). Direct Practice says there aren't any practice questions for this skill.
- **Listening lessons remain Coming Soon.** Real Practice-only audio exists for A1–B1 and unique Placement audio exists for Questions 5–6; Mixed Test, Progress Check, and lesson audio banks remain empty by design. C1 Listening Practice is labelled unavailable because audio has not been added.
- **Use of English lessons and focused Practice remain Coming Soon** at every level.
- **Speaking has no lesson or assessment format** and remains deferred.
- **Mock Exams / Review Tests are not implemented** — Coming Soon / “This test isn't available yet.”
- **Grammar Shorts has no content** — metadata only; the unlisted URL shows “Level not found.”
- **Search (Home/Nav/Tests expansion, Step 3) was never started.**
- **Marketing/info pages** (About, Cambridge Preparation as a standalone page, UK Language School, dedicated FAQ page, Privacy Policy, Terms) do not exist — FAQ content exists inline on Home instead, not as a separate page.

## Persistence contract (unchanged)

| Key | Purpose |
|---|---|
| `campath_level_test_result` | Placement result blob (`PLACEMENT_RESULT_STORAGE_KEY`) |
| `campath_level_test_session` | In-progress Placement session: `{ deadline, index, answers, listeningPlays? }` |
| `campath_progress_state` | `{ completions, curriculumCompletions, testAttempts, progressChecks, milestones, studyTimeMinutes, studyDates, masteryOverrides }` |
| `campath_analytics_events` | Analytics |

Mixed Test attempts remain keyed `${levelSlug}:${testId}`. Practice mastery **blends** (`PRACTICE_BLEND = 0.35`) only when a Placement result exists. Progress Check **SETS** `masteryOverrides`.

## Technical Debt

- lib/api-client/* — a full REST client layer built ahead of the not-yet-existing real backend. Currently unused. Intentional, not abandoned, but worth confirming still matches the API shape once a real backend is built.
- services/readinessCalculator.ts — unused, built ahead of Mock Exams.
- Two parallel progress data namespaces (completions vs. curriculumCompletions) inside one ProgressState — resolved at the dashboard level (My Journey reads Level Curriculum only) but not at the data level (still two systems, not one).
- StudyPath's Guided/Free mode toggle (`onModeChange`) is exercised only in the internal Design System preview — no real product screen currently offers a mode switch. Documented capability, not currently used; not removed.

**Resolved during the Engineering Cleanup Sprint (2026-07):**
- ~~`/my-journey/study-path/[level]` scaffold stub~~ — deleted. Unreachable, and its purpose (a full Study Path view) is now served by `/tests/[level]`'s StudyPath rendering; unlike other scaffold pages, this wasn't a future feature, it was a superseded one.
- ~~Date formatting duplicated identically in three places~~ — extracted to `lib/formatDate.ts`.

## Deferred Features

- Real accounts / authentication
- Real backend / database
- Unique Listening banks for lessons, Mixed Tests, and Progress Checks; Speaking still needs a separate resourcing decision.
- Speaking (Listen/Repeat/Shadow/Record framework — designed in early planning, never built)
- Real Mock Exams
- Search
- Standalone marketing/info pages (About, Privacy, Terms, etc.)
- Migrating or retiring the legacy Study Path
- Empirical calibration of Placement thresholds

## Current Production Readiness

**Ready for:** internal use of the verified local, single-device Credible V1 learner journey.

**Not ready for:** a paid/design-partner production pilot that needs accounts, a backend, or a psychometrically calibrated Placement Test. Learner data does not survive a cleared browser or a new device.

## Recommended Next Steps

Phase 7 is the last planned Credible V1 phase. Do not start a new phase unless explicitly requested.

If work continues later, in order:

1. Revisit remaining item quality only when the content gate or learner evidence identifies a concrete problem.
2. Add unique Listening banks per purpose before enabling Listening in lessons or assessments.
3. Keep backend/auth migration deferred until there is an explicit product decision to leave the localStorage V1.
