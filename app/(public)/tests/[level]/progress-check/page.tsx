"use client";

/**
 * app/(public)/tests/[level]/progress-check/page.tsx
 *
 * Reuses the exact same question engine and scoring logic as the
 * Placement Test and Mixed Tests (components/practice/QuestionInput,
 * placementTestService.isAnswerCorrect) — no third scoring
 * implementation was written.
 *
 * On completion, records the result via
 * progressService.recordProgressCheck(), which also fires the
 * level's Milestone in the same atomic write (see that function's
 * comments) — a Milestone only ever comes from completing a Progress
 * Check, never from a single lesson or a Mixed Test.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProgressCheck } from "@/services/curriculumService";
import { getTestLevelBySlug } from "@/constants/testLevels";
import { isAnswerCorrect, type PlacementAnswerMap } from "@/services/placementTestService";
import { recordProgressCheck, getProgressCheckRecord } from "@/services/progressService";
import type { ProgressCheckContent } from "@/lib/mock-data/progressChecks";
import type { Skill } from "@/components/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkillBadge } from "@/components/ui/Badge";
import { QuestionInput, isQuestionAnswered } from "@/components/practice/QuestionInput";
import { trackEvent } from "@/services/analyticsService";

export default function ProgressCheckPage() {
  const params = useParams<{ level: string }>();
  const [content, setContent] = useState<ProgressCheckContent | null | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswerMap>({});
  const [complete, setComplete] = useState(false);

  const meta = getTestLevelBySlug(params.level);
  const checkLabel = meta?.isBridge ? "Bridge Check" : "Progress Check";

  useEffect(() => {
    getProgressCheck(params.level).then((data) => {
      setContent(data);
      if (data) trackEvent("test_started", { level: params.level, testId: "progress-check" });
    });
  }, [params.level]);

  if (content === undefined) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (content === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2 mb-4">{checkLabel} isn't available yet.</p>
        <Link href={`/tests/${params.level}`}>
          <Button variant="primary">Back to Level</Button>
        </Link>
      </main>
    );
  }

  const total = content.questions.length;

  function finish() {
    const correctCount = content!.questions.filter((q) => isAnswerCorrect(q, answers[q.id])).length;
    const milestoneLabel = meta?.isBridge
      ? `Bridge to B2 completed`
      : `Completed ${meta?.title ?? content!.title}`;

    // Real, measured mastery per skill — grouped from this Progress
    // Check's own questions, not a heuristic. Feeds the same
    // masteryOverrides Practice Weakest Skill already writes to.
    const bySkill = new Map<Skill, { correct: number; total: number }>();
    for (const q of content!.questions) {
      const entry = bySkill.get(q.skill) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (isAnswerCorrect(q, answers[q.id])) entry.correct += 1;
      bySkill.set(q.skill, entry);
    }
    const skillBreakdown: Partial<Record<Skill, number>> = {};
    bySkill.forEach((v, skill) => {
      skillBreakdown[skill] = Math.round((v.correct / v.total) * 100);
    });

    recordProgressCheck(params.level, correctCount, total, milestoneLabel, Boolean(meta?.isBridge), skillBreakdown);
    trackEvent("test_completed", { level: params.level, testId: "progress-check", correctCount, total });
    setComplete(true);
  }

  if (complete) {
    const record = getProgressCheckRecord(params.level);
    const milestoneLabel = meta?.isBridge ? "Bridge to B2 completed" : `${meta?.title ?? content.title} completed`;
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div
          className="card mb-8"
          style={{ borderColor: "var(--color-pine)", background: "var(--color-pine-soft)" }}
          role="status"
        >
          <p className="text-h3 mb-1">✓ Milestone recorded</p>
          <p className="text-small text-ink-soft">{milestoneLabel}</p>
        </div>
        <p className="text-caption mb-2">{content.title}</p>
        <h1 className="text-h1 mb-6">{checkLabel} complete.</h1>
        <Card className="mb-6">
          <p className="card-eyebrow mb-1">Result</p>
          <p className="text-data" style={{ fontSize: "28px" }}>
            {record?.correctCount ?? 0} / {record?.totalCount ?? total}
          </p>
        </Card>
        <p className="text-small text-ink-soft mb-8">
          This is an honest checkpoint, not a pass/fail gate — nothing is locked either way.
        </p>
        <Link href={`/tests/${params.level}`}>
          <Button variant="primary" size="lg">Back to Level</Button>
        </Link>
      </main>
    );
  }

  const question = content.questions[index];
  const progressPercent = Math.round((index / total) * 100);
  const hasAnswer = isQuestionAnswered(question, answers[question.id]);

  function setAnswer(value: unknown) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      finish();
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">{content.title}</p>
      <ProgressBar value={progressPercent} label={`Question ${index + 1} of ${total}`} />

      <div className="mt-10 mb-8">
        <div className="mb-3">
          <SkillBadge skill={question.skill} />
        </div>
        <p className="text-h3 mb-6">{question.prompt}</p>
        <QuestionInput question={question} value={answers[question.id]} onChange={setAnswer} />
      </div>

      <Button variant="primary" size="lg" disabled={!hasAnswer} onClick={goNext}>
        {index < total - 1 ? "Next" : "Finish"}
      </Button>
    </main>
  );
}
