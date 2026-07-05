"use client";

/**
 * app/(public)/learn/_shared/UnitLessonView.tsx
 *
 * Shared view for the three static unit routes (/learn/unit-1,
 * /learn/unit-2, /learn/unit-3). Kept in an underscore-prefixed
 * folder so Next.js never treats it as a route — only the three
 * thin page.tsx files that import it are real routes. This avoids
 * tripling ~120 lines of near-identical page code.
 *
 * Note on routing: these live as STATIC segments (unit-1/unit-2/
 * unit-3) alongside the existing dynamic /learn/[skill] route.
 * Next.js allows a static segment and a dynamic sibling at the same
 * level (it only forbids two DIFFERENTLY-named dynamic segments at
 * the same level) — so this does not conflict with the scaffold's
 * existing [skill] route.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUnitLesson } from "@/services/unitLessonService";
import type { UnitLessonContent } from "@/lib/mock-data/unitLessons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/lib/cn";
import { trackEvent } from "@/services/analyticsService";

export function UnitLessonView({ unitSlug }: { unitSlug: string }) {
  const router = useRouter();
  const [content, setContent] = useState<UnitLessonContent | null | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getUnitLesson(unitSlug).then((data) => {
      setContent(data);
      if (data) trackEvent("lesson_started", { unit: unitSlug, title: data.title });
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

  function completeLesson() {
    trackEvent("lesson_completed", { unit: unitSlug, title: content!.title, gotItRightFirstTry: isCorrect });
    router.push("/my-journey");
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
        <Button variant="primary" size="lg" onClick={completeLesson}>
          Complete Lesson
        </Button>
      )}
    </main>
  );
}
