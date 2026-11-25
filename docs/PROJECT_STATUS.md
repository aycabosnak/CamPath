# CamPath — Project Status

> An honest snapshot of exactly where the project stands today. No marketing language.

---

## Completed Systems

- **Navigation & shell:** Navbar (Home / Placement Test / Tests / My Journey / Practice + Login), Footer (Levels — real links; Info — placeholder text; Get in Touch — placeholder text; Get Started CTAs — real links), scoped correctly to `(public)`/`(auth)` only.
- **Home page:** Hero, Why CamPath, Placement Test preview, Learning Journey (8-step vertical sequence), Browse Tests (real links), Featured Lessons (3 real lessons only), Start Your Learning Journey CTA, Cambridge Preparation, FAQ (collapsed by default).
- **Placement Test:** 12 mixed-task-type questions, 15-minute timer (persists deadline + full session across refresh), Time Expired handling, auto-submit of unanswered-as-blank questions.
- **Results page:** CEFR/Stage result, Mastery by Skill, Exam Readiness gauge, Question Review (collapsible, filterable), Recommended Study Plan, "Completed within/after time limit" status.
- **My Journey:** Unified dashboard reading both the legacy Study Path and the Level Curriculum (see ProgressSystem.md). Overall Progress, Completed Learning Items, Recommended Next Step, Mastery by Skill, Exam Readiness, Milestones, Study Path preview.
- **Tests Architecture:** /tests (7 level cards + Placement Test nudge for new visitors), /tests/[level] (Learning Path via StudyPath component), /tests/[level]/lessons/[lessonId], /tests/[level]/[testId], /tests/[level]/progress-check — all level-agnostic, scale to new levels via data only.
- **Practice Weakest Skill:** functional, heuristic-driven (see Known Limitations).
- **Design System:** full token set (color, type, spacing), component library (Button, Card family, Badge family, ProgressBar, MasteryBar, ReadinessGauge, Form fields), internal preview page.
- **Analytics:** event logging to console + localStorage (no real backend).

## Completed Curriculum

