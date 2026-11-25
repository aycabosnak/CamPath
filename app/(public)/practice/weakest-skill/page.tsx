"use client";

/**
 * app/(public)/practice/weakest-skill/page.tsx
 *
 * Shows the learner's two lowest-scoring skills, computed dynamically
 * from their real placement + progress data — never hardcoded.
 *
 * "Start Practice" here simulates completing one short practice
 * session (services/progressService.recordPracticeSession) since the
 * full Practice module with real exercises is out of scope this
 * sprint (paused per the Design Review Report). This is explicitly a
 * prototype heuristic, called out in code comments, not a permanent
 * design — once real Practice exercises exist, mastery should be
 * recalculated from actual UserExerciseAttempt results instead.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyJourneySummary, type MyJourneySummary } from "@/services/myJourneyService";
import { recordPracticeSession } from "@/services/progressService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/Badge";
import { MasteryBarList } from "@/components/ui/MasteryBar";
import { trackEvent } from "@/services/analyticsService";
import type { Skill } from "@/components/types";

const SKILL_DESCRIPTIONS: Record<string, string> = {
  grammar: "Short, focused drills on the grammar points you found hardest.",
  vocabulary: "Everyday words and phrases, practiced in context.",
  listening: "Spoken clips with a focus on numbers, times, opinions, and key details.",
  reading: "Short texts with inference and detail questions.",
  useOfEnglish: "Applying grammar and vocabulary in exam-style tasks.",
  writing: "Guided practice for common sentence structures and phrases.",
  speaking: "Listen & Repeat practice with instant word-by-word feedback.",
};

export default function WeakestSkillPracticePage() {
  const [summary, setSummary] = useState<MyJourneySummary | null | undefined>(undefined);
  const [justPracticed, setJustPracticed] = useState<Skill | null>(null);

  useEffect(() => {
    getMyJourneySummary().then(setSummary);
  }, []);

  function startPractice(skill: Skill, currentPercentage: number) {
    recordPracticeSession(skill, currentPercentage);
    trackEvent("practice_started", { skill });
    setJustPracticed(skill);
    // Re-fetch so the mastery bars and weakest-skill cards reflect the
    // update instantly, without a page reload.
    getMyJourneySummary().then(setSummary);
  }

  if (summary === undefined) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (summary === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2 mb-4">No results yet.</p>
        <p className="text-body text-ink-soft mb-8">
          Take the Placement Test first so we know where to focus your practice.
        </p>
        <Link href="/level-test">
          <Button variant="primary">Start Placement Test</Button>
        </Link>
      </main>
    );
  }

  const weakestTwo = [...summary.masteryBySkill].sort((a, b) => a.percentage - b.percentage).slice(0, 2);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Practice</p>
      <h1 className="text-h1 mb-8">Weakest Skill Practice</h1>

      <Card className="mb-8">
        <p className="card-eyebrow mb-3">Mastery by Skill</p>
        <MasteryBarList items={summary.masteryBySkill} />
      </Card>

      <p className="text-small text-ink-soft mb-4">
        Starting practice logs a short session for that skill and updates your mastery right away.
      </p>

      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {weakestTwo.map((item) => (
          <Card key={item.skill}>
            <div className="mb-2">
              <SkillBadge skill={item.skill} />
            </div>
            <p className="text-h3 mb-2">{item.percentage}% mastery</p>
            <p className="text-small text-ink-soft mb-6">{SKILL_DESCRIPTIONS[item.skill]}</p>
            {justPracticed === item.skill ? (
              <p className="text-small" style={{ color: "var(--color-pine)" }}>
                ✓ Practice completed — mastery updated.
              </p>
            ) : (
              <Button variant="primary" onClick={() => startPractice(item.skill, item.percentage)}>
                Start Practice
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Link href="/my-journey">
        <Button variant="tertiary">Return to My Journey</Button>
      </Link>
    </main>
  );
}
