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

const B1PLUS_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "b1pluspc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct sentence.",
    options: [
      "They have been travelling since three months.",
      "They have been travelling for three months.",
      "They have travelling been for three months.",
      "They has been travelling for three months.",
    ],
    correct_answer: "They have been travelling for three months.",
  },
  {
    id: "b1pluspc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct question.",
    options: [
      "How long has she been studying medicine?",
      "How long she has been studying medicine?",
      "How long has she being studying medicine?",
      "How long have she been studying medicine?",
    ],
    correct_answer: "How long has she been studying medicine?",
  },
  {
    id: "b1pluspc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct word: 'The factory was fined for causing serious ___ to the river.'",
    options: ["pollution", "recycling", "upgrade", "device"],
    correct_answer: "pollution",
  },
  {
    id: "b1pluspc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct word: 'Smartphones are just one example of a modern ___.'",
    options: ["device", "pollution", "renewable", "recycling"],
    correct_answer: "device",
  },
  {
    id: "b1pluspc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "\"Some universities now allow students to take exams online from home. Supporters highlight the flexibility and reduced stress, while critics raise concerns about how fairly the process can be monitored.\" — What do supporters of online exams highlight?",
    options: ["Increased costs", "Flexibility and reduced stress", "Stricter monitoring", "Longer exam times"],
    correct_answer: "Flexibility and reduced stress",
  },
  {
    id: "b1pluspc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "In the same text, what concern do critics raise?",
    options: [
      "Exams are too easy",
      "How fairly the process can be monitored",
      "Students prefer paper exams",
      "Universities lose money",
    ],
    correct_answer: "How fairly the process can be monitored",
  },
  {
    id: "b1pluspc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which phrase introduces a contrasting viewpoint?",
    options: ["On the other hand,", "Firstly,", "For example,", "Similarly,"],
    correct_answer: "On the other hand,",
  },
  {
    id: "b1pluspc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which sentence is a suitable essay conclusion?",
    options: [
      "Overall, I believe the drawbacks are outweighed by the benefits.",
      "On the one hand, this matters.",
      "For example, this happens often.",
      "On the other hand, people disagree.",
    ],
    correct_answer: "Overall, I believe the drawbacks are outweighed by the benefits.",
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
  "b1-plus-upper-intermediate": {
    level: "b1-plus-upper-intermediate",
    title: "Bridge to B2 — Bridge Check",
    questions: B1PLUS_PROGRESS_CHECK_QUESTIONS,
  },
};

export function getProgressCheck(levelSlug: string): ProgressCheckContent | null {
  return PROGRESS_CHECKS[levelSlug] ?? null;
}
