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

const A2_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "a2pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the correct sentence.",
    options: ["I didn't went home.", "I didn't go home.", "I not went home.", "I don't went home."],
    correct_answer: "I didn't go home.",
  },
  {
    id: "a2pc_grammar_2",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "A2",
    prompt: "They ___ (have) a great holiday last summer.",
    correct_answer: "had",
  },
  {
    id: "a2pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the correct word: 'I travel to work by ___ every day.'",
    options: ["train", "umbrella", "weather", "shop"],
    correct_answer: "train",
  },
  {
    id: "a2pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the correct word: 'It's raining, so take an ___.'",
    options: ["umbrella", "coat", "bus", "train"],
    correct_answer: "umbrella",
  },
  {
    id: "a2pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "\"Museum tickets are half price on Wednesdays.\" — When are tickets cheaper?",
    options: ["Monday", "Wednesday", "Friday", "Every day"],
    correct_answer: "Wednesday",
  },
  {
    id: "a2pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "\"Please arrive 15 minutes before your appointment.\" — How early should you arrive?",
    options: ["5 minutes", "10 minutes", "15 minutes", "30 minutes"],
    correct_answer: "15 minutes",
  },
  {
    id: "a2pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Which is an appropriate way to end a message to a friend?",
    options: ["Best regards,", "See you soon!", "Yours sincerely,", "Respectfully,"],
    correct_answer: "See you soon!",
  },
  {
    id: "a2pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Which sentence is written in an informal style?",
    options: [
      "I am writing to request information.",
      "What time works for you?",
      "Please find attached.",
      "I would appreciate your response.",
    ],
    correct_answer: "What time works for you?",
  },
];

const PROGRESS_CHECKS: Record<string, ProgressCheckContent> = {
  "a1-elementary": {
    level: "a1-elementary",
    title: "A1 Elementary — Progress Check",
    questions: A1_PROGRESS_CHECK_QUESTIONS,
  },
  "a2-pre-intermediate": {
    level: "a2-pre-intermediate",
    title: "A2 Pre-Intermediate — Progress Check",
    questions: A2_PROGRESS_CHECK_QUESTIONS,
  },
};

export function getProgressCheck(levelSlug: string): ProgressCheckContent | null {
  return PROGRESS_CHECKS[levelSlug] ?? null;
}
