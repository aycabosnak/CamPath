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
    prompt: "Choose the correct word: 'After I wake up, I ___ before breakfast.'",
    options: ["get dressed", "commute", "go to bed", "have dinner"],
    correct_answer: "get dressed",
  },
  {
    id: "a2pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the correct word: 'I usually ___ at around 11pm.'",
    options: ["go to bed", "wake up", "commute", "have breakfast"],
    correct_answer: "go to bed",
  },
  {
    id: "a2pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt:
      "\"Yesterday, Elena woke up, had a quick breakfast, and got dressed for work. On her way to the office, she realised she had forgotten her keys, so she went back home. By the time she arrived at work, she was very late.\" — What did Elena do after getting dressed?",
    options: ["She had breakfast", "She left for the office", "She woke up", "She arrived at work"],
    correct_answer: "She left for the office",
  },
  {
    id: "a2pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "In the same story, why was Elena late for work?",
    options: [
      "She missed the bus",
      "She forgot her keys and went back home",
      "She had a long breakfast",
      "She got dressed slowly",
    ],
    correct_answer: "She forgot her keys and went back home",
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

const B1_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "b1pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct sentence.",
    options: [
      "If she finds a good job, she will move to the city.",
      "If she will find a good job, she will move to the city.",
      "If she found a good job, she will move to the city.",
      "If she finds a good job, she would move to the city.",
    ],
    correct_answer: "If she finds a good job, she will move to the city.",
  },
  {
    id: "b1pc_grammar_2",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "B1",
    prompt: "If they ___ (arrive) early, they will get good seats.",
    correct_answer: "arrive",
  },
  {
    id: "b1pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct phrase: 'He ___ to save enough money to travel next summer.'",
    options: ["aims", "look forward", "planning", "intended"],
    correct_answer: "aims",
  },
  {
    id: "b1pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct phrase: 'They ___ to open a new office next year.'",
    options: ["intend", "look forward to", "aiming", "intends"],
    correct_answer: "intend",
  },
  {
    id: "b1pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "\"Although the new policy was introduced to reduce costs, several departments reported that spending had actually increased in the first quarter.\" — What is suggested about the policy's effect?",
    options: [
      "It worked exactly as planned.",
      "It may have had the opposite effect to what was intended.",
      "It had no effect on spending.",
      "It was cancelled immediately.",
    ],
    correct_answer: "It may have had the opposite effect to what was intended.",
  },
  {
    id: "b1pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "\"The workshop has been rescheduled to Friday. Please note that registration closes 24 hours before the new date.\" — When does registration close?",
    options: ["Friday", "Thursday", "Saturday", "It is already closed"],
    correct_answer: "Thursday",
  },
  {
    id: "b1pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which phrase is most appropriate for opening a formal opinion piece?",
    options: ["I personally think that", "If you ask me", "Everyone agrees that", "It's obvious that"],
    correct_answer: "I personally think that",
  },
  {
    id: "b1pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which sentence keeps a consistent formal register throughout?",
    options: [
      "In my opinion, the plan needs more funding, but whatever, it's not my call.",
      "In my opinion, the plan needs more funding to succeed.",
      "I reckon the plan needs more funding, in my opinion.",
      "The plan needs more funding, if you know what I mean.",
    ],
    correct_answer: "In my opinion, the plan needs more funding to succeed.",
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
  "b1-intermediate": {
    level: "b1-intermediate",
    title: "B1 Intermediate — Progress Check",
    questions: B1_PROGRESS_CHECK_QUESTIONS,
  },
};

export function getProgressCheck(levelSlug: string): ProgressCheckContent | null {
  return PROGRESS_CHECKS[levelSlug] ?? null;
}
