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
 * `cefr_weight` is a rough content-difficulty tag. The current mock
 * scorer does not weight items by this field: all 12 items contribute
 * equally. A calibrated adaptive or IRT-style model remains a future
 * backend concern and is intentionally NOT modeled here.
 */
import type { Skill, CefrLevel } from "@/components/types";
import { getPlacementListeningQuestions } from "@/lib/mock-data/listeningPractice";

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
  /** Public path to a playable clip. Absent = this item is not audio-backed yet. */
  audio_src?: string;
  /** Shown after the attempt in question review — not during answering. */
  transcript?: string;
}

export interface MultipleChoiceQuestion extends BasePlacementQuestion {
  task_type: "multiple_choice" | "audio_multiple_choice";
  options: string[];
  correct_answer: string;
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
    cefr_weight: "A1",
    prompt:
      "Daniel has the same job every week. Which sentence describes his regular situation?",
    options: [
      "Daniel works in a hospital.",
      "Daniel is working in a hospital right now.",
      "Daniel worked in a hospital until last year.",
      "Daniel will work in a hospital next year.",
    ],
    correct_answer: "Daniel works in a hospital.",
  },
  {
    id: "pt_grammar_2",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "B2",
    prompt:
      "Complete with exactly three words, using the words in brackets: If the warning ___ (not / arrive) in time, the team would have continued.",
    correct_answer: "had not arrived",
  },

  // ---------------- Vocabulary ----------------
  {
    id: "pt_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt:
      "Maya left her dictionary at home, so she asked whether she could ___ mine until tomorrow.",
    options: ["borrow", "lend", "owe", "hire"],
    correct_answer: "borrow",
  },
  {
    id: "pt_vocab_2",
    skill: "vocabulary",
    task_type: "matching",
    cefr_weight: "B2",
    prompt: "Match each word to its correct definition.",
    left_items: ["tentative", "compelling", "redundant"],
    right_options: [
      "not certain or final",
      "strongly convincing",
      "unnecessary because it adds nothing",
    ],
    correct_answer: {
      tentative: "not certain or final",
      compelling: "strongly convincing",
      redundant: "unnecessary because it adds nothing",
    },
  },

  // ---------------- Listening ----------------
  // Unique Placement clips (purpose: "placement"). Never reuse the
  // Practice bank. Playable when listeningPractice marks audioReady.
  ...getPlacementListeningQuestions(),

  // ---------------- Reading ----------------
  {
    id: "pt_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt:
      "\"Community centre notice: The main hall is closed on Tuesday morning for repairs. Classes before 1pm will take place in Room 4. The café and reception remain open as usual.\" — A learner has a class at 11am on Tuesday. Where should they go?",
    options: ["The main hall", "Room 4", "The café", "Reception"],
    correct_answer: "Room 4",
  },
  {
    id: "pt_reading_2",
    skill: "reading",
    task_type: "sentence_ordering",
    cefr_weight: "C1",
    prompt:
      "Put the sentences in the most coherent order to form a short paragraph.",
    shuffled_items: [
      "Only after bus services were expanded did car use begin to fall.",
      "These results suggest that the charge worked best as part of a wider package.",
      "At first, the council expected the charge to reduce traffic immediately.",
      "Early data, however, showed little change in weekday journeys.",
    ],
    correct_answer: [
      "At first, the council expected the charge to reduce traffic immediately.",
      "Early data, however, showed little change in weekday journeys.",
      "Only after bus services were expanded did car use begin to fall.",
      "These results suggest that the charge worked best as part of a wider package.",
    ],
  },

  // ---------------- Use of English ----------------
  {
    id: "pt_use_of_english_1",
    skill: "useOfEnglish",
    task_type: "gap_fill",
    cefr_weight: "B1",
    prompt:
      "Complete with exactly one word: The new safety rules come ___ effect on 1 September.",
    correct_answer: "into",
  },
  {
    id: "pt_use_of_english_2",
    skill: "useOfEnglish",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt:
      "Choose the correct word form: 'Researchers questioned the ___ of the conclusion because the sample was very small.' (valid)",
    options: ["validity", "validation", "valid", "validly"],
    correct_answer: "validity",
  },

  // ---------------- Writing ----------------
  {
    id: "pt_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt:
      "You are writing to a colleague you do not know well. Which request is clear and appropriately polite?",
    options: [
      "Send me the meeting notes by Friday.",
      "Could you please send me the meeting notes by Friday?",
      "Hey, notes. Friday.",
      "I demand that you send the notes.",
    ],
    correct_answer: "Could you please send me the meeting notes by Friday?",
  },
  {
    id: "pt_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt:
      "The evidence comes from one small survey. Which sentence gives the most appropriately cautious conclusion for a formal report?",
    options: [
      "The results prove that remote work always increases productivity.",
      "The results suggest that remote work may improve productivity in some contexts.",
      "No one can deny that remote work is more productive.",
      "Remote work definitely improves productivity for every employee.",
    ],
    correct_answer:
      "The results suggest that remote work may improve productivity in some contexts.",
  },
];
