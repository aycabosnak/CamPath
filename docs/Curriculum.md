# CamPath — Curriculum

> Documents the curriculum as implemented today, not the full aspirational roadmap (see `PROJECT_STATUS.md` for what's planned vs. built).

---

## 1. CEFR Levels — Current State

| Level | Slug | Status |
|---|---|---|
| A1 Elementary | `a1-elementary` | **Complete reference template** — 4 lessons, 1 Mixed Test, 1 Progress Check, educationally audited |
| A2 Pre-Intermediate | `a2-pre-intermediate` | **Complete** — same structure as A1, educationally audited and aligned |
| B1 Intermediate | `b1-intermediate` | Partial — 3 legacy Study Path lessons + 1 Mixed Test exist, but predate the Level Curriculum system and have not been through the alignment audit |
| B1+ (Bridge) | `b1-plus-upper-intermediate` | Metadata only — labeled as a Bridge (not a formal level) in `constants/testLevels.ts`, no lessons yet |
| B2 Pre-Advanced | `b2-pre-advanced` | Metadata + Coming Soon placeholders only |
| C1 Advanced | `c1-advanced` | Metadata + Coming Soon placeholders only |
| Grammar Shorts | `grammar-shorts` | Metadata only, no content — see Section 4 for what this is *for* |

---

## 2. Learning Philosophy

Content is built one **complete level** at a time, not one skill at a time across all levels — A1 was finished end-to-end (lessons → test → progress check → milestone) before A2 began, specifically so structural problems (see the A1 UX review and the A2 educational alignment audit) get caught and fixed once, in the template, rather than once per level.

Every lesson has exactly one explicit learning objective, stated in its `completionMessage` in plain, practical language ("You can now..."), not grammar terminology — matching the approved Learning Outcomes principle from the original curriculum architecture.

---

## 3. Lesson Flow — and Why This Order

```
Lesson (Grammar → Vocabulary → Reading → Writing)
   ↓
Guided Practice (3+ questions, inside each lesson)
   ↓
Mixed Test (rehearsal, all taught skills together)
   ↓
Progress Check (honest exit diagnostic)
   ↓
Milestone (recorded once, permanently)
```

- **Lesson before practice:** a learner needs an explanation before being asked to apply a rule — practicing an unexplained rule is testing, not teaching.
- **Guided Practice before Mixed Test:** each lesson's own 3-question practice confirms the single objective was understood *before* it's mixed with three other skills at once — isolating a problem to one lesson is cheaper for the learner than discovering it inside a multi-skill test.
- **Mixed Test before Progress Check:** the Mixed Test is deliberately low-stakes rehearsal (retakeable, no milestone) so the *first* time a learner sees all four skills combined isn't also the moment that determines whether they get a Milestone.
- **Progress Check before Milestone:** the Milestone is the one moment in the product that represents "this level is genuinely done" — it has to come after a real, deliberate assessment, not after a retakeable rehearsal.

---

## 4. Grammar Shorts vs. Practice Weakest Skill

Both exist to answer "what should I practice right now," but from opposite directions:

| | Grammar Shorts | Practice Weakest Skill |
|---|---|---|
| Who decides the topic | The learner (they already know what they want to revisit) | The system (based on measured mastery data) |
| Entry point | "I know exactly what I want" | "I don't know what to work on" |
| Status today | Metadata only, no content yet | Implemented — reads `masteryBySkill`, offers the two lowest |

These were deliberately **not** merged into one "Quick Practice" concept — doing so would collapse a content-driven lookup tool and a data-driven recommendation tool into one feature that does neither job as clearly.

---

## 5. Why Progress Check Exists

A Progress Check is the only assessment in the system that:
1. Is **singular** per level (not retakeable in the way a Mixed Test is — though nothing technically blocks retaking it, see `AssessmentDesign.md`)
2. **Writes to Mastery by Skill directly** (via `progressService.recordProgressCheck`'s `skillBreakdown` parameter) — a real, deliberate measurement, not a heuristic bump
3. **Fires exactly one Milestone**, idempotently, the first time it's completed

It exists specifically so "have I actually finished this level" has one honest, factual answer — never a pass/fail gate (nothing in CamPath locks based on a score), just a real signal.

---

## 6. Why Mixed Test Exists

A Mixed Test exists to let a learner **rehearse** all four just-taught skills together, in exam-like format, with no permanent consequence — it's retakeable, never gates anything, and (as of the architecture unification) its completion is tracked only as a sequencing signal (`progressService.testAttempts`, keyed by `levelSlug:testId`) so My Journey knows to recommend the Progress Check next — not as a "mastery" data point.

---

## 7. How Educational Alignment Is Maintained

The rule, enforced during the A2 alignment audit and intended to apply to every future level:

> **Every assessment item (Mixed Test and Progress Check) must be answerable by a learner who has mastered only the lessons in that level — no external vocabulary, no untaught reading sub-skill, no unfamiliar task type.**

This is checked by explicitly tracing each assessment question back to the specific lesson objective it exercises, skill by skill, before a level is considered finished. A2's Mixed Test and Progress Check both initially failed this check for Vocabulary and Reading (testing Shopping/Weather vocabulary and notice-scanning reading, neither of which was taught) and were rewritten to test only Daily Routines vocabulary and narrative-sequence reading — the two things the actual A2 lessons teach.
