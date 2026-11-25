/**
 * lib/mock-data/placementQuestions.ts
 *
 * Local fixture standing in for GET-based question delivery until the
 * real Level Test API (Database & API Design doc, Section 4.3/5.1)
 * exists. The real API streams one exercise at a time
 * (`first_exercise`, then `next_exercise` per answer); this mock
 * instead returns the whole set up front because there's no server
 * to drive the step-by-step exchange yet. When the backend lands,
 * only `services/placementTestService.ts` needs to change — the
 * take-test page already treats question delivery as an async call.
 *
 * `cefr_weight` is a rough difficulty tag used only by the mock
 * scoring heuristic in placementTestService.ts. The real placement
 * algorithm (adaptive, IRT-style or similar) is a backend concern and
 * is intentionally NOT modeled here.
 */
import type { Skill, CefrLevel } from "@/components/types";
import type { AudioLine } from "@/services/speechService";

export type PlacementTaskType =
  | "multiple_choice"
  | "gap_fill"
  | "matching"
  | "sentence_ordering"
  | "audio_multiple_choice";

interface BasePlacementQuestion {
  id: string;
  skill: Skill;
  task_type: PlacementTaskType;
  cefr_weight: CefrLevel;
  prompt: string;
}

export interface MultipleChoiceQuestion extends BasePlacementQuestion {
  task_type: "multiple_choice" | "audio_multiple_choice";
  options: string[];
  correct_answer: string;
  /** audio_multiple_choice only: the script spoken by the browser
   *  (services/speechService). Never shown before answering. */
  audio_script?: AudioLine[];
}

export interface GapFillQuestion extends BasePlacementQuestion {
  task_type: "gap_fill";
  correct_answer: string; // exact-match, case-insensitive, trimmed
}

export interface MatchingQuestion extends BasePlacementQuestion {
  task_type: "matching";
  left_items: string[];
  right_options: string[];
  correct_answer: Record<string, string>; // left item -> right option
}

export interface SentenceOrderingQuestion extends BasePlacementQuestion {
  task_type: "sentence_ordering";
  shuffled_items: string[];
  correct_answer: string[]; // items in correct order
}

export type PlacementQuestion =
  | MultipleChoiceQuestion
  | GapFillQuestion
  | MatchingQuestion
  | SentenceOrderingQuestion;

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // ---------------- Grammar ----------------
  {
    id: "pt_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "She ___ to the office every day.",
    options: ["walk", "walks", "walking", "is walk"],
    correct_answer: "walks",
  },
  {
    id: "pt_grammar_2",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "B2",
    prompt: "By the time we arrived, the film ___ (already / start).",
    correct_answer: "had already started",
  },

  // ---------------- Vocabulary ----------------
  {
    id: "pt_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the word closest in meaning to 'huge'.",
    options: ["tiny", "enormous", "narrow", "quiet"],
    correct_answer: "enormous",
  },
  {
    id: "pt_vocab_2",
    skill: "vocabulary",
    task_type: "matching",
    cefr_weight: "B1",
    prompt: "Match each word to its correct definition.",
    left_items: ["reluctant", "considerate", "ambiguous"],
    right_options: ["unwilling", "thoughtful of others", "unclear in meaning"],
    correct_answer: {
      reluctant: "unwilling",
      considerate: "thoughtful of others",
      ambiguous: "unclear in meaning",
    },
  },

  // ---------------- Listening ----------------
  {
    id: "pt_listening_1",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "A2",
    prompt: "Listen to the short clip. What time does the speaker say the train leaves?",
    options: ["6:15", "6:50", "7:15", "7:50"],
    correct_answer: "7:15",
    audio_script: [
      { text: "Attention, please. The next train to Oxford leaves at a quarter past seven from platform four. Please have your tickets ready." },
    ],
  },
  {
    id: "pt_listening_2",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "B1",
    prompt: "Listen to the conversation. What does the woman decide to do?",
    options: ["Cancel the trip", "Postpone the meeting", "Book an earlier flight", "Ask for a refund"],
    correct_answer: "Book an earlier flight",
    audio_script: [
      { speaker: "Woman", text: "The meeting in Berlin has been moved to Monday morning, so my Monday evening flight is too late." },
      { speaker: "Man", text: "Could you postpone the meeting? Or cancel the trip?" },
      { speaker: "Woman", text: "No, it's too important. I'll book an earlier flight, on Sunday night." },
    ],
  },

  // ---------------- Reading ----------------
  {
    id: "pt_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt:
      "\"The museum is closed on Mondays but open every other day from 9am to 5pm.\" — On which day can you NOT visit?",
    options: ["Sunday", "Monday", "Wednesday", "Friday"],
    correct_answer: "Monday",
  },
  {
    id: "pt_reading_2",
    skill: "reading",
    task_type: "sentence_ordering",
    cefr_weight: "B1",
    prompt: "Put the sentences in the correct order to form a short paragraph.",
    shuffled_items: [
      "As a result, sales increased by 20%.",
      "The company launched a new marketing campaign in March.",
      "It targeted younger customers through social media.",
    ],
    correct_answer: [
      "The company launched a new marketing campaign in March.",
      "It targeted younger customers through social media.",
      "As a result, sales increased by 20%.",
    ],
  },

  // ---------------- Use of English ----------------
  {
    id: "pt_use_of_english_1",
    skill: "useOfEnglish",
    task_type: "gap_fill",
    cefr_weight: "B1",
    prompt: "I'm really looking forward ___ seeing you next week.",
    correct_answer: "to",
  },
  {
    id: "pt_use_of_english_2",
    skill: "useOfEnglish",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Choose the correct word formation: 'The manager was impressed by her ___.' (create)",
    options: ["creation", "creativity", "creatively", "creative"],
    correct_answer: "creativity",
  },

  // ---------------- Writing ----------------
  {
    id: "pt_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Which greeting is appropriate for a formal email?",
    options: ["Hey!", "Dear Sir or Madam,", "Yo,", "Hiya,"],
    correct_answer: "Dear Sir or Madam,",
  },
  {
    id: "pt_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which sentence best links two contrasting ideas?",
    options: [
      "It was raining. I went for a walk.",
      "It was raining, so I went for a walk.",
      "Although it was raining, I went for a walk.",
      "It was raining and I went for a walk.",
    ],
    correct_answer: "Although it was raining, I went for a walk.",
  },
];
