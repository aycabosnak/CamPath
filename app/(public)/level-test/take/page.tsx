"use client";

/**
 * app/(public)/level-test/take/page.tsx
 *
 * Experience Blueprint 1.1 — Placement Test in progress.
 *
 * Technical Reasoning: question delivery goes through
 * services/placementTestService.ts, never lib/mock-data directly —
 * when the real one-question-at-a-time API (Database & API Design
 * doc 5.1) exists, only the service needs to change; this page's
 * state machine (currentIndex / answers / finish) stays the same
 * shape either way.
 *
 * Answers are kept in React state only, per this step's scope
 * ("save answers in local state for now"). On finish, the computed
 * result is written to localStorage as a stand-in for a real
 * session; see the comment near `finishTest` for what replaces this
 * once a backend exists.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlacementQuestions, computeResults, type PlacementAnswerMap } from "@/services/placementTestService";
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Form";
import { cn } from "@/components/lib/cn";
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

/**
 * Whether the current question has enough of an answer to enable
 * "Next". Handled per task type because "answered" means something
 * different for each: sentence ordering always has an implicit order
 * (even if unchanged), matching needs every left item paired.
 */
function isQuestionAnswered(question: PlacementQuestion, value: unknown): boolean {
  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
      return typeof value === "string" && value.length > 0;
    case "gap_fill":
      return typeof value === "string" && value.trim().length > 0;
    case "matching": {
      const given = (value as Record<string, string>) ?? {};
      return question.left_items.every((left) => Boolean(given[left]));
    }
    case "sentence_ordering":
      return true; // an order always exists, even the unshuffled default
    default:
      return false;
  }
}

/**
 * Renders the correct input for each task type. Kept in this file
 * (not the shared component library) because it's placement-test-
 * specific business logic, not a reusable design-system primitive —
 * it composes existing primitives (Button, TextField) rather than
 * introducing new visual styles or tokens.
 */
function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: PlacementQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
      return (
        <div>
          {question.task_type === "audio_multiple_choice" && (
            <div className="card mb-4 flex items-center gap-3">
              <Button variant="secondary" size="sm" disabled aria-label="Play audio (placeholder)">
                ▶ Play
              </Button>
              <span className="text-small text-ink-soft">
                Audio placeholder — listening clips will play here.
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2" role="radiogroup" aria-label={question.prompt}>
            {question.options.map((option) => {
              const selected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(option)}
                  className={cn(
                    "card text-left w-full cursor-pointer",
                    selected && "border-pine bg-pine-soft"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "gap_fill":
      return (
        <TextField
          label="Your answer"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type the missing word(s)…"
        />
      );

    case "matching": {
      const current = (value as Record<string, string>) ?? {};
      return (
        <div className="flex flex-col gap-4">
          {question.left_items.map((left) => (
            <div key={left} className="flex items-center gap-3">
              <span className="text-small font-semibold w-32">{left}</span>
              <select
                className="field"
                value={current[left] ?? ""}
                onChange={(e) => onChange({ ...current, [left]: e.target.value })}
                aria-label={`Match for ${left}`}
              >
                <option value="" disabled>
                  Choose a match…
                </option>
                {question.right_options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      );
    }

    case "sentence_ordering": {
      const order = (value as string[] | undefined) ?? question.shuffled_items;

      function move(i: number, direction: -1 | 1) {
        const next = [...order];
        const target = i + direction;
        if (target < 0 || target >= next.length) return;
        [next[i], next[target]] = [next[target], next[i]];
        onChange(next);
      }

      return (
        <ol className="flex flex-col gap-2" aria-label="Reorder these sentences">
          {order.map((item, i) => (
            <li key={item} className="card flex items-center justify-between gap-3">
              <span className="text-small">{item}</span>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  ↑
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label="Move down"
                  disabled={i === order.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ↓
                </Button>
              </div>
            </li>
          ))}
        </ol>
      );
    }

    default:
      return null;
  }
}
