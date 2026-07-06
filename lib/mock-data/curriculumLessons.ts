/**
 * lib/mock-data/curriculumLessons.ts
 *
 * The Level Curriculum content model — distinct from
 * lib/mock-data/unitLessons.ts (which powers the CamPath-Stage-based
 * Study Path unit-1/2/3 pages and is NOT touched by this sprint).
 * This file powers the new, Level-based curriculum architecture
 * (approved roadmap) under /tests/[level]/lessons/[lessonId].
 *
 * Reuses UnitQuestion's shape exactly (same question engine,
 * components/practice/QuestionInput.tsx) rather than inventing a new
 * question type — the only genuine addition is an optional `passage`
 * field for Reading lessons, which unitLessons.ts never needed.
 *
 * Scope (approved): ONE real lesson per taught skill for A1 —
 * Grammar, Vocabulary, Reading, Writing. This is the reference
 * template; A1's remaining lessons and every lesson for A2-C1 are
 * added later using this exact same shape, not a redesign.
 */
import type { UnitQuestion } from "@/lib/mock-data/unitLessons";
import type { Skill } from "@/components/types";

export interface CurriculumLesson {
  id: string;
  level: string;
  skill: Skill;
  title: string;
  introLabel: string;
  introText?: string;
  introList?: string[];
  passage?: string;
  examples?: string[];
  question: UnitQuestion;
  completionMessage: string;
}

export const CURRICULUM_LESSONS: Record<string, CurriculumLesson[]> = {
  "a1-elementary": [
    {
      id: "a1-grammar-1",
      level: "a1-elementary",
      skill: "grammar",
      title: "Verb 'to be'",
      introLabel: "Explanation",
      introText:
        "We use the verb 'to be' (am / is / are) to talk about who we are, where we are, and what things are like.",
      examples: ["I am a student.", "She is from Turkey.", "They are happy."],
      question: {
        prompt: "Choose the correct sentence.",
        options: ["She am a teacher.", "She is a teacher.", "She are a teacher.", "She be a teacher."],
        correctAnswer: "She is a teacher.",
        reviewFeedback: "Review this concept — use 'is' with he/she/it.",
        successFeedback: "Well done — that's correct.",
      },
      completionMessage: "You can now introduce yourself and describe people using the verb 'to be'.",
    },
    {
      id: "a1-vocabulary-1",
      level: "a1-elementary",
      skill: "vocabulary",
      title: "Family & People",
      introLabel: "Useful Vocabulary",
      introList: ["mother", "father", "brother", "sister", "friend"],
      examples: ["This is my mother.", "I have one brother and one sister.", "She is my best friend."],
      question: {
        prompt: "Choose the correct word: 'My father's mother is my ___.'",
        options: ["grandmother", "aunt", "sister", "cousin"],
        correctAnswer: "grandmother",
        reviewFeedback: "Review this concept — your father's mother is your grandmother, not your aunt.",
        successFeedback: "Well done — that's correct.",
      },
      completionMessage: "You can now talk about your family members using simple vocabulary.",
    },
    {
      id: "a1-reading-1",
      level: "a1-elementary",
      skill: "reading",
      title: "Signs & Short Notices",
      introLabel: "Reading Passage",
      passage: "\"CLOSED ON SUNDAYS. Open Monday to Saturday, 9am to 6pm.\"",
      question: {
        prompt: "According to the sign, can you visit on Sunday?",
        options: ["Yes", "No", "Only in the morning", "Only in the evening"],
        correctAnswer: "No",
        reviewFeedback: "Review this concept — the sign says 'Closed on Sundays'.",
        successFeedback: "Well done — that's correct.",
      },
      completionMessage: "You can now understand simple signs and notices.",
    },
    {
      id: "a1-writing-1",
      level: "a1-elementary",
      skill: "writing",
      title: "Filling in Forms",
      introLabel: "Writing Focus",
      introText:
        "Forms usually ask for your name, age, and address. Use capital letters correctly for names and countries.",
      examples: ["Name: JOHN SMITH", "Country: TURKEY", "Age: 25"],
      question: {
        prompt: "Which is written correctly on a form?",
        options: ["name: john smith", "Name: John Smith", "NAME john SMITH", "Name; John, Smith"],
        correctAnswer: "Name: John Smith",
        reviewFeedback: "Review this concept — capitalize the first letter of the label and each name.",
        successFeedback: "Well done — that's correct.",
      },
      completionMessage: "You can now fill in a simple form with your personal details correctly.",
    },
  ],
};

export function getCurriculumLessonsForLevel(levelSlug: string): CurriculumLesson[] {
  return CURRICULUM_LESSONS[levelSlug] ?? [];
}

export function getCurriculumLesson(levelSlug: string, lessonId: string): CurriculumLesson | null {
  return getCurriculumLessonsForLevel(levelSlug).find((l) => l.id === lessonId) ?? null;
}
