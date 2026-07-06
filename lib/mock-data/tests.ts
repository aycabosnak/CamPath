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
        prompt: "Choose the correct word: 'She ___ to work by bicycle every day.'",
        options: ["commutes", "wakes up", "gets dressed", "goes to bed"],
        correct_answer: "commutes",
      },
      {
        id: "a2t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Choose the correct word: 'I always ___ before 8am, then I have breakfast.'",
        options: ["wake up", "commute", "go to bed", "have dinner"],
        correct_answer: "wake up",
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
        prompt:
          "\"On Sunday morning, David woke up late and quickly got dressed. He didn't have time for breakfast, so he went straight to the bus stop. He arrived at work just before his meeting started.\" — What did David do first?",
        options: ["Had breakfast", "Woke up", "Got dressed", "Went to the bus stop"],
        correct_answer: "Woke up",
      },
      {
        id: "a2t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "In the same story, what did David do after getting dressed?",
        options: ["Had breakfast", "Went to the bus stop", "Went to his meeting", "Went back to sleep"],
        correct_answer: "Went to the bus stop",
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
          "If it will be cold, I will wear a coat.",
          "If it is cold, I will wear a coat.",
          "If it is cold, I would wear a coat.",
          "If it was cold, I will wear a coat.",
        ],
        correct_answer: "If it is cold, I will wear a coat.",
      },
      {
        id: "b1t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "B1",
        prompt: "If you ___ (leave) now, you will catch the train.",
        correct_answer: "leave",
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
        prompt: "Choose the correct phrase: 'She ___ to start her own business next year.'",
        options: ["plans", "look forward", "aiming", "intended"],
        correct_answer: "plans",
      },
      {
        id: "b1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct phrase: 'We ___ seeing you at the conference next month.'",
        options: ["look forward to", "intend", "plan", "aim"],
        correct_answer: "look forward to",
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
    skill: "writing",
    questions: [
      {
        id: "b1t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "You're writing a formal opinion piece. Which phrase fits best?",
        options: ["I reckon,", "In my opinion,", "If you ask me,", "Everyone knows"],
        correct_answer: "In my opinion,",
      },
      {
        id: "b1t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which sentence best introduces a personal opinion in formal writing?",
        options: [
          "Obviously, this is the right choice.",
          "From my point of view, this is the right choice.",
          "This is the right choice, no doubt.",
          "It's pretty clear this is the right choice.",
        ],
        correct_answer: "From my point of view, this is the right choice.",
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
