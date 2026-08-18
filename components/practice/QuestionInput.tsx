"use client";

/**
 * components/practice/QuestionInput.tsx
 *
 * Extracted from app/(public)/level-test/take/page.tsx during the
 * Tests Architecture sprint, specifically so the new /tests/[level]/
 * [testId] test-taking page and the Placement Test share one question
 * engine instead of two copies. Behavior is unchanged from the
 * original Placement Test implementation — this is a pure extraction,
 * not a rewrite.
 *
 * Works with anything shaped like PlacementQuestion (multiple_choice,
 * audio_multiple_choice, gap_fill, matching, sentence_ordering).
 * If a question has `audio_src`, the shared AudioPlayer is rendered
 * here so Practice, Placement, Mixed Tests, and Progress Checks all
 * get the same player without a second listening engine.
 */
import { useEffect } from "react";
import type {
  PlacementQuestion,
  SentenceOrderingQuestion,
} from "@/lib/mock-data/placementQuestions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Form";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { cn } from "@/components/lib/cn";

/**
 * Whether a question has enough of an answer to enable "Next"/"Check".
 * Handled per task type because "answered" means something different
 * for each: sentence ordering persists its visible initial order,
 * while matching needs every left item paired.
 */
export function isQuestionAnswered(question: PlacementQuestion, value: unknown): boolean {
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
      return (
        Array.isArray(value) &&
        value.length === question.shuffled_items.length
      );
    default:
      return false;
  }
}

export interface AudioPlayLimit {
  maxPlays: number;
  playsUsed: number;
  onPlayAttempt: () => void;
}

function SentenceOrderingInput({
  question,
  value,
  onChange,
}: {
  question: SentenceOrderingQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const order = Array.isArray(value)
    ? (value as string[])
    : question.shuffled_items;

  useEffect(() => {
    if (!Array.isArray(value)) {
      onChange([...question.shuffled_items]);
    }
  }, [onChange, question.shuffled_items, value]);

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
        <li key={item} className="card flex items-center justify-between gap-3 min-w-0">
          <span className="text-small min-w-0">{item}</span>
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

/**
 * Renders the correct input for each task type. Composes existing
 * primitives (Button, TextField) rather than introducing new visual
 * styles or tokens — no new design-system surface was added to
 * support Tests.
 */
export function QuestionInput({
  question,
  value,
  onChange,
  audioPlayLimit,
}: {
  question: PlacementQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Optional playback cap. Placement Listening sets this; Practice does not. */
  audioPlayLimit?: AudioPlayLimit;
}) {
  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
      return (
        <div>
          {question.audio_src ? (
            <div className="mb-4">
              <AudioPlayer
                key={question.id}
                src={question.audio_src}
                label="Listening clip"
                maxPlays={audioPlayLimit?.maxPlays}
                playsUsed={audioPlayLimit?.playsUsed}
                onPlayAttempt={audioPlayLimit?.onPlayAttempt}
              />
            </div>
          ) : question.task_type === "audio_multiple_choice" ? (
            <div className="card mb-4">
              <p className="text-small text-ink-soft">
                Listening question — audio playback isn&apos;t available for this item yet.
                Read the question and choose the most likely answer.
              </p>
            </div>
          ) : null}
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
                    "card text-left w-full min-w-0 cursor-pointer break-words",
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
            <div key={left} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 min-w-0">
              <span className="text-small font-semibold min-w-0 sm:w-32 sm:shrink-0">{left}</span>
              <select
                className="field w-full min-w-0"
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

    case "sentence_ordering":
      return (
        <SentenceOrderingInput
          question={question}
          value={value}
          onChange={onChange}
        />
      );

    default:
      return null;
  }
}
