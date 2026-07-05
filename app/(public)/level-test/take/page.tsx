"use client";

/**
 * app/(public)/level-test/take/page.tsx
 *
 * Experience Blueprint 1.1 — Placement Test in progress.
 *
 * Timed Test sprint: session (deadline + index + answers) now
 * persists via services/testTimerService.ts so a refresh resumes
 * exactly where the learner left off, with the countdown continuing
 * from real elapsed wall-clock time — not reset, not paused.
 *
 * The question-rendering engine (QuestionInput/isQuestionAnswered)
 * still lives in components/practice/QuestionInput.tsx, unchanged by
 * this sprint — reused exactly as before.
 */
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPlacementQuestions, computeResults, type PlacementAnswerMap } from "@/services/placementTestService";
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import {
  readSession,
  writeSession,
  clearSession,
  createNewSession,
  getRemainingMs,
  formatMmSs,
  type TimedTestSession,
} from "@/services/testTimerService";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { QuestionInput, isQuestionAnswered } from "@/components/practice/QuestionInput";
import { trackEvent } from "@/services/analyticsService";

const RESULTS_STORAGE_KEY = "campath_level_test_result";
const FIVE_MIN_MS = 5 * 60 * 1000;
const ONE_MIN_MS = 60 * 1000;

export default function LevelTestTakePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<PlacementQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswerMap>({});
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const announcedRef = useRef<Set<string>>(new Set());
  const sessionRef = useRef<TimedTestSession | null>(null);

  // Load questions + resume or create the timed session.
  useEffect(() => {
    getPlacementQuestions().then(setQuestions);

    let session = readSession();
    if (session) {
      const remaining = getRemainingMs(session);
      if (remaining <= 0) {
        // Time already ran out while the learner was away.
        setTimeExpired(true);
        setAnswers(session.answers);
        sessionRef.current = session;
        return;
      }
      setIndex(session.index);
      setAnswers(session.answers);
    } else {
      session = createNewSession();
      trackEvent("level_test_started");
    }
    sessionRef.current = session;
    setRemainingMs(getRemainingMs(session));
  }, []);

  // Countdown tick — recomputed from the absolute deadline every
  // second, never decremented directly (see testTimerService.ts).
  useEffect(() => {
    if (!sessionRef.current || timeExpired) return;
    const interval = setInterval(() => {
      const session = sessionRef.current!;
      const remaining = getRemainingMs(session);
      setRemainingMs(remaining);

      if (remaining <= FIVE_MIN_MS && !announcedRef.current.has("five")) {
        announcedRef.current.add("five");
        setAnnouncement("5 minutes remaining.");
      }
      if (remaining <= ONE_MIN_MS && !announcedRef.current.has("one")) {
        announcedRef.current.add("one");
        setAnnouncement("1 minute remaining.");
      }

      if (remaining <= 0) {
        clearInterval(interval);
        setAnnouncement("Time is up. Your test has been submitted.");
        setTimeExpired(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeExpired]);

  function persist(nextIndex: number, nextAnswers: PlacementAnswerMap) {
    if (!sessionRef.current) return;
    const updated: TimedTestSession = { ...sessionRef.current, index: nextIndex, answers: nextAnswers };
    sessionRef.current = updated;
    writeSession(updated);
  }

  if (!questions) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading your placement test…</p>
      </main>
    );
  }

  function finishTest(completedOnTime: boolean) {
    const result = computeResults(questions!, answers, completedOnTime);
    trackEvent("level_test_completed", { stage: result.stage, cefr: result.cefr, completedOnTime });
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(result));
    clearSession();
    router.push("/level-test/results");
  }

  if (timeExpired) {
    return (
      <main className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="text-caption mb-3">Time Expired</p>
        <h1 className="text-h1 mb-4">Your time is up.</h1>
        <p className="text-body text-ink-soft mb-10">
          Your answered questions have been saved. Unanswered questions
          are left blank.
        </p>
        <Button variant="primary" size="lg" onClick={() => finishTest(false)}>
          View Results
        </Button>
      </main>
    );
  }

  const question = questions[index];
  const total = questions.length;
  const progressPercent = Math.round((index / total) * 100);
  const hasAnswer = isQuestionAnswered(question, answers[question.id]);

  function setAnswer(value: unknown) {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    persist(index, nextAnswers);
  }

  function goNext() {
    if (index < total - 1) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      persist(nextIndex, answers);
    } else {
      finishTest(true);
    }
  }

  const warningLevel =
    remainingMs !== null && remainingMs <= ONE_MIN_MS
      ? "critical"
      : remainingMs !== null && remainingMs <= FIVE_MIN_MS
      ? "warning"
      : "normal";

  const timerColor =
    warningLevel === "critical" ? "var(--color-brick)" : warningLevel === "warning" ? "var(--color-sage)" : "var(--color-ink)";

  return (
    <main className="max-w-2xl mx-auto px-6 py-16" style={{ position: "relative" }}>
      <div aria-live="assertive" className="sr-only">{announcement}</div>

      {remainingMs !== null && (
        <div
          role="timer"
          aria-label={`${formatMmSs(remainingMs)} remaining`}
          style={{ position: "fixed", top: 88, right: 24, textAlign: "right" }}
        >
          <p className="text-data" aria-hidden="true" style={{ fontSize: "20px", color: timerColor }}>
            {formatMmSs(remainingMs)}
          </p>
          {warningLevel === "warning" && (
            <p className="text-caption normal-case" style={{ color: "var(--color-sage)" }}>
              Less than 5 minutes remaining
            </p>
          )}
          {warningLevel === "critical" && (
            <p className="text-caption normal-case" style={{ color: "var(--color-brick)" }}>
              Less than 1 minute remaining
            </p>
          )}
        </div>
      )}

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
