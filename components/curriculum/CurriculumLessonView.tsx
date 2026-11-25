"use client";

/**
 * components/curriculum/CurriculumLessonView.tsx
 *
 * UX review follow-up:
 * - Steps through 3 guided questions per lesson (was 1), same
 *   question-by-question pattern already proven on the Placement
 *   Test and Mixed Tests — no new interaction pattern introduced.
 * - Completion screen now offers a contextual next step (next lesson,
 *   or the Mixed Test if this was the last lesson) instead of a
 *   generic "Back to Level", via services/curriculumService's
 *   getNextStepAfterLesson.
 *
 * Still a separate component from app/(public)/learn/_shared/
 * UnitLessonView.tsx — different progress namespace, different
 * content shape (optional `passage`, multi-question).
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getLesson, getNextStepAfterLesson, type NextStep } from "@/services/curriculumService";
import type { CurriculumLesson } from "@/lib/mock-data/curriculumLessons";
import {
  isCurriculumLessonCompleted,
  getCurriculumLessonCompletion,
  completeCurriculumLesson,
} from "@/services/progressService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/components/lib/cn";
import { trackEvent } from "@/services/analyticsService";

import { formatDate } from "@/lib/formatDate";
import { ListenPlayer } from "@/components/audio/ListenPlayer";
import { SpeakingPractice } from "@/components/audio/SpeakingPractice";

export function CurriculumLessonView({ levelSlug, lessonId }: { levelSlug: string; lessonId: string }) {
  const [lesson, setLesson] = useState<CurriculumLesson | null | undefined>(undefined);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);
  const [existingRecord, setExistingRecord] = useState<ReturnType<typeof getCurriculumLessonCompletion>>(null);
  const [nextStep, setNextStep] = useState<NextStep | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
    getLesson(levelSlug, lessonId).then((data) => {
      setLesson(data);
      if (data) {
        if (isCurriculumLessonCompleted(lessonId)) {
          setExistingRecord(getCurriculumLessonCompletion(lessonId));
          getNextStepAfterLesson(levelSlug, lessonId).then(setNextStep);
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

  const totalQuestions = lesson.questions.length;
  const question = lesson.questions[qIndex];
  const isCorrect = question ? selected === question.correctAnswer : false;

  function checkAnswer() {
    if (!isCorrect) setAllCorrect(false);
    setChecked(true);
  }

  async function handleComplete(allCorrectOverride?: boolean) {
    const finalAllCorrect = allCorrectOverride ?? allCorrect;
    const minutesSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    const result = completeCurriculumLesson(lessonId, minutesSpent, finalAllCorrect);
    trackEvent("lesson_completed", {
      unit: lessonId,
      title: lesson!.title,
      allCorrect: finalAllCorrect,
      alreadyCompleted: result.alreadyCompleted,
    });
    setExistingRecord(result.record);
    setNextStep(await getNextStepAfterLesson(levelSlug, lessonId));
    setJustCompleted(true);
  }

  function goNextQuestion() {
    if (qIndex < totalQuestions - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      handleComplete();
    }
  }

  // --- Completed (this visit or a return visit) ---
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
        <p className="text-caption mb-2">{lesson.title}</p>
        <h1 className="text-h1 mb-6">✓ Completed</h1>
        <Card className="mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="card-eyebrow mb-1">Completed</p>
              <p className="text-body">{formatDate(existingRecord.completedAt)}</p>
            </div>
            <div>
              <p className="card-eyebrow mb-1">{lesson.speakingPrompts ? "Speaking Practice" : "Guided Practice"}</p>
              <p className="text-body">
                {lesson.speakingPrompts
                  ? existingRecord.correctFirstTry
                    ? "✅ Clear on first try"
                    : "🎙️ Practised"
                  : existingRecord.correctFirstTry
                    ? "✅ All correct"
                    : "🔍 Reviewed"}
              </p>
            </div>
          </div>
        </Card>
        <p className="text-body text-ink-soft mb-8">{lesson.completionMessage}</p>
        {nextStep && (
          <Link href={nextStep.href}>
            <Button variant="primary" size="lg">{nextStep.label}</Button>
          </Link>
        )}
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
      {lesson.audioScript && (
        // Transcript unlocks once the current answer is checked — before
        // that it would turn the listening task into a reading task.
        <ListenPlayer lines={lesson.audioScript} allowTranscript={checked} label="Listening Clip" />
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

      {lesson.speakingPrompts ? (
        <SpeakingPractice prompts={lesson.speakingPrompts} onComplete={(allGood) => handleComplete(allGood)} />
      ) : (
        <>
      <ProgressBar
        value={Math.round((qIndex / totalQuestions) * 100)}
        label={`Guided Practice — Question ${qIndex + 1} of ${totalQuestions}`}
      />

      <div className="mt-6 mb-6">
        <p className="text-h3 mb-4">{question.prompt}</p>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label={question.prompt}>
          {question.options.map((option) => {
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
      </div>

      {checked && (
        <Card className="mb-6">
          <p className="text-body">{isCorrect ? question.successFeedback : question.reviewFeedback}</p>
        </Card>
      )}

      {!checked ? (
        <Button variant="primary" size="lg" disabled={!selected} onClick={checkAnswer}>
          Check Answer
        </Button>
      ) : (
        <Button variant="primary" size="lg" onClick={() => goNextQuestion()}>
          {qIndex < totalQuestions - 1 ? "Next Question" : "Complete Lesson"}
        </Button>
      )}
        </>
      )}
    </main>
  );
}
