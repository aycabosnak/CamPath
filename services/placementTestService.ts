/**
 * services/placementTestService.ts
 *
 * Everything the /level-test pages need, behind an async interface
 * that already matches the shape the real API will eventually have
 * (Database & API Design doc, Section 5.1). Pages never import
 * lib/mock-data directly — they go through this file, so swapping
 * to lib/api-client/levelTest.ts later is a one-file change.
 *
 * Manifesto Check: `computeResults` never produces a "score" in the
 * sense of points — it produces a CEFR stage and a per-skill mastery
 * percentage, the same shape MasteryBarList and StageBadge already
 * expect elsewhere in the app.
 */
import { PLACEMENT_QUESTIONS, type PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import { STAGE_TO_CEFR, STAGE_LABELS } from "@/constants/cefr";
import type { Skill, CefrLevel, StageName, ReadinessStatus } from "@/components/types";

export async function getPlacementQuestions(): Promise<PlacementQuestion[]> {
  // `await` on a synchronous value is deliberate — keeps the call
  // site identical to a real `fetch`-backed version later.
  return PLACEMENT_QUESTIONS;
}

export type PlacementAnswerMap = Record<string, unknown>;

export interface PlacementResult {
  stage: StageName;
  cefr: CefrLevel;
  skill_breakdown: Record<Skill, number>;
  readiness: { status: ReadinessStatus; examLabel: string } | null;
  recommended_unit_label: string;
}

const CEFR_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const STAGE_BY_CEFR: Record<CefrLevel, StageName> = {
  A1: "Foundation",
  A2: "Explorer",
  B1: "Communicator",
  B2: "Independent",
  C1: "Advanced",
  C2: "Master",
};

function isAnswerCorrect(question: PlacementQuestion, answer: unknown): boolean {
  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
      return answer === question.correct_answer;
    case "gap_fill":
      return (
        typeof answer === "string" &&
        answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()
      );
    case "matching": {
      if (!answer || typeof answer !== "object") return false;
      const given = answer as Record<string, string>;
      return Object.entries(question.correct_answer).every(([left, right]) => given[left] === right);
    }
    case "sentence_ordering": {
      if (!Array.isArray(answer)) return false;
      return (
        answer.length === question.correct_answer.length &&
        answer.every((item, i) => item === question.correct_answer[i])
      );
    }
    default:
      return false;
  }
}

/**
 * Mock scoring heuristic ONLY. The real placement algorithm (likely
 * adaptive — see IA Blueprint Layer 2, Progression Engine) will run
 * server-side and replace this function entirely; this exists so the
 * UI has real numbers to render while that's being built.
 */
export function computeResults(
  questions: PlacementQuestion[],
  answers: PlacementAnswerMap
): PlacementResult {
  const skills: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];

  const skill_breakdown = {} as Record<Skill, number>;
  for (const skill of skills) {
    const skillQuestions = questions.filter((q) => q.skill === skill);
    const correctCount = skillQuestions.filter((q) => isAnswerCorrect(q, answers[q.id])).length;
    skill_breakdown[skill] = skillQuestions.length
      ? Math.round((correctCount / skillQuestions.length) * 100)
      : 0;
  }

  const overallScore =
    skills.reduce((sum, s) => sum + skill_breakdown[s], 0) / skills.length;

  // Simple threshold mapping — placeholder for a real adaptive result.
  let cefrIndex = 0;
  if (overallScore >= 85) cefrIndex = 5;
  else if (overallScore >= 70) cefrIndex = 4;
  else if (overallScore >= 55) cefrIndex = 3;
  else if (overallScore >= 40) cefrIndex = 2;
  else if (overallScore >= 20) cefrIndex = 1;
  const cefr = CEFR_ORDER[cefrIndex];
  const stage = STAGE_BY_CEFR[cefr];

  // "Cambridge Readiness if relevant" — only shown once a learner is
  // at least Explorer/A2, since below that there's no meaningful
  // nearby Cambridge exam to be "ready" for yet.
  const readiness =
    cefrIndex >= 1
      ? {
          status: (overallScore >= 70 ? "ready" : overallScore >= 45 ? "approaching" : "notReady") as ReadinessStatus,
          examLabel: nearestExamLabel(cefr),
        }
      : null;

  return {
    stage,
    cefr,
    skill_breakdown,
    readiness,
    recommended_unit_label: `${STAGE_LABELS[stageSlug(stage)]} · Unit 1`,
  };
}

function nearestExamLabel(cefr: CefrLevel): string {
  const map: Record<CefrLevel, string> = {
    A1: "A2 Key",
    A2: "A2 Key",
    B1: "B1 Preliminary",
    B2: "B2 First",
    C1: "C1 Advanced",
    C2: "C2 Proficiency",
  };
  return map[cefr];
}

function stageSlug(stage: StageName): keyof typeof STAGE_TO_CEFR {
  return stage.toLowerCase() as keyof typeof STAGE_TO_CEFR;
}
