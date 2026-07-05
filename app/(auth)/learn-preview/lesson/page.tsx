"use client";

/**
 * app/(auth)/learn-preview/lesson/page.tsx
 *
 * The one lesson prototype for this sprint: Explanation -> Guided
 * Question -> Completion. This is a simplified version of the
 * "Rule-Based Lesson" template from the Phase 3 UX Blueprint — full
 * Guided/Independent Practice staging is out of scope this sprint.
 *
 * Language rule: the wrong-answer path never says "Wrong" or
 * "Incorrect" — it says "Review this concept" and explains why,
 * per the approved Educational Confidence principle.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLearnPreviewUnit, type LearnPreviewUnit } from "@/services/learnPreviewService";
import { STAGE_NAME_TO_SLUG } from "@/constants/cefr";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/lib/cn";
import { trackEvent } from "@/services/analyticsService";

type Step = "explanation" | "question" | "complete";

export default function LessonPrototypePage() {
  const router = useRouter();
  const [unit, setUnit] = useState<LearnPreviewUnit | null>(null);
  const [step, setStep] = useState<Step>("explanation");
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getLearnPreviewUnit().then((data) => {
      setUnit(data);
      trackEvent("lesson_started", { stage: data.stage, lesson: data.lesson.title });
    });
  }, []);

  if (!unit) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  const { lesson, stage } = unit;
  const stageSlug = STAGE_NAME_TO_SLUG[stage];
  const isCorrect = selected === lesson.question.correctAnswer;

  function goToQuestion() {
    setStep("question");
  }

  function checkAnswer() {
    setChecked(true);
  }

  function completeLesson() {
    trackEvent("lesson_completed", { stage, lesson: lesson.title, gotItRightFirstTry: isCorrect });
    setStep("complete");
  }

  function practiceNow() {
    trackEvent("practice_started", { stage, skill: lesson.skillLabel.toLowerCase() });
    router.push(`/practice/${lesson.skillLabel.toLowerCase()}/${stageSlug}`);
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {step === "explanation" && (
        <>
          <p className="text-caption mb-2">{lesson.skillLabel}</p>
          <h1 className="text-h1 mb-6">{lesson.title}</h1>
          <p className="text-body text-ink-soft mb-6">{lesson.explanation}</p>
          <Card className="mb-8">
            <p className="card-eyebrow mb-3">Examples</p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {lesson.examples.map((ex) => (
                <li key={ex} className="text-body">{ex}</li>
              ))}
            </ul>
          </Card>
          <Button variant="primary" size="lg" onClick={goToQuestion}>
            Try a Question
          </Button>
        </>
      )}

      {step === "question" && (
        <>
          <p className="text-caption mb-2">{lesson.skillLabel} · Guided Question</p>
          <p className="text-h3 mb-6">{lesson.question.prompt}</p>

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
                  className={cn(
                    "card text-left w-full cursor-pointer",
                    isSelected && "border-pine bg-pine-soft"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {checked && (
            <Card className="mb-6">
              <p className="text-body">
                {isCorrect ? lesson.question.successFeedback : lesson.question.reviewFeedback}
              </p>
            </Card>
          )}

          {!checked ? (
            <Button variant="primary" size="lg" disabled={!selected} onClick={checkAnswer}>
              Check Answer
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={completeLesson}>
              Continue
            </Button>
          )}
        </>
      )}

      {step === "complete" && (
        <>
          <p className="text-caption mb-2">Lesson Complete</p>
          <h1 className="text-h1 mb-6">{lesson.learningOutcome}</h1>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={practiceNow}>
              Practice This Now
            </Button>
            <Link href="/my-journey">
              <Button variant="secondary" size="lg">
                Return to My Journey
              </Button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
