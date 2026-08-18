"use client";

/**
 * app/(public)/practice/weakest-skill/page.tsx
 *
 * Real weakest-skill practice: pick a low-mastery skill, answer
 * existing curriculum questions through QuestionInput, score with
 * isAnswerCorrect, then blend mastery from actual performance.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getMyJourneySummary, type MyJourneySummary } from "@/services/myJourneyService";
import {
  completePracticeSession,
  getPracticeSession,
  isPracticeUnavailable,
  type PracticeCompletion,
  type PracticeSession,
  type PracticeUnavailable,
} from "@/services/practiceService";
import { type PlacementAnswerMap, type QuestionReviewItem } from "@/services/placementTestService";
import { QuestionInput, isQuestionAnswered } from "@/components/practice/QuestionInput";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/Badge";
import { MasteryBarList } from "@/components/ui/MasteryBar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { trackEvent } from "@/services/analyticsService";
import type { Skill } from "@/components/types";

const SKILL_LABEL: Record<Skill, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  listening: "Listening",
  reading: "Reading",
  useOfEnglish: "Use of English",
  writing: "Writing",
};

const SKILL_DESCRIPTIONS: Record<Skill, string> = {
  grammar: "Short, focused drills on the grammar points you found hardest.",
  vocabulary: "Everyday words and phrases, practiced in context.",
  listening: "Short audio clips with a focus on numbers, times, and key details.",
  reading: "Short texts with inference and detail questions.",
  useOfEnglish: "Applying grammar and vocabulary in exam-style tasks.",
  writing: "Guided practice for common sentence structures and phrases.",
};

const ALL_SKILLS = Object.keys(SKILL_LABEL) as Skill[];

type Step = "pick" | "questions" | "results";
type SkillAvailability = PracticeSession | PracticeUnavailable | undefined;

function splitPrompt(prompt: string): { passage: string | null; questionText: string } {
  const idx = prompt.indexOf("\n\n");
  if (idx === -1) return { passage: null, questionText: prompt };
  return { passage: prompt.slice(0, idx), questionText: prompt.slice(idx + 2) };
}

function SkillPracticeCard({
  skill,
  percentage,
  prepared,
  onStart,
  actionVariant = "primary",
}: {
  skill: Skill;
  percentage: number;
  prepared: SkillAvailability;
  onStart: (skill: Skill) => void;
  actionVariant?: "primary" | "secondary";
}) {
  return (
    <Card>
      <div className="mb-2">
        <SkillBadge skill={skill} />
      </div>
      <p className="text-h3 mb-2">{percentage}% mastery</p>
      <p className="text-small text-ink-soft mb-6">
        {prepared && isPracticeUnavailable(prepared) ? prepared.message : SKILL_DESCRIPTIONS[skill]}
      </p>
      {!prepared ? (
        <p className="text-small text-ink-soft">Checking available questions…</p>
      ) : isPracticeUnavailable(prepared) ? (
        <p className="text-small text-ink-soft">Practice not available yet.</p>
      ) : (
        <Button variant={actionVariant} onClick={() => onStart(skill)}>
          Start Practice
        </Button>
      )}
    </Card>
  );
}

function PracticeReviewCard({ item }: { item: QuestionReviewItem }) {
  const { passage, questionText } = splitPrompt(item.questionText);
  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${item.isCorrect ? "var(--color-pine)" : "var(--color-sage)"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-caption">Question {item.number}</span>
        <span className="text-small font-semibold" style={{ marginLeft: "auto" }}>
          {item.isCorrect ? "Correct" : "Needs Review"}
        </span>
      </div>
      {passage && <p className="text-small text-ink-soft mb-3">{passage}</p>}
      <p className="text-body mb-4">{questionText}</p>
      <div className="flex flex-col gap-1 mb-4">
        <p className="text-small">
          <span className="text-ink-soft">Your answer: </span>
          {item.userAnswerText}
        </p>
        {!item.isCorrect && (
          <p className="text-small">
            <span className="text-ink-soft">Expected answer: </span>
            {item.correctAnswerText}
          </p>
        )}
      </div>
      <p className="text-small text-ink-soft">{item.explanation}</p>
      {item.transcript && (
        <p className="text-small text-ink-soft mt-3">
          <span className="text-caption" style={{ display: "block", marginBottom: "4px" }}>
            Transcript
          </span>
          {item.transcript}
        </p>
      )}
    </div>
  );
}

export default function WeakestSkillPracticePage() {
  const [summary, setSummary] = useState<MyJourneySummary | null | undefined>(undefined);
  const [directRequest, setDirectRequest] = useState<
    { skill: Skill; level: string } | null | undefined
  >(undefined);
  const [availability, setAvailability] = useState<Partial<Record<Skill, PracticeSession | PracticeUnavailable>>>({});
  const [step, setStep] = useState<Step>("pick");
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswerMap>({});
  const [completion, setCompletion] = useState<PracticeCompletion | null>(null);
  const [masteryTracked, setMasteryTracked] = useState(false);
  const [directUnavailable, setDirectUnavailable] = useState<PracticeUnavailable | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const directRequestStartedRef = useRef(false);
  // Refs update synchronously — needed so a double-click on Finish
  // cannot call completePracticeSession twice before React re-renders.
  const finishingRef = useRef(false);
  const requestedSkill = directRequest?.skill ?? null;
  const requestedLevel = directRequest?.level ?? null;
  const hasDirectRequest = Boolean(requestedSkill && requestedLevel);

  useEffect(() => {
    getMyJourneySummary().then(setSummary);
    const params = new URLSearchParams(window.location.search);
    const skillValue = params.get("skill");
    const level = params.get("level");
    const skill = ALL_SKILLS.includes(skillValue as Skill)
      ? (skillValue as Skill)
      : null;
    setDirectRequest(skill && level ? { skill, level } : null);
  }, []);

  useEffect(() => {
    if (!requestedSkill || !requestedLevel || directRequestStartedRef.current) return;
    directRequestStartedRef.current = true;
    let cancelled = false;

    getPracticeSession(requestedSkill, requestedLevel).then((prepared) => {
      if (cancelled) return;
      if (isPracticeUnavailable(prepared)) {
        setDirectUnavailable(prepared);
        return;
      }

      finishingRef.current = false;
      startTimeRef.current = Date.now();
      setIsFinishing(false);
      setSession(prepared);
      setIndex(0);
      setAnswers({});
      setCompletion(null);
      setStep("questions");
      trackEvent("practice_started", {
        skill: requestedSkill,
        level: requestedLevel,
        questionCount: prepared.questions.length,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [requestedLevel, requestedSkill]);

  useEffect(() => {
    if (!summary) return;
    let cancelled = false;

    Promise.all(
      summary.masteryBySkill.map(async (item) => {
        const result = await getPracticeSession(item.skill, summary.currentLevelSlug);
        return [item.skill, result] as const;
      })
    ).then((entries) => {
      if (cancelled) return;
      const next: Partial<Record<Skill, PracticeSession | PracticeUnavailable>> = {};
      for (const [skill, result] of entries) next[skill] = result;
      setAvailability(next);
    });
    return () => {
      cancelled = true;
    };
  }, [summary]);

  function beginPractice(skill: Skill, prepared: PracticeSession) {
    finishingRef.current = false;
    startTimeRef.current = Date.now();
    setIsFinishing(false);
    setSession(prepared);
    setIndex(0);
    setAnswers({});
    setCompletion(null);
    setMasteryTracked(false);
    setStep("questions");
    trackEvent("practice_started", { skill, questionCount: prepared.questions.length });
  }

  function startPractice(skill: Skill) {
    const prepared = availability[skill];
    if (!prepared || isPracticeUnavailable(prepared)) return;
    beginPractice(skill, prepared);
  }

  function finishSession() {
    if (finishingRef.current || !session) return;
    finishingRef.current = true;
    setIsFinishing(true);
    const shouldTrackMastery = Boolean(summary);
    const current =
      summary?.masteryBySkill.find((item) => item.skill === session.skill)?.percentage ?? 0;
    const minutesSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    const result = completePracticeSession(
      session,
      answers,
      current,
      minutesSpent,
      shouldTrackMastery
    );
    trackEvent("practice_completed", {
      skill: session.skill,
      correctCount: result.correctCount,
      total: result.totalCount,
    });
    setMasteryTracked(shouldTrackMastery);
    setCompletion(result);
    setStep("results");
    if (shouldTrackMastery) getMyJourneySummary().then(setSummary);
  }

  function returnToPick() {
    finishingRef.current = false;
    setIsFinishing(false);
    setStep("pick");
    setSession(null);
    setCompletion(null);
    setMasteryTracked(false);
    setAnswers({});
    setIndex(0);
  }

  if (step === "questions" && session) {
    const question = session.questions[index];
    const total = session.questions.length;
    const progressPercent = Math.round((index / total) * 100);
    const hasAnswer = isQuestionAnswered(question, answers[question.id]);
    const { passage, questionText } = splitPrompt(question.prompt);

    function setAnswer(value: unknown) {
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    }

    function goNext() {
      if (index < total - 1) {
        setIndex((i) => i + 1);
      } else {
        finishSession();
      }
    }

    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-caption mb-2">Practice · {SKILL_LABEL[session.skill]}</p>
        <ProgressBar value={progressPercent} label={`Question ${index + 1} of ${total}`} />

        <div className="mt-10 mb-8">
          <div className="mb-3">
            <SkillBadge skill={question.skill} />
          </div>
          {passage && (
            <Card className="mb-6">
              <p className="text-body">{passage}</p>
            </Card>
          )}
          <p className="text-h3 mb-6">{questionText}</p>
          <QuestionInput question={question} value={answers[question.id]} onChange={setAnswer} />
        </div>

        <Button variant="primary" size="lg" disabled={!hasAnswer || isFinishing} onClick={goNext}>
          {index < total - 1 ? "Next" : "Finish"}
        </Button>
      </main>
    );
  }

  if (step === "results" && completion) {
    const needsReview = completion.review.filter((item) => !item.isCorrect);
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-caption mb-2">Practice</p>
        <h1 className="text-h1 mb-6">Practice complete.</h1>

        <Card className="mb-4">
          <div className="mb-2">
            <SkillBadge skill={completion.skill} />
          </div>
          <p className="card-eyebrow mb-1">Result</p>
          <p className="text-data" style={{ fontSize: "28px" }}>
            {completion.correctCount} / {completion.totalCount}
          </p>
        </Card>

        {masteryTracked ? (
          <Card className="mb-8">
            <p className="card-eyebrow mb-1">Mastery</p>
            <p className="text-body">
              {completion.previousMastery}% → {completion.newMastery}%
            </p>
            <p className="text-small text-ink-soft mt-2">
              Mastery moves toward this session&apos;s result — a short drill does not replace your Placement Test or Progress Check.
            </p>
          </Card>
        ) : (
          <Card className="mb-8">
            <p className="card-eyebrow mb-1">Practice result</p>
            <p className="text-small text-ink-soft">
              This session was scored, but mastery was not changed because there is no Placement baseline yet.
            </p>
          </Card>
        )}

        <p className="text-h3 mb-4">Question review</p>
        <div className="flex flex-col gap-4 mb-8">
          {completion.review.map((item) => (
            <PracticeReviewCard key={item.number} item={item} />
          ))}
        </div>

        {needsReview.length > 0 && (
          <p className="text-small text-ink-soft mb-8">
            {needsReview.length === 1
              ? "One item needs review — look at the explanation above before practising again."
              : `${needsReview.length} items need review — look at the explanations above before practising again.`}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {summary ? (
            <>
              <Button variant="primary" onClick={returnToPick}>
                Practice another skill
              </Button>
              <Link href="/my-journey">
                <Button variant="secondary">Return to My Journey</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/practice">
                <Button variant="primary">Browse more practice</Button>
              </Link>
              <Link href="/level-test">
                <Button variant="secondary">Take the Placement Test</Button>
              </Link>
            </>
          )}
        </div>
      </main>
    );
  }

  if (
    summary === undefined ||
    directRequest === undefined ||
    (summary === null && hasDirectRequest && !directUnavailable)
  ) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading practice…</p>
      </main>
    );
  }

  if (summary === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2 mb-4">
          {directUnavailable ? "Practice isn't available yet." : "Choose practice from the level browser."}
        </p>
        <p className="text-body text-ink-soft mb-8">
          {directUnavailable
            ? directUnavailable.message
            : "You can practise without a Placement result. Take the Placement Test when you want personalised recommendations and mastery tracking."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/practice">
            <Button variant="primary">Browse practice</Button>
          </Link>
          <Link href="/level-test">
            <Button variant="secondary">Take the Placement Test</Button>
          </Link>
        </div>
      </main>
    );
  }

  const weakestTwo = [...summary.masteryBySkill].sort((a, b) => a.percentage - b.percentage).slice(0, 2);
  const availabilityReady = summary.masteryBySkill.every((item) => Boolean(availability[item.skill]));
  const availableSkills = summary.masteryBySkill.filter((item) => {
    const prepared = availability[item.skill];
    return prepared && !isPracticeUnavailable(prepared);
  });

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Practice</p>
      <h1 className="text-h1 mb-3">Focused skill practice</h1>
      <p className="text-body text-ink-soft mb-8">
        Start with a recommendation or choose any real practice available at your current level.
      </p>

      <Card className="mb-8">
        <p className="card-eyebrow mb-3">Mastery by Skill</p>
        <MasteryBarList items={summary.masteryBySkill} />
      </Card>

      <p className="card-eyebrow mb-2">Recommended</p>
      <h2 className="text-h3 mb-2">Weakest skills</h2>
      <p className="text-small text-ink-soft mb-4">
        The skills that currently need the most work, based on your mastery.
      </p>

      <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {weakestTwo.map((item) => (
          <SkillPracticeCard
            key={item.skill}
            skill={item.skill}
            percentage={item.percentage}
            prepared={availability[item.skill]}
            onStart={startPractice}
            actionVariant="primary"
          />
        ))}
      </div>

      <p className="card-eyebrow mb-2">All skills</p>
      <h2 className="text-h3 mb-2">All available practice</h2>
      <p className="text-small text-ink-soft mb-4">
        Any skill with real practice content at your current level — including Listening when audio exists.
      </p>

      {!availabilityReady ? (
        <p className="text-small text-ink-soft mb-8">Checking available questions…</p>
      ) : availableSkills.length === 0 ? (
        <p className="text-small text-ink-soft mb-8">
          No practice sessions are available at this level yet.
        </p>
      ) : (
        <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {availableSkills.map((item) => (
            <SkillPracticeCard
              key={item.skill}
              skill={item.skill}
              percentage={item.percentage}
              prepared={availability[item.skill]}
              onStart={startPractice}
              actionVariant="secondary"
            />
          ))}
        </div>
      )}

      <Link href="/my-journey">
        <Button variant="tertiary">Return to My Journey</Button>
      </Link>
    </main>
  );
}
