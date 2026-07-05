/**
 * lib/mock-data/unitLessons.ts
 *
 * Real, fixed content for the three unit pages linked from My
 * Journey's Study Path preview (/learn/unit-1, /learn/unit-2,
 * /learn/unit-3). Kept as static, keyed content rather than the
 * stage-lookup pattern used by lessonPrototype.ts, because these
 * three units are specific, named destinations the user explicitly
 * asked for — not a generic "whatever the learner's stage is" slot.
 */

export interface UnitQuestion {
  prompt: string;
  options: string[];
  correctAnswer: string;
  reviewFeedback: string; // shown on an incorrect choice — never "Wrong"
  successFeedback: string; // shown on the correct choice
}

export interface UnitLessonContent {
  unitSlug: "unit-1" | "unit-2" | "unit-3";
  title: string;
  introLabel: string;
  introText?: string;
  introList?: string[];
  examples: string[];
  question: UnitQuestion;
  completionMessage: string;
}

export const UNIT_LESSONS: Record<string, UnitLessonContent> = {
  "unit-1": {
    unitSlug: "unit-1",
    title: "Grammar · First Conditional",
    introLabel: "Explanation",
    introText:
      "We use the first conditional to talk about real possibilities in the future. The structure is: If + present simple, ... will + base verb.",
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
    completionMessage: "You can now describe real future possibilities and their likely results.",
  },

  "unit-2": {
    unitSlug: "unit-2",
    title: "Speaking/Writing · Giving Opinions",
    introLabel: "Useful Phrases",
    introList: [
      "In my opinion, ...",
      "I personally think that ...",
      "From my point of view, ...",
    ],
    examples: [
      "In my opinion, learning English online is very effective.",
      "I personally think that group study helps motivation.",
      "From my point of view, speaking practice is the most important skill.",
    ],
    question: {
      prompt: "Which phrase is most appropriate for giving a formal opinion?",
      options: ["I reckon...", "In my opinion...", "Dunno, maybe...", "Whatever..."],
      correctAnswer: "In my opinion...",
      reviewFeedback: "Review this concept — formal opinions use phrases like 'In my opinion', not casual ones.",
      successFeedback: "Well done — that's correct.",
    },
    completionMessage: "You can now introduce your opinions clearly in speaking or writing.",
  },

  "unit-3": {
    unitSlug: "unit-3",
    title: "Vocabulary · Future Plans",
    introLabel: "Useful Vocabulary",
    introList: ["intend to", "plan to", "be going to", "look forward to", "aim to"],
    examples: [
      "I intend to finish the course by June.",
      "She is planning to move abroad next year.",
      "We're looking forward to the summer holidays.",
    ],
    question: {
      prompt: "Choose the word that best completes the sentence: \"I ___ study medicine next year.\"",
      options: ["intend to", "intending", "intends", "intended"],
      correctAnswer: "intend to",
      reviewFeedback: "Review this concept — 'intend to' is followed by the base verb after 'I'.",
      successFeedback: "Well done — that's correct.",
    },
    completionMessage: "You can now talk about future plans and intentions using common vocabulary.",
  },
};
