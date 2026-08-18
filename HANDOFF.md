# CamPath Handoff

Last updated: 2026-08-18

## Current phase

Credible V1 Phase 7 verification is complete and closed. Do not start a new phase unless explicitly requested.

**Credible V1 status: verified complete** for the local, single-device learner journey. No unresolved P0/P1 issues.

## What this phase did

Verification-only. No features, redesign, URL migration, or storage migration. No P0/P1 product patches were required.

A temporary Node harness (`.phase7-verify.cjs`) was used for service-level asserts and then deleted.

## Commands and results

- `npm run validate:content` — passed (283 questions, 0 errors, 22 warnings).
- `npx tsc --noEmit` — passed.
- `npm run build` — passed (31/31 pages).
- `npm run lint` — not configured (interactive ESLint setup prompt). Skipped on purpose.

Browser QA used a clean `next dev` on `http://localhost:3012`. Fresh-origin checks used `http://127.0.0.1:3012` so existing Placement data was not deleted.

## Final verification matrix

| Area | Status | Notes |
|---|---|---|
| Placement 12-item + session persist + Q5/Q6 two-play + transcripts + result storage | Pass | Browser |
| Existing 20/40/55/70/85 thresholds | Pass | Browser + harness; still documented as needing empirical calibration |
| Practice without Placement | Pass | Browser on `127.0.0.1:3012` + harness. Scores; does not write mastery |
| Practice with Placement | Pass | Browser: Grammar 0% → 12% blend; Placement key unchanged |
| Sentence-ordering refresh | Pass | Browser: Q8 order survived reload |
| Mixed Test E2E | Pass | Scoring, `a1-elementary:test-1` `{completedAt, correctCount, totalCount}`, review after submit only; Listening “Audio will be added soon.” |
| Progress Check E2E | Pass | SET mastery, milestone once, stored record shape, review after submit |
| Lesson refresh | Pass | `curriculumCompletions['a1-grammar-1']`; legacy `completions` untouched |
| My Journey | Pass | Placement / mastery / completions internally consistent; no Study Path UI |
| Routes | Pass | Listed learner + `/learn/unit-*` HTTP 200; no unexpected 404 |
| Coming Soon honesty | Pass | Hubs, Practice browse, mock/review tests, C1 Listening, B2 Writing Practice |
| Responsive 375 / 768 / 1280 | Pass | No horizontal overflow on inspected flows |
| Persistence keys/shapes | Pass | No corruption or migration on refresh |

## Harness-substituted verification

- Blend math, empty/perfect Placement scoring, Progress Check SET + milestone-once, Mixed Test coming-soon `null`, curriculum completion idempotency.
- Practice without Placement was **also** browser-verified on a second origin. Deleting `campath_level_test_result` on the populated `localhost:3012` origin was blocked by an interaction guard and was not performed.
- 375px Placement audio-row was not re-opened (session-index rewrite blocked). Two-play audio behaviour was browser-verified during the full Placement run at default width.

## Persistence contract (do not change)

- `campath_level_test_result` — Placement result (`PLACEMENT_RESULT_STORAGE_KEY`)
- `campath_level_test_session` — in-progress Placement `{ deadline, index, answers, listeningPlays? }`
- `campath_progress_state` — `{ completions, curriculumCompletions, testAttempts, progressChecks, milestones, studyTimeMinutes, studyDates, masteryOverrides }`
- Mixed Test attempts keyed `${levelSlug}:${testId}`
- Practice blends (`0.35`) only with a Placement baseline; Progress Check SETS mastery

## Remaining known limitations / Coming Soon

- Placement remains a fixed 12-item, equal-weight heuristic. Listening only discriminates through B1. Thresholds are **not empirically calibrated**.
- Listening lessons; unique Mixed Test / Progress Check audio banks.
- Listening Practice above B1 (C1: “audio for this level has not been added”).
- Use of English lessons and focused Practice.
- Focused B2 Writing Practice (B2 Writing lesson exists).
- Speaking, Mock Exams / Review Tests, Grammar Shorts.
- Legacy `/learn/unit-*` + `completions` namespace kept for compatibility.
- `lib/api-client/*` and `readinessCalculator.ts` unused on purpose.
- localStorage-only; no accounts/backend.
- Content-gate warnings (construct-overlap, generic prompt) are not errors.

## Unresolved issues

None at P0/P1.

## Recommended next phase

None. Stop here unless a new phase is explicitly approved.
