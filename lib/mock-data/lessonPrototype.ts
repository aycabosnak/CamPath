/**
 * lib/mock-data/lessonPrototype.ts
 *
 * ONE lesson's worth of content, for exactly two stages, as scoped by
 * this sprint (Design Review Report: stop speculative expansion —
 * this is a testable prototype, not the full Learn module). Every
 * other stage falls back to the Communicator content so the flow
 * never breaks, with a comment marking that as a known, intentional
 * prototype shortcut.
 */
import type { StageName } from "@/components/types";

export interface LessonPrototype {
  skillLabel: string;
  title: string;
  explanation: string;
  examples: string[];
  question: {
    prompt: string;
    options: string[];
    correctAnswer: string;
    /** Shown when the selected answer is wrong — never "Wrong", per
     *  the approved Educational Confidence language rules. */
    reviewFeedback: string;
    /** Shown when the selected answer is correct. */
    successFeedback: string;
  };
  learningOutcome: string; // plain-language, shown on the completion screen
}

const FOUNDATION_LESSON: LessonPrototype = {
  skillLabel: "Grammar",
  title: "Present Simple for Daily Routines",
  explanation:
    "We use the present simple to talk about things we do regularly, like habits and daily routines. For most subjects, we use the base form of the verb. For he/she/it, we add -s.",
  examples: [
    "I wake up at 7 o'clock every day.",
    "She works in a small office near her home.",
    "They usually have lunch together on Fridays.",
  ],
  question: {
    prompt: "Choose the correct sentence.",
    options: [
      "He work every morning.",
      "He works every morning.",
      "He working every morning.",
      "He is work every morning.",
    ],
    correctAnswer: "He works every morning.",
    reviewFeedback: "Review this concept — remember the -s ending for he/she/it.",
    successFeedback: "Well done — that's correct.",
  },
  learningOutcome: "You can now describe daily routines using the present simple.",
};

const COMMUNICATOR_LESSON: LessonPrototype = {
  skillLabel: "Grammar",
  title: "First Conditional",
  explanation:
    "We use the first conditional to talk about real possibilities in the future. The structure is: If + present simple, ... will + base verb. It connects a likely condition with its probable result.",
  examples: [
    "If it rains tomorrow, we will stay at home.",
    "If she studies tonight, she will pass the exam.",
    "You'll feel better if you get some rest.",
  ],
  question: {
    prompt: "Choose the correct sentence.",
    options: [
      "If it will rain, we will stay home.",
      "If it rains, we will stay home.",
      "If it rain, we stay home.",
      "If it raining, we will stay home.",
    ],
    correctAnswer: "If it rains, we will stay home.",
    reviewFeedback: "Review this concept — the if-clause uses present simple, not 'will'.",
    successFeedback: "Well done — that's correct.",
  },
  learningOutcome: "You can now describe real future possibilities and their likely results.",
};

const LESSONS_BY_STAGE: Partial<Record<StageName, LessonPrototype>> = {
  Foundation: FOUNDATION_LESSON,
  Communicator: COMMUNICATOR_LESSON,
};

export function getLessonContentForStage(stage: StageName): LessonPrototype {
  // Prototype scope: only Foundation and Communicator have real content.
  // Every other stage intentionally falls back to Communicator so the
  // tested flow never breaks — this is a known shortcut, not a bug.
  return LESSONS_BY_STAGE[stage] ?? COMMUNICATOR_LESSON;
}
