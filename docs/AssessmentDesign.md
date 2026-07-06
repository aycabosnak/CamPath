# CamPath — Assessment Design

> Documents every assessment type that exists today, what each one is and isn't for, and the one rule that governs all of them.

---

## The Governing Rule

> **Every assessment item must trace back to an explicit lesson objective.**

This applies to Mixed Tests and Progress Checks (Placement Test is a deliberate exception — see below). It was violated once, caught during the A2 Educational Quality Audit (Vocabulary and Reading sections tested content never taught), and fixed by rewriting the offending items — not by weakening the rule. Every future level's Mixed Test and Progress Check should be checked against this rule, skill by skill, before the level is considered done.

---

## Placement Test

**Purpose:** Find a first-time learner's starting CEFR level and CamPath Stage before they've studied anything.
**Difficulty:** Spans roughly A2–B2, 12 questions, mixed task types (multiple choice, gap fill, matching, sentence ordering, one audio-placeholder item).
**Question philosophy:** Broad coverage across all six skills, not depth in any one — the goal is triage, not diagnosis.
**Assessment validity — an honest limitation:** This is a **heuristic, threshold-based scoring model** (`services/placementTestService.computeResults`), not a validated psychometric instrument. A real placement algorithm would need a much larger, calibrated item bank (see `PROJECT_STATUS.md` — this was flagged as a known gap during the Production Readiness Audit and has not been rebuilt since).
**What it measures:** A reasonable first-guess starting point.
**What it intentionally does NOT measure:** Fine-grained mastery, and it does not adapt in real time (every learner sees the same 12 questions regardless of how they're answering).

---

## Mixed Tests

**Purpose:** Rehearsal. Let a learner practice all of a level's just-taught skills together, in exam-like format, with zero permanent consequence.
**Difficulty:** Matches the level's own lessons directly — not harder, not a trick.
**Question philosophy:** Reuses the exact `PlacementQuestion` shape and the exact question-rendering engine (`QuestionInput`) as the Placement Test — no separate question schema exists.
**Assessment validity:** Must obey the Governing Rule above. Retaking is unlimited and never gates anything — a Mixed Test's completion is tracked only as a sequencing signal (so My Journey knows to recommend the Progress Check next), not as a mastery data point.
**What it measures:** Applied practice across the skills just taught.
**What it intentionally does NOT measure:** Whether the learner is "ready" to advance — that's the Progress Check's job, not this one's.

---

## Progress Checks

**Purpose:** An honest, once-per-level exit diagnostic.
**Difficulty:** Allowed to be slightly more demanding than the level's Mixed Test (e.g., A2's Progress Check reading items require a one-step causal inference the Mixed Test's items don't) — but must still obey the Governing Rule: harder framing of the same taught content, never new content.
**Question philosophy:** Same engine, same question shape as everything else. Distinct question set from the Mixed Test (not a repeat).
**Assessment validity:** This is the one assessment whose results **write back** into the learner's profile — a per-skill breakdown computed from its own questions sets `masteryOverrides` directly, and its completion fires exactly one Milestone.
**What it measures:** Real, measured skill performance at the end of a level, and whether the level is "done" in the Milestone sense.
**What it intentionally does NOT measure, and never will:** A pass/fail gate. Nothing in CamPath locks based on a Progress Check score — a low score changes nothing about what the learner can access next.

---

## Future Mock Exams

**Status: Not implemented.** Every level's Mock Exam entry renders as a "Coming Soon" placeholder card.
**Intended purpose (not yet built):** A full, timed simulation of the real Cambridge exam format for that level — the closest thing to exam day.
**Why it's deferred:** Requires real audio for Listening (see `PROJECT_STATUS.md` — Listening/Speaking are deferred as a unit) and a much larger, more exam-faithful question set than the current Mixed Tests/Progress Checks. Building it before that foundation exists would mean either a low-fidelity placeholder mislabeled as a "real exam simulation," or building the same content twice later.
