"use client";

/**
 * app/(public)/level-test/take/page.tsx
 *
 * Experience Blueprint 1.1 — Placement Test in progress.
 *
 * The question-rendering engine (QuestionInput/isQuestionAnswered) now
 * lives in components/practice/QuestionInput.tsx, shared with the new
 * /tests/[level]/[testId] flow — this file's own behavior is
 * unchanged, only the import source moved (Tests Architecture sprint).
 *
 * Technical Reasoning: question delivery goes through
 * services/placementTestService.ts, never lib/mock-data directly —
 * when the real one-question-at-a-time API (Database & API Design
 * doc 5.1) exists, only the service needs to change; this page's
 * state machine (currentIndex / answers / finish) stays the same
 * shape either way.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlacementQuestions, computeResults, type PlacementAnswerMap } from "@/services/placementTestService";
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { QuestionInput, isQuestionAnswered } from "@/components/practice/QuestionInput";
import { trackEvent } from "@/services/analyticsService";

const RESULTS_STORAGE_KEY = "campath_level_test_result";

export default function LevelTestTakePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<PlacementQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswerMap>({});

  useEffect(() => {
    getPlacementQuestions().then(setQuestions);
    trackEvent("level_test_started");
  }, []);

  if (!questions) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading your placement test…</p>
      </main>
    );
  }

  const question = questions[index];
  const total = questions.length;
  const progressPercent = Math.round((index / total) * 100);
  const hasAnswer = isQuestionAnswered(question, answers[question.id]);

  function setAnswer(value: unknown) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      finishTest();
    }
  }

  function finishTest() {
    const result = computeResults(questions!, answers);
    trackEvent("level_test_completed", { stage: result.stage, cefr: result.cefr });
    // Stand-in for a real backend session: the future LevelTestSession
    // (Database & API Design doc) will hold this server-side, keyed by
    // session_id/guest_token, and /level-test/results will fetch it via
    // GET /api/level-test/:sessionId/results instead of reading
    // localStorage. Swapping this out later does not change the
    // results page's rendering logic — only where the data comes from.
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(result));
    router.push("/level-test/results");
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <ProgressBar value={progressPercent} label={`Question ${index + 1} of ${total}`} />

      <div className="mt-10 mb-8">
        <p className="text-h3 mb-6">{question.prompt}</p>
        <QuestionInput
          question={question}
          value={answers[question.id]}
          onChange={setAnswer}
        />
      </div>

      <Button variant="primary" size="lg" disabled={!hasAnswer} onClick={goNext}>
        {index < total - 1 ? "Next" : "Finish"}
      </Button>
    </main>
  );
}
