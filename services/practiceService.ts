/**
 * services/practiceService.ts
 *
 * Focused Practice — selects a short session from a purpose-owned
 * Practice bank and scores it with the shared
 * placementTestService.isAnswerCorrect rule. Lesson guided practice,
 * Mixed Tests, Progress Checks, and Placement never feed this bank.
 *
 * Listening is a purpose-scoped bank (`getListeningItems({ purpose:
 * "practice", level })`). Mixed Tests, Progress Checks, Placement,
 * and lessons must never read this Practice bank.
 *
 * If a skill does not have enough playable questions, this service
 * returns an honest unavailable result rather than inventing items
 * or faking a mastery update.
 */
import { getListeningItems, toListeningPlacementQuestion } from "@/lib/mock-data/listeningPractice";
import { getPracticeQuestionItems } from "@/lib/mock-data/practiceQuestions";
import { getTestLevelBySlug } from "@/constants/testLevels";
import {
  isAnswerCorrect,
  type PlacementAnswerMap,
  type QuestionReviewItem,
} from "@/services/placementTestService";
import { recordPracticeSession } from "@/services/progressService";
import type { Skill } from "@/components/types";
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";

export const MIN_PRACTICE_QUESTIONS = 3;
export const MAX_PRACTICE_QUESTIONS = 5;
/** Listening bank is small on purpose — two playable clips are enough to open a session. */
const MIN_LISTENING_QUESTIONS = 2;

export interface PracticeSession {
  skill: Skill;
  questions: PlacementQuestion[];
  explanations: Record<string, string>;
}

export interface PracticeUnavailable {
  skill: Skill;
  availableCount: number;
  requiredCount: number;
  message: string;
}

export interface PracticeCompletion {
  skill: Skill;
  correctCount: number;
  totalCount: number;
  sessionPercentage: number;
  previousMastery: number;
  newMastery: number;
  review: QuestionReviewItem[];
}

function buildUnavailable(skill: Skill, availableCount: number, levelLabel?: string): PracticeUnavailable {
  const skillLabel =
    skill === "useOfEnglish" ? "Use of English" : skill.charAt(0).toUpperCase() + skill.slice(1);

  let message: string;
  if (skill === "listening" && availableCount === 0) {
    message = levelLabel
      ? `Listening practice for ${levelLabel} isn't available yet — audio for this level has not been added.`
      : "Listening practice isn't available yet — the questions are written, but the audio clips have not been added.";
  } else if (availableCount === 0) {
    message = `${skillLabel} practice isn't available yet — there aren't any practice questions for this skill.`;
  } else {
    message = `${skillLabel} practice isn't available yet — only ${availableCount} question${availableCount === 1 ? "" : "s"} exist, and a short session needs at least ${skill === "listening" ? MIN_LISTENING_QUESTIONS : MIN_PRACTICE_QUESTIONS}.`;
  }

  return {
    skill,
    availableCount,
    requiredCount: skill === "listening" ? MIN_LISTENING_QUESTIONS : MIN_PRACTICE_QUESTIONS,
    message,
  };
}

/**
 * Practice Listening only — never Mixed Test / Progress Check /
 * Placement / lesson items. Exact Tests-level match; no fallback to
 * an easier level. IDs are unique so a session cannot repeat a clip.
 */
function getListeningSession(preferredLevelSlug?: string): PracticeSession | PracticeUnavailable {
  if (!preferredLevelSlug) {
    return buildUnavailable("listening", 0);
  }

  const atLevel = getListeningItems({
    purpose: "practice",
    level: preferredLevelSlug,
    playableOnly: true,
  });

  if (atLevel.length < MIN_LISTENING_QUESTIONS) {
    const label = getTestLevelBySlug(preferredLevelSlug)?.title;
    return buildUnavailable("listening", atLevel.length, label);
  }

  const selected: typeof atLevel = [];
  const usedIds = new Set<string>();
  for (const item of atLevel) {
    if (usedIds.has(item.id)) continue;
    usedIds.add(item.id);
    selected.push(item);
    if (selected.length >= MAX_PRACTICE_QUESTIONS) break;
  }

  const explanations: Record<string, string> = {};
  for (const item of selected) {
    explanations[item.id] = item.reviewFeedback;
  }

  return {
    skill: "listening",
    questions: selected.map(toListeningPlacementQuestion),
    explanations,
  };
}

/**
 * Builds a short practice session from the exact requested level.
 * It never pads a level with lesson or assessment questions, and it
 * never silently falls back to a different CEFR level.
 */
export async function getPracticeSession(
  skill: Skill,
  preferredLevelSlug?: string
): Promise<PracticeSession | PracticeUnavailable> {
  if (skill === "listening") {
    return getListeningSession(preferredLevelSlug);
  }

  const collected = preferredLevelSlug
    ? getPracticeQuestionItems(preferredLevelSlug, skill)
    : [];

  if (collected.length < MIN_PRACTICE_QUESTIONS) {
    return buildUnavailable(
      skill,
      collected.length,
      preferredLevelSlug ? getTestLevelBySlug(preferredLevelSlug)?.title : undefined
    );
  }

  const selected = collected.slice(0, MAX_PRACTICE_QUESTIONS);
  const explanations: Record<string, string> = {};
  for (const item of selected) {
    explanations[item.question.id] = item.explanation;
  }

  return {
    skill,
    questions: selected.map((item) => item.question),
    explanations,
  };
}

export function isPracticeUnavailable(
  value: PracticeSession | PracticeUnavailable
): value is PracticeUnavailable {
  return "availableCount" in value;
}

function formatAnswer(question: PlacementQuestion, answer: unknown): string {
  if (answer === undefined || answer === null || answer === "") return "No answer given";
  if (typeof answer === "string") return answer;
  return String(answer);
}

function formatCorrectAnswer(question: PlacementQuestion): string {
  if (question.task_type === "multiple_choice" || question.task_type === "audio_multiple_choice" || question.task_type === "gap_fill") {
    return question.correct_answer;
  }
  return "";
}

export function completePracticeSession(
  session: PracticeSession,
  answers: PlacementAnswerMap,
  currentPercentage: number,
  minutesSpent: number,
  recordMastery: boolean = true
): PracticeCompletion {
  const { questions, explanations, skill } = session;
  const review: QuestionReviewItem[] = questions.map((q, i) => ({
    number: i + 1,
    skill: q.skill,
    questionText: q.prompt,
    userAnswerText: formatAnswer(q, answers[q.id]),
    correctAnswerText: formatCorrectAnswer(q),
    isCorrect: isAnswerCorrect(q, answers[q.id]),
    explanation: explanations[q.id] ?? "Review this concept — it matches a pattern taught in your lessons.",
    transcript: q.transcript,
  }));

  const correctCount = review.filter((item) => item.isCorrect).length;
  const totalCount = questions.length;
  const sessionPercentage = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;

  const newMastery = recordMastery
    ? recordPracticeSession(skill, currentPercentage, sessionPercentage, minutesSpent)
        .masteryOverrides[skill] ?? currentPercentage
    : currentPercentage;

  return {
    skill,
    correctCount,
    totalCount,
    sessionPercentage,
    previousMastery: currentPercentage,
    newMastery,
    review,
  };
}
