/**
 * lib/mock-data/tests.ts
 *
 * MVP scope (approved): exactly ONE real, mixed test exists —
 * B1 Intermediate's "Test 1". Every other test, across every level,
 * is a "coming_soon" entry with no content. This keeps the question
 * bank small on purpose (per instructions) while still letting the
 * Tests feature demonstrate its real shape end to end.
 *
 * Questions reuse the exact PlacementQuestion shape from
 * placementQuestions.ts — no new question schema was introduced.
 * Listening is deliberately NOT a question here: per instructions, no
 * fake audio and no faked listening question — it's rendered as an
 * honest placeholder card by the test-taking page, not as content in
 * this file.
 */
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import type { Skill } from "@/components/types";

export interface TestSummary {
  id: string;
  title: string;
  status: "available" | "coming_soon";
}

export interface TestSection {
  skill: Skill;
  questions: PlacementQuestion[];
}

export interface TestContent extends TestSummary {
  sections: TestSection[];
  /** Shown as an honest placeholder section — never faked. */
  hasListeningPlaceholder: boolean;
}

const A2_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "a2t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Choose the correct sentence.",
        options: [
          "She go to school yesterday.",
          "She goes to school yesterday.",
          "She went to school yesterday.",
          "She going to school yesterday.",
        ],
        correct_answer: "She went to school yesterday.",
      },
      {
        id: "a2t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "A2",
        prompt: "Yesterday, we ___ (watch) a great film.",
        correct_answer: "watched",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "a2t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Choose the correct word: 'I need to buy some bread and milk from the ___.'",
        options: ["gym", "shop", "school", "bank"],
        correct_answer: "shop",
      },
      {
        id: "a2t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Choose the correct word: 'It's very cold today, take a ___.'",
        options: ["umbrella", "coat", "swimsuit", "sunscreen"],
        correct_answer: "coat",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "a2t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "\"Bus 42 is delayed by 20 minutes due to traffic.\" — How late is the bus?",
        options: ["10 minutes", "20 minutes", "30 minutes", "It is cancelled"],
        correct_answer: "20 minutes",
      },
      {
        id: "a2t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "\"The shop closes early on Sundays, at 3pm instead of 6pm.\" — What time does the shop close on Sunday?",
        options: ["6pm", "3pm", "9am", "It is closed"],
        correct_answer: "3pm",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "a2t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Which is the best way to start a message to a close friend?",
        options: ["Dear Sir or Madam,", "Hey!", "To whom it may concern,", "I am writing to inform you."],
        correct_answer: "Hey!",
      },
    ],
  },
];

const B1_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "b1t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct sentence.",
        options: [
          "I have seen that film yesterday.",
          "I saw that film yesterday.",
          "I have saw that film yesterday.",
          "I did seen that film yesterday.",
        ],
        correct_answer: "I saw that film yesterday.",
      },
      {
        id: "b1t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "B1",
        prompt: "If I ___ (have) more time, I would travel more.",
        correct_answer: "had",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "b1t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which word means 'very tired'?",
        options: ["exhausted", "curious", "confident", "nervous"],
        correct_answer: "exhausted",
      },
      {
        id: "b1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "She's very ___ ; she always helps her colleagues without being asked.",
        options: ["supportive", "reluctant", "ambiguous", "punctual"],
        correct_answer: "supportive",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "b1t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "\"The library will be closed for renovation from July 10th to August 1st. All borrowed books are due back by July 9th.\" — By when must books be returned?",
        options: ["July 1st", "July 9th", "July 10th", "August 1st"],
        correct_answer: "July 9th",
      },
      {
        id: "b1t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "\"Although the presentation was well-prepared, the team struggled to answer questions about the budget.\" — What is suggested about the presentation?",
        options: [
          "It was poorly prepared.",
          "It was prepared well, but had a weak point.",
          "It had no questions at all.",
          "The budget was not discussed.",
        ],
        correct_answer: "It was prepared well, but had a weak point.",
      },
    ],
  },
  {
    skill: "useOfEnglish",
    questions: [
      {
        id: "b1t1_uoe_1",
        skill: "useOfEnglish",
        task_type: "gap_fill",
        cefr_weight: "B1",
        prompt: "She's responsible ___ managing the whole team.",
        correct_answer: "for",
      },
      {
        id: "b1t1_uoe_2",
        skill: "useOfEnglish",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct word formation: 'The company values ___ in its employees.' (honest)",
        options: ["honesty", "honestly", "honest", "honester"],
        correct_answer: "honesty",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "b1t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which sentence is best for the closing line of a formal email?",
        options: ["See ya later!", "I look forward to hearing from you.", "Bye for now.", "Later!"],
        correct_answer: "I look forward to hearing from you.",
      },
      {
        id: "b1t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which linking word best completes: 'The flight was delayed; ___, we missed our connection.'",
        options: ["as a result", "for example", "in addition", "on the other hand"],
        correct_answer: "as a result",
      },
    ],
  },
];

const A1_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "a1t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Choose the correct sentence.",
        options: ["He am from Spain.", "He is from Spain.", "He are from Spain.", "He be from Spain."],
        correct_answer: "He is from Spain.",
      },
      {
        id: "a1t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "A1",
        prompt: "We ___ (live) in a small flat.",
        correct_answer: "live",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "a1t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Choose the correct word: 'I drink ___ every morning.'",
        options: ["coffee", "chair", "window", "book"],
        correct_answer: "coffee",
      },
      {
        id: "a1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Which word is a number?",
        options: ["Monday", "seven", "yellow", "table"],
        correct_answer: "seven",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "a1t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "\"Museum entrance: 5 dollars. Children under 10: free.\" — How much does a 7-year-old pay?",
        options: ["5 dollars", "Nothing", "10 dollars", "2 dollars"],
        correct_answer: "Nothing",
      },
      {
        id: "a1t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "\"Please wait here. The doctor will call your name.\" — What should you do?",
        options: ["Go home", "Wait", "Call the doctor", "Leave a message"],
        correct_answer: "Wait",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "a1t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Which is written correctly on a form?",
        options: ["name: anna lee", "Name: Anna Lee", "NAME anna LEE", "Name; Anna, Lee"],
        correct_answer: "Name: Anna Lee",
      },
    ],
  },
];

const TESTS_BY_LEVEL: Record<string, TestContent[]> = {
  "a1-elementary": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: A1_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "review-test", title: "Review Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "a2-pre-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: A2_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b1-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: B1_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b1-plus-upper-intermediate": [
    { id: "test-1", title: "Test 1", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b2-pre-advanced": [
    { id: "test-1", title: "Test 1", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "c1-advanced": [
    { id: "test-1", title: "Test 1", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "grammar-shorts": [
    { id: "shorts-1", title: "Grammar Shorts #1", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
};

export function getTestsForLevel(levelSlug: string): TestSummary[] {
  return (TESTS_BY_LEVEL[levelSlug] ?? []).map(({ id, title, status }) => ({ id, title, status }));
}

export function getTestContent(levelSlug: string, testId: string): TestContent | null {
  const tests = TESTS_BY_LEVEL[levelSlug] ?? [];
  const test = tests.find((t) => t.id === testId);
  return test && test.status === "available" ? test : null;
}
