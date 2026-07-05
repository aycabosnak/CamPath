"use client";

/**
 * app/(public)/learn/_shared/UnitLessonView.tsx
 *
 * Shared view for the three static unit routes (/learn/unit-1,
 * /learn/unit-2, /learn/unit-3). Underscore-prefixed folder so
 * Next.js never treats it as a route on its own.
 *
 * Progress tracking: this is the only place lesson timing happens.
 * Start time is captured on mount; on completion, elapsed minutes are
 * handed to services/progressService.ts, which is the single source
 * of truth for persistence, idempotency, and study-day tracking —
 * this component does not touch localStorage directly.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getUnitLesson } from "@/services/unitLessonService";
import type { UnitLessonContent } from "@/lib/mock-data/unitLessons";
import { isLessonCompleted, completeLesson } from "@/services/progressService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/lib/cn";
import { trackEvent } from "@/services/analyticsService";

export function UnitLessonView({ unitSlug }: { unitSlug: string }) {
  const [content, setContent] = useState<UnitLessonContent | null | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    getUnitLesson(unitSlug).then((data) => {
      setContent(data);
      if (data) {
        // Prevent duplicate completions: if this lesson is already
        // marked complete, skip straight to the completed view rather
        // than letting the learner "complete" it again and double
        // count study time.
        if (isLessonCompleted(unitSlug)) {
          setAlreadyDone(true);
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
    const result = completeLesson(unitSlug, minutesSpent);
    trackEvent("lesson_completed", {
      unit: unitSlug,
      title: content!.title,
      gotItRightFirstTry: isCorrect,
      alreadyCompleted: result.alreadyCompleted,
      minutesSpent,
    });
    setJustCompleted(true);
  }

  // Already completed on an earlier visit — show a calm confirmation,
  // not the interactive question again (that would risk re-completing
  // and double-counting study time).
  if (alreadyDone && !justCompleted) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-caption mb-2">{content.title}</p>
        <h1 className="text-h1 mb-4">✓ Already completed</h1>
        <p className="text-body text-ink-soft mb-8">{content.completionMessage}</p>
        <Link href="/my-journey">
          <Button variant="primary" size="lg">Return to My Journey</Button>
        </Link>
      </main>
    );
  }

  // Success state — shown in place, no navigation until the learner
  // chooses to move on. No confetti, no sound, just a clear, calm
  // confirmation (Manifesto Check: Educational Confidence, not
  // celebration-for-its-own-sake).
  if (justCompleted) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div
          className="card mb-8"
          style={{ borderColor: "var(--color-pine)", background: "var(--color-pine-soft)" }}
          role="status"
        >
          <p className="text-h3 mb-1">✓ Lesson completed successfully!</p>
          <p className="text-small text-ink-soft">{content.completionMessage}</p>
        </div>
        <Link href="/my-journey">
          <Button variant="primary" size="lg">Return to My Journey</Button>
        </Link>
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
