"use client";

/**
 * app/(public)/learn/_shared/UnitLessonView.tsx
 *
 * Shared view for the three static unit routes (/learn/unit-1,
 * /learn/unit-2, /learn/unit-3). Underscore-prefixed folder so
 * Next.js never treats it as a route on its own.
 *
 * Progress tracking: this is the only place lesson timing happens.
 * Start time is captured on mount; on completion, elapsed minutes and
 * whether the guided question was correct are handed to
 * services/progressService.ts, which is the single source of truth
 * for persistence, idempotency, and study-day tracking.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getUnitLesson } from "@/services/unitLessonService";
import type { UnitLessonContent } from "@/lib/mock-data/unitLessons";
import { isLessonCompleted, getLessonCompletion, completeLesson, type LessonCompletionRecord } from "@/services/progressService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/lib/cn";
import { trackEvent } from "@/services/analyticsService";

import { formatDate } from "@/lib/formatDate";

export function UnitLessonView({ unitSlug }: { unitSlug: string }) {
  const [content, setContent] = useState<UnitLessonContent | null | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [existingRecord, setExistingRecord] = useState<LessonCompletionRecord | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    getUnitLesson(unitSlug).then((data) => {
      setContent(data);
      if (data) {
        // Prevent duplicate completions: if this lesson is already
        // marked complete, show the real completed state instead of
        // letting the learner "complete" it again.
        if (isLessonCompleted(unitSlug)) {
          setExistingRecord(getLessonCompletion(unitSlug));
        } else {
          trackEvent("lesson_started", { unit: unitSlug, title: data.title });
        }
      }
    });
  }, [unitSlug]);

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
        <p className="text-h2">Unit not found.</p>
      </main>
    );
  }

  const isCorrect = selected === content.question.correctAnswer;

  function handleComplete() {
    const minutesSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    const result = completeLesson(unitSlug, minutesSpent, isCorrect);
    trackEvent("lesson_completed", {
      unit: unitSlug,
      title: content!.title,
      gotItRightFirstTry: isCorrect,
      alreadyCompleted: result.alreadyCompleted,
      minutesSpent,
    });
    setExistingRecord(result.record);
    setJustCompleted(true);
  }

  /**
   * Read-only recap of the lesson content — used both by the "just
   * completed" success state and the "already completed" return
   * visit, so a learner can refresh their memory without re-entering
   * the interactive flow (which would risk a second completion).
   */
  function LessonRecap() {
    return (
      <div className="mb-8">
        {content!.introText && <p className="text-body text-ink-soft mb-4">{content!.introText}</p>}
        {content!.introList && (
          <ul className="mb-4" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {content!.introList.map((item) => (
              <li key={item} className="text-body">{item}</li>
            ))}
          </ul>
        )}
        <Card className="mb-4">
          <p className="card-eyebrow mb-3">Examples</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {content!.examples.map((ex) => (
              <li key={ex} className="text-body">{ex}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="card-eyebrow mb-2">Guided Question</p>
          <p className="text-body mb-2">{content!.question.prompt}</p>
          <p className="text-small">
            <span className="text-ink-soft">Correct answer: </span>
            {content!.question.correctAnswer}
          </p>
        </Card>
      </div>
    );
  }

  // Already completed (this visit or an earlier one) — show real,
  // specific information instead of a generic confirmation.
  if (existingRecord) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        {justCompleted && (
          <div
            className="card mb-8"
            style={{ borderColor: "var(--color-pine)", background: "var(--color-pine-soft)" }}
            role="status"
          >
            <p className="text-h3 mb-1">✓ Lesson completed successfully!</p>
          </div>
        )}

        <p className="text-caption mb-2">{content.title}</p>
        <h1 className="text-h1 mb-6">✓ Completed</h1>

        <Card className="mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="card-eyebrow mb-1">Completed</p>
              <p className="text-body">{formatDate(existingRecord.completedAt)}</p>
            </div>
            <div>
              <p className="card-eyebrow mb-1">Guided Question</p>
              <p className="text-body">
                {existingRecord.correctFirstTry ? "✅ Correct" : "🔍 Reviewed"}
              </p>
            </div>
          </div>
        </Card>

        <p className="text-body text-ink-soft mb-6">{content.completionMessage}</p>

        <Button
          variant="tertiary"
          size="sm"
          className="mb-4 p-0"
          onClick={() => setReviewOpen((v) => !v)}
        >
          {reviewOpen ? "Hide lesson content" : "Review lesson content"}
        </Button>

        {reviewOpen && <LessonRecap />}

        <div>
          <Link href="/my-journey">
            <Button variant="primary" size="lg">Return to My Journey</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">{content.title}</p>
      <h1 className="text-h1 mb-6">{content.introLabel}</h1>

      {content.introText && <p className="text-body text-ink-soft mb-6">{content.introText}</p>}
      {content.introList && (
        <ul className="mb-6" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {content.introList.map((item) => (
            <li key={item} className="text-body">{item}</li>
          ))}
        </ul>
      )}

      <Card className="mb-8">
        <p className="card-eyebrow mb-3">Examples</p>
        <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {content.examples.map((ex) => (
            <li key={ex} className="text-body">{ex}</li>
          ))}
        </ul>
      </Card>

      <p className="text-h3 mb-4">{content.question.prompt}</p>
      <div className="flex flex-col gap-2 mb-6" role="radiogroup" aria-label={content.question.prompt}>
        {content.question.options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={checked}
              onClick={() => setSelected(option)}
              className={cn("card text-left w-full cursor-pointer", isSelected && "border-pine bg-pine-soft")}
            >
              {option}
            </button>
          );
        })}
      </div>

      {checked && (
        <Card className="mb-6">
          <p className="text-body">
            {isCorrect ? content.question.successFeedback : content.question.reviewFeedback}
          </p>
        </Card>
      )}

      {!checked ? (
        <Button variant="primary" size="lg" disabled={!selected} onClick={() => setChecked(true)}>
          Check Answer
        </Button>
      ) : (
        <Button variant="primary" size="lg" onClick={handleComplete}>
          Complete Lesson
        </Button>
      )}
    </main>
  );
}
