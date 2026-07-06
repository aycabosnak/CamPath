/**
 * lib/mock-data/progressChecks.ts
 *
 * The "Progress Check" concept (approved rename from "Level Check") —
 * an honest, non-blocking exit diagnostic per level, distinct from
 * Mixed Tests (rehearsal, retakeable) and from Mock Exams (full,
 * timed simulation, still Coming Soon everywhere).
 *
 * Reuses the exact PlacementQuestion shape and scoring logic
 * (services/placementTestService.isAnswerCorrect) — no new question
 * schema, no new scoring function.
 */
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";

export interface ProgressCheckContent {
  level: string;
  title: string;
  questions: PlacementQuestion[];
}

const A1_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "a1pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the correct sentence.",
    options: ["I is a doctor.", "I am a doctor.", "I are a doctor.", "I be a doctor."],
    correct_answer: "I am a doctor.",
  },
  {
    id: "a1pc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the correct sentence.",
    options: ["They is happy.", "They am happy.", "They are happy.", "They be happy."],
    correct_answer: "They are happy.",
  },
  {
    id: "a1pc_grammar_3",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "A1",
    prompt: "She ___ (walk) to school every day.",
    correct_answer: "walks",
  },
  {
    id: "a1pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the correct word: 'My sister's son is my ___.'",
    options: ["nephew", "cousin", "uncle", "brother"],
    correct_answer: "nephew",
  },
  {
    id: "a1pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Which word means a place where you buy food?",
    options: ["library", "supermarket", "hospital", "airport"],
    correct_answer: "supermarket",
  },
  {
    id: "a1pc_vocab_3",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the odd one out.",
    options: ["apple", "banana", "carrot", "orange"],
    correct_answer: "carrot",
  },
  {
    id: "a1pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "\"Please switch off your phone during the film.\" — What should you do?",
    options: ["Turn your phone off", "Turn your phone on", "Call someone", "Take a photo"],
    correct_answer: "Turn your phone off",
  },
  {
    id: "a1pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "\"Bus 12 leaves every 15 minutes from Gate 3.\" — Where does Bus 12 leave from?",
    options: ["Gate 3", "Gate 12", "Gate 15", "Gate 1"],
    correct_answer: "Gate 3",
  },
];

const PROGRESS_CHECKS: Record<string, ProgressCheckContent> = {
  "a1-elementary": {
    level: "a1-elementary",
    title: "A1 Elementary — Progress Check",
    questions: A1_PROGRESS_CHECK_QUESTIONS,
  },
};

export function getProgressCheck(levelSlug: string): ProgressCheckContent | null {
  return PROGRESS_CHECKS[levelSlug] ?? null;
}
