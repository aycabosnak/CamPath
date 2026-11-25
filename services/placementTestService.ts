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

export interface QuestionReviewItem {
  number: number;
  skill: Skill;
  questionText: string;
  userAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface StudyPlanGroup {
  skill: Skill;
  recommendations: string[];
}

export interface PlacementResult {
  stage: StageName;
  cefr: CefrLevel;
  skill_breakdown: Record<Skill, number>;
  readiness: { status: ReadinessStatus; examLabel: string } | null;
  recommended_unit_label: string;
  questionReview: QuestionReviewItem[];
  correctCount: number;
  totalCount: number;
  accuracyPercentage: number;
  studyPlan: StudyPlanGroup[];
  /** True if submitted via the normal Finish button before time ran
   *  out; false if submitted from the Time Expired screen. Set by
   *  the caller (the take page knows the timer state; this service
   *  doesn't) — see computeResults' completedOnTime parameter. */
  completedOnTime: boolean;
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

/**
 * Exported so any feature scoring a PlacementQuestion-shaped answer
 * (Tests Architecture's test-taking page, in addition to this file's
 * own computeResults) shares one correctness rule instead of two.
 */
export function isAnswerCorrect(question: PlacementQuestion, answer: unknown): boolean {
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
 * Tailored, per-question explanations for the mock question bank.
 * Written by hand rather than generated generically per skill,
 * because a specific, accurate explanation ("why THIS rule applies
 * to THIS sentence") teaches more than a generic skill-level blurb
 * ever could — this matches the Learning Blueprint's "Common Learner
 * Mistakes" philosophy of being concrete, not abstract.
 */
const QUESTION_EXPLANATIONS: Record<string, string> = {
  pt_grammar_1: "Use -s with he/she/it in the present simple: 'walks', not 'walk'.",
  pt_grammar_2:
    "The past perfect (had + past participle) describes an action completed before another past action — the film had already started before they arrived.",
  pt_vocab_1: "'Enormous' means extremely large — the closest match to 'huge'.",
  pt_vocab_2:
    "reluctant = unwilling · considerate = thoughtful of others · ambiguous = unclear in meaning.",
  pt_listening_1: "The speaker says the train leaves at 7:15, not 6:15 or 7:50.",
  pt_listening_2:
    "In the conversation, the woman decides to book an earlier flight rather than cancelling or postponing.",
  pt_reading_1: "The text states the museum is closed on Mondays, so that's the day you can't visit.",
  pt_reading_2:
    "The cause (the campaign launch and its tactic) has to come before the effect (the sales increase) — campaign → tactic → outcome.",
  pt_use_of_english_1: "'Look forward to' is a fixed pattern followed by 'to' + noun/gerund.",
  pt_use_of_english_2:
    "The noun form describing a quality is 'creativity' — the adjective/adverb forms don't fit after 'her'.",
  pt_writing_1: "Formal emails use conventional greetings like 'Dear Sir or Madam', not casual ones.",
  pt_writing_2:
    "'Although' introduces a contrast between two clauses within a single sentence — exactly what's needed here.",
};

/** Static suggestion bank — MVP heuristic, not a real curriculum
 *  engine. Once Learning Blueprints exist (Learn Module Phase 2),
 *  this should be replaced by real blueprint-linked recommendations. */
const STUDY_SUGGESTIONS: Record<Skill, string[]> = {
  grammar: ["Review Present Perfect and Past Simple contrasts", "Practice the First and Second Conditional forms"],
  vocabulary: ["Expand everyday vocabulary through short reading texts", "Practice synonyms for common adjectives"],
  listening: ["Practice numbers, times, and dates in listening clips", "Listen to short announcements and conversations daily"],
  reading: ["Practice skimming for the main idea before answering questions", "Work on ordering sentences to see how ideas connect"],
  useOfEnglish: ["Review common prepositional phrases (look forward to, depend on)", "Practice turning verbs into nouns and adjectives"],
  writing: ["Practice formal vs informal greetings and closings", "Practice linking contrasting ideas with although, but, however"],
  speaking: ["Do a Listen & Repeat speaking lesson at your level", "Read short texts aloud and record yourself"],
};

const STUDY_PLAN_THRESHOLD = 70; // below this, a skill gets a recommendation group

function formatAnswer(question: PlacementQuestion, answer: unknown): string {
  if (answer === undefined || answer === null || answer === "") return "No answer given";
  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
    case "gap_fill":
      return String(answer);
    case "matching": {
      const given = answer as Record<string, string>;
      return question.left_items.map((left) => `${left} → ${given[left] ?? "—"}`).join(", ");
    }
    case "sentence_ordering":
      return Array.isArray(answer) ? answer.join(" → ") : String(answer);
    default:
      return String(answer);
  }
}

function formatCorrectAnswer(question: PlacementQuestion): string {
  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
    case "gap_fill":
      return question.correct_answer;
    case "matching":
      return question.left_items.map((left) => `${left} → ${question.correct_answer[left]}`).join(", ");
    case "sentence_ordering":
      return question.correct_answer.join(" → ");
    default:
      return "";
  }
}

function buildQuestionReview(
  questions: PlacementQuestion[],
  answers: PlacementAnswerMap
): QuestionReviewItem[] {
  return questions.map((q, i) => ({
    number: i + 1,
    skill: q.skill,
    questionText: q.prompt,
    userAnswerText: formatAnswer(q, answers[q.id]),
    correctAnswerText: formatCorrectAnswer(q),
    isCorrect: isAnswerCorrect(q, answers[q.id]),
    explanation: QUESTION_EXPLANATIONS[q.id] ?? "This tests a key pattern for this skill at this level.",
  }));
}

function buildStudyPlan(skill_breakdown: Record<Skill, number>): StudyPlanGroup[] {
  const skills: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];
  return skills
    .filter((skill) => skill_breakdown[skill] < STUDY_PLAN_THRESHOLD)
    .map((skill) => ({ skill, recommendations: STUDY_SUGGESTIONS[skill] }));
}

/**
 * Mock scoring heuristic ONLY. The real placement algorithm (likely
 * adaptive — see IA Blueprint Layer 2, Progression Engine) will run
 * server-side and replace this function entirely; this exists so the
 * UI has real numbers to render while that's being built.
 */
export function computeResults(
  questions: PlacementQuestion[],
  answers: PlacementAnswerMap,
  completedOnTime: boolean = true
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

  // "Exam Readiness if relevant" — only shown once a learner is
  // at least Explorer/A2, since below that there's no meaningful
  // nearby Cambridge exam to be "ready" for yet.
  const readiness =
    cefrIndex >= 1
      ? {
          status: deriveReadinessStatus(overallScore),
          examLabel: nearestExamLabel(cefr),
        }
      : null;

  const questionReview = buildQuestionReview(questions, answers);
  const correctCount = questionReview.filter((q) => q.isCorrect).length;
  const totalCount = questionReview.length;

  return {
    stage,
    cefr,
    skill_breakdown,
    readiness,
    recommended_unit_label: `${STAGE_LABELS[stageSlug(stage)]} · Unit 1`,
    questionReview,
    correctCount,
    totalCount,
    accuracyPercentage: totalCount ? Math.round((correctCount / totalCount) * 100) : 0,
    studyPlan: buildStudyPlan(skill_breakdown),
    completedOnTime,
  };
}

/**
 * Shared threshold logic for turning a 0-100 average score into a
 * ReadinessStatus. Extracted so any service that recomputes readiness
 * from a mastery average (this file, and myJourneyService after a
 * practice session changes mastery) uses the exact same thresholds —
 * duplicating this logic in two places would let them silently drift.
 */
export function deriveReadinessStatus(overallScore: number): ReadinessStatus {
  if (overallScore >= 70) return "ready";
  if (overallScore >= 45) return "approaching";
  return "notReady";
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
