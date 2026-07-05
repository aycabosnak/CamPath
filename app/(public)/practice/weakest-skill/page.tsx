"use client";

/**
 * app/(public)/practice/weakest-skill/page.tsx
 *
 * Shows the learner's two lowest-scoring skills from their placement
 * result, side by side, each with its own "Start Practice" entry
 * point. Computed dynamically from My Journey's summary rather than
 * hardcoded to "Vocabulary and Listening" — whichever two skills are
 * actually weakest for this learner's real answers will show here.
 *
 * "Start Practice" links into the existing /practice/[skill]/[level]
 * placeholder route — building out real Practice exercises is a
 * separate, larger scope (paused per the Design Review Report), so
 * this page completes the navigation without speculatively expanding
 * the Practice module itself.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyJourneySummary, type MyJourneySummary } from "@/services/myJourneyService";
import { STAGE_NAME_TO_SLUG } from "@/constants/cefr";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/Badge";
import { MasteryBarList } from "@/components/ui/MasteryBar";

const SKILL_DESCRIPTIONS: Record<string, string> = {
  grammar: "Short, focused drills on the grammar points you found hardest.",
  vocabulary: "Everyday words and phrases, practiced in context.",
  listening: "Short audio clips with a focus on numbers, times, and key details.",
  reading: "Short texts with inference and detail questions.",
  useOfEnglish: "Applying grammar and vocabulary in exam-style tasks.",
  writing: "Guided practice for common sentence structures and phrases.",
};

export default function WeakestSkillPracticePage() {
  const [summary, setSummary] = useState<MyJourneySummary | null | undefined>(undefined);

  useEffect(() => {
    getMyJourneySummary().then(setSummary);
  }, []);

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
          <Button variant="primary">Take Placement Test</Button>
        </Link>
      </main>
    );
  }

  const stageSlug = STAGE_NAME_TO_SLUG[summary.stage];
  const weakestTwo = [...summary.masteryBySkill].sort((a, b) => a.percentage - b.percentage).slice(0, 2);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Practice</p>
      <h1 className="text-h1 mb-8">Weakest Skill Practice</h1>

      <Card className="mb-8">
        <p className="card-eyebrow mb-3">Mastery by Skill</p>
        <MasteryBarList items={summary.masteryBySkill} />
      </Card>

      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {weakestTwo.map((item) => (
          <Card key={item.skill}>
            <div className="mb-2">
              <SkillBadge skill={item.skill} />
            </div>
            <p className="text-h3 mb-2">{item.percentage}% mastery</p>
            <p className="text-small text-ink-soft mb-6">{SKILL_DESCRIPTIONS[item.skill]}</p>
            <Link href={`/practice/${item.skill}/${stageSlug}`}>
              <Button variant="primary">Start Practice</Button>
            </Link>
          </Card>
        ))}
      </div>

      <Link href="/my-journey">
        <Button variant="tertiary">Return to My Journey</Button>
      </Link>
    </main>
  );
}
