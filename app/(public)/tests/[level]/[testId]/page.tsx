"use client";

/**
 * app/(public)/tests/[level]/[testId]/page.tsx
 *
 * The actual test-taking experience. Reuses the exact same question
 * engine as the Placement Test (components/practice/QuestionInput.tsx)
 * and the same correctness rule (services/placementTestService's
 * isAnswerCorrect) — no parallel scoring logic was written.
 *
 * Listening is rendered as an honest placeholder step (no audio, no
 * fake question) if the test declares hasListeningPlaceholder — per
 * instructions, never faked.
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTest } from "@/services/testsService";
import { isAnswerCorrect, type PlacementAnswerMap } from "@/services/placementTestService";
import type { TestContent } from "@/lib/mock-data/tests";
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkillBadge } from "@/components/ui/Badge";
import { QuestionInput, isQuestionAnswered } from "@/components/practice/QuestionInput";
import { trackEvent } from "@/services/analyticsService";

type Step = "questions" | "listening" | "complete";

export default function TestTakingPage() {
  const params = useParams<{ level: string; testId: string }>();
  const router = useRouter();
  const [test, setTest] = useState<TestContent | null | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswerMap>({});
  const [step, setStep] = useState<Step>("questions");

  useEffect(() => {
    getTest(params.level, params.testId).then((data) => {
      setTest(data);
      if (data) trackEvent("test_started", { level: params.level, testId: params.testId });
    });
  }, [params.level, params.testId]);

  if (test === undefined) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (test === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2 mb-4">This test isn't available yet.</p>
        <Link href={`/tests/${params.level}`}>
          <Button variant="primary">Back to Level</Button>
        </Link>
      </main>
    );
  }

  // Flatten sections into one ordered question list, keeping each
  // question's skill for the section label shown above it.
  const flatQuestions: PlacementQuestion[] = test.sections.flatMap((s) => s.questions);
  const total = flatQuestions.length;

  function finishQuestions() {
    if (test!.hasListeningPlaceholder) {
      setStep("listening");
    } else {
      completeTest();
    }
  }

  function completeTest() {
    const correctCount = flatQuestions.filter((q) => isAnswerCorrect(q, answers[q.id])).length;
    trackEvent("test_completed", { level: params.level, testId: params.testId, correctCount, total });
    setStep("complete");
  }

  if (step === "listening") {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-caption mb-2">Listening</p>
        <Card className="mb-8">
          <p className="text-body">🎧 Audio will be added soon.</p>
        </Card>
        <Button variant="primary" size="lg" onClick={completeTest}>
          Finish Test
        </Button>
      </main>
    );
  }

  if (step === "complete") {
    const correctCount = flatQuestions.filter((q) => isAnswerCorrect(q, answers[q.id])).length;
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-caption mb-2">{test.title}</p>
        <h1 className="text-h1 mb-6">Test complete.</h1>
        <Card className="mb-8">
          <p className="card-eyebrow mb-1">Score</p>
          <p className="text-data" style={{ fontSize: "28px" }}>{correctCount} / {total}</p>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Link href={`/tests/${params.level}`}>
            <Button variant="primary" size="lg">Back to Level</Button>
          </Link>
          <Link href="/my-journey">
            <Button variant="secondary" size="lg">Return to My Journey</Button>
          </Link>
        </div>
      </main>
    );
  }

  // step === "questions"
  const question = flatQuestions[index];
  const progressPercent = Math.round((index / total) * 100);
  const hasAnswer = isQuestionAnswered(question, answers[question.id]);

  function setAnswer(value: unknown) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      finishQuestions();
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
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