- **A1 Elementary:** 4 lessons (Grammar/Vocabulary/Reading/Writing), 1 Mixed Test, 1 Progress Check. Passed a full UX review and educational review.
- **A2 Pre-Intermediate:** Same structure. Passed a full educational quality audit, including a full assessment-alignment correction (Vocabulary/Reading sections were rewritten after failing the "traces back to a taught lesson" check).
- **B1 Intermediate:** Ported from the legacy Study Path into the Level Curriculum system, expanded to 3 questions per lesson, added a Reading lesson (didn't exist before), and had its Mixed Test rewritten section-by-section for alignment. Progress Check added.
- **B1+ Bridge to B2:** Same 4-lesson structure (Present Perfect Continuous, Environment & Technology, Reading for Inference, For-and-Against Essays), 1 Mixed Test, 1 Bridge Check. Built proactively following the passage-reuse rule from day one — audited before release, not after.
- **B2 Pre-Advanced:** Same structure — The Passive Voice, Work & Careers, Understanding the Writer's Attitude, Linking Devices (Contrast & Addition); 1 Mixed Test, 1 Progress Check. Every assessment item traced to a lesson objective; all three Reading texts (lesson cinema review, Mixed Test hotel review, Progress Check banking app) are different scenarios with different structure.
- **C1 Advanced:** Same structure — Inversion for Emphasis, Idiomatic Expressions, Following an Argument (Claim & Concession), Academic Register & Hedging; 1 Mixed Test, 1 Progress Check. Same audit as B2. Progress Check reading uses an unmarked concession ("This is undoubtedly true") — harder framing of the taught skill, not new content.

## Listening & Speaking (2026-11)

- **Engine:** `services/speechService.ts` (speech synthesis, recognition, word-match scoring), `components/audio/ListenPlayer.tsx`, `components/audio/SpeakingPractice.tsx`.
- **Content:** `lib/mock-data/audioLessons.ts` — one Listening and one Speaking lesson per level (A1–C1); 2 listening items in every Mixed Test and every Progress Check; scripts added to the Placement Test's listening items.
- **Lesson order per level:** Grammar → Vocabulary → Reading → Listening → Writing → Speaking → Mixed Test → Progress Check.

## Known Limitations

- **Placement Test is heuristic, not psychometric.** A threshold-based average, not a calibrated adaptive instrument. Flagged explicitly, not fixed.
- **No real authentication.** /login is an honest placeholder page. All learner data lives in localStorage, tied to one browser on one device.
- **No real backend.** Every service is written to be replaceable by a real API later, but none exists yet.
- **Legacy Study Path still exists, unmigrated.** 3 lessons (unit-1/2/3), tied to CamPath Stage, not the Level Curriculum. Still shown in My Journey, still functional, but not expanded and not reconciled into one system.
- **Each level has one lesson per skill** (4 lessons A1–C1). Depth per level is still thin compared with a real course; breadth now covers A1 to C1.
- **No C2 level.** A Master-stage Placement result still falls back to C1 Advanced.
- **Listening/Speaking audio is browser-generated (Web Speech API).** Voice quality varies by browser; Speaking recognition doesn't work in Firefox (self-check fallback is shown). Speaking is Listen & Repeat only — Shadow and Record steps of the original framework are not built.
- **Mock Exams are not implemented** — Coming Soon placeholders only.
- **Grammar Shorts has no content** — metadata only.
- **Search (Home/Nav/Tests expansion, Step 3) was never started.**
- **Marketing/info pages** (About, Cambridge Preparation as a standalone page, UK Language School, dedicated FAQ page, Privacy Policy, Terms) do not exist — FAQ content exists inline on Home instead, not as a separate page.

## Technical Debt

- lib/api-client/* — a full REST client layer built ahead of the not-yet-existing real backend. Currently unused. Intentional, not abandoned, but worth confirming still matches the API shape once a real backend is built.
- services/readinessCalculator.ts — unused, built ahead of Mock Exams.
- RESULTS_STORAGE_KEY duplicated (identical value) in two service files instead of one shared constant.
- Two parallel progress data namespaces (completions vs. curriculumCompletions) inside one ProgressState — resolved at the dashboard level (My Journey reads both correctly) but not at the data level (still two systems, not one).
- StudyPath's Guided/Free mode toggle (`onModeChange`) is exercised only in the internal Design System preview — no real product screen currently offers a mode switch. Documented capability, not currently used; not removed.

**Resolved during the Engineering Cleanup Sprint (2026-07):**
- ~~`/my-journey/study-path/[level]` scaffold stub~~ — deleted. Unreachable, and its purpose (a full Study Path view) is now served by `/tests/[level]`'s StudyPath rendering; unlike other scaffold pages, this wasn't a future feature, it was a superseded one.
- ~~Date formatting duplicated identically in three places~~ — extracted to `lib/formatDate.ts`.

## Deferred Features

- Real accounts / authentication
- Real backend / database
- Recorded (human) audio for Listening — optional upgrade path, see TechnicalDecisions.md
- Speaking: Shadow and Record steps (Listen & Repeat is built)
- Real Mock Exams
- Search
- Standalone marketing/info pages (About, Privacy, Terms, etc.)
- Migrating or retiring the legacy Study Path

## Current Production Readiness

**Ready for:** a demo, a design-partner pilot, or a portfolio review of the core learner journey — Home to Placement Test to Results to My Journey to any fully aligned level (A1–C1) to Milestone. This path has been reviewed for UX, accessibility basics, and educational validity, and works end to end on a single device.

**Not ready for:** paid, multi-device, multi-user production. There is no account system, no backend, and no data survives a cleared browser or a new device.

## Recommended Next Steps, in Order

1. ~~Build B2 and C1 content~~ — done (2026-11).
2. ~~Listening/Speaking resourcing decision~~ — done: Web Speech API (2026-11). Every level A1–C1 now has a Listening lesson, a Speaking lesson, listening items in its Mixed Test and Progress Check, and the Placement Test's two listening items now play real audio.
3. Curriculum breadth (A1–C1) is now in place: begin real backend/auth migration, using the service-layer boundaries already designed for exactly this swap.
