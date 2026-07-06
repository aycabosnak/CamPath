"use client";

/**
 * components/curriculum/CurriculumLessonView.tsx
 *
 * The Level Curriculum's lesson runner — the reference template this
 * A1 sprint exists to validate. Every future level (A2 through C1)
 * reuses this exact component; only lib/mock-data/curriculumLessons.ts
 * grows.
 *
 * Deliberately parallels app/(public)/learn/_shared/UnitLessonView.tsx
 * in structure (explanation/intro -> question -> check -> complete)
 * because that interaction pattern is already proven — but it is a
 * SEPARATE component because it writes to a separate progress
 * namespace (completeCurriculumLesson, not completeLesson) and reads
 * a different content shape (optional `passage` for Reading). Merging
 * the two would risk cross-contaminating the Study Path's completion
 * data, which the current sprint is explicitly not allowed to touch.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getLesson } from "@/services/curriculumService";
import type { CurriculumLesson } from "@/lib/mock-data/curriculumLessons";
import {
  isCurriculumLessonCompleted,
  getCurriculumLessonCompletion,
  completeCurriculumLesson,
} from "@/services/progressService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/lib/cn";
import { trackEvent } from "@/services/analyticsService";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function CurriculumLessonView({ levelSlug, lessonId }: { levelSlug: string; lessonId: string }) {
  const [lesson, setLesson] = useState<CurriculumLesson | null | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [existingRecord, setExistingRecord] = useState<ReturnType<typeof getCurriculumLessonCompletion>>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    getLesson(levelSlug, lessonId).then((data) => {
      setLesson(data);
      if (data) {
        if (isCurriculumLessonCompleted(lessonId)) {
          setExistingRecord(getCurriculumLessonCompletion(lessonId));
        } else {
          trackEvent("lesson_started", { unit: lessonId, title: data.title });
        }
      }
    });
  }, [levelSlug, lessonId]);

  if (lesson === undefined) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (lesson === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2">Lesson not found.</p>
      </main>
    );
  }

  const isCorrect = selected === lesson.question.correctAnswer;

  function handleComplete() {
    const minutesSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    const result = completeCurriculumLesson(lessonId, minutesSpent, isCorrect);
    trackEvent("lesson_completed", {
      unit: lessonId,
      title: lesson!.title,
      gotItRightFirstTry: isCorrect,
      alreadyCompleted: result.alreadyCompleted,
    });
    setExistingRecord(result.record);
    setJustCompleted(true);
  }

  const backLink = `/tests/${levelSlug}`;

  if (existingRecord) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        {justCompleted && (
          <div className="card mb-8" style={{ borderColor: "var(--color-pine)", background: "var(--color-pine-soft)" }} role="status">
            <p className="text-h3 mb-1">✓ Lesson completed successfully!</p>
          </div>
        )}
        <p className="text-caption mb-2">{lesson.title}</p>
        <h1 className="text-h1 mb-6">✓ Completed</h1>
        <Card className="mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="card-eyebrow mb-1">Completed</p>
              <p className="text-body">{formatDate(existingRecord.completedAt)}</p>
            </div>
            <div>
              <p className="card-eyebrow mb-1">Guided Question</p>
              <p className="text-body">{existingRecord.correctFirstTry ? "✅ Correct" : "🔍 Reviewed"}</p>
            </div>
          </div>
        </Card>
        <p className="text-body text-ink-soft mb-8">{lesson.completionMessage}</p>
        <Link href={backLink}>
          <Button variant="primary" size="lg">Back to Level</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">{lesson.title}</p>
      <h1 className="text-h1 mb-6">{lesson.introLabel}</h1>

      {lesson.introText && <p className="text-body text-ink-soft mb-6">{lesson.introText}</p>}
      {lesson.introList && (
        <ul className="mb-6" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {lesson.introList.map((item) => (
            <li key={item} className="text-body">{item}</li>
          ))}
        </ul>
      )}
      {lesson.passage && (
        <Card className="mb-6">
          <p className="card-eyebrow mb-2">Passage</p>
          <p className="text-body" style={{ fontStyle: "italic" }}>{lesson.passage}</p>
        </Card>
      )}
      {lesson.examples && (
        <Card className="mb-8">
          <p className="card-eyebrow mb-3">Examples</p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {lesson.examples.map((ex) => (
              <li key={ex} className="text-body">{ex}</li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-h3 mb-4">{lesson.question.prompt}</p>
      <div className="flex flex-col gap-2 mb-6" role="radiogroup" aria-label={lesson.question.prompt}>
        {lesson.question.options.map((option) => {
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
          <p className="text-body">{isCorrect ? lesson.question.successFeedback : lesson.question.reviewFeedback}</p>
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
