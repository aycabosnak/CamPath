/**
 * lib/mock-data/curriculumLessons.ts
 *
 * The Level Curriculum content model — distinct from
 * lib/mock-data/unitLessons.ts (which powers the CamPath-Stage-based
 * Study Path unit-1/2/3 pages and is NOT touched by this sprint).
 *
 * UX review follow-up: every lesson now has 3 guided questions
 * (was 1) — enough to give an honest signal of understanding without
 * turning a short lesson into a long one. All new questions reinforce
 * the SAME single objective already taught; none introduce new
 * content, per the "guided practice reinforces the objective" rule.
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
  questions: UnitQuestion[];
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
      questions: [
        {
          prompt: "Choose the correct sentence.",
          options: ["She am a teacher.", "She is a teacher.", "She are a teacher.", "She be a teacher."],
          correctAnswer: "She is a teacher.",
          reviewFeedback: "Review this concept — use 'is' with he/she/it.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct sentence.",
          options: ["We is students.", "We are students.", "We am students.", "We be students."],
          correctAnswer: "We are students.",
          reviewFeedback: "Review this concept — use 'are' with we/you/they.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct sentence.",
          options: ["I is happy.", "I are happy.", "I am happy.", "I be happy."],
          correctAnswer: "I am happy.",
          reviewFeedback: "Review this concept — use 'am' with I.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now introduce yourself and describe people using the verb 'to be'.",
    },
    {
      id: "a1-vocabulary-1",
      level: "a1-elementary",
      skill: "vocabulary",
      title: "Family & People",
      introLabel: "Useful Vocabulary",
      introList: ["mother", "father", "brother", "sister", "grandmother", "niece"],
      examples: ["This is my mother.", "I have one brother and one sister.", "She is my best friend."],
      questions: [
        {
          prompt: "Choose the correct word: 'My father's mother is my ___.'",
          options: ["grandmother", "aunt", "sister", "cousin"],
          correctAnswer: "grandmother",
          reviewFeedback: "Review this concept — your father's mother is your grandmother.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'My mother's husband is my ___.'",
          options: ["father", "uncle", "brother", "cousin"],
          correctAnswer: "father",
          reviewFeedback: "Review this concept — your mother's husband is your father.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'My brother's daughter is my ___.'",
          options: ["niece", "nephew", "cousin", "sister"],
          correctAnswer: "niece",
          reviewFeedback: "Review this concept — a brother's or sister's daughter is your niece.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now talk about your family members using simple vocabulary.",
    },
    {
      id: "a1-reading-1",
      level: "a1-elementary",
      skill: "reading",
      title: "Signs & Short Notices",
      introLabel: "Reading Text",
      passage:
        "\"CITY MUSEUM — Open Tuesday to Sunday, 9am–5pm. Closed on Mondays. Entrance: $5. Children under 12: free. No photos in the main hall.\"",
      questions: [
        {
          prompt: "According to the sign, when is the museum closed?",
          options: ["Sunday", "Monday", "Saturday", "Tuesday"],
          correctAnswer: "Monday",
          reviewFeedback: "Review this concept — the sign says 'Closed on Mondays'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "How much does an 8-year-old child pay to enter?",
          options: ["$5", "Nothing", "$12", "$2"],
          correctAnswer: "Nothing",
          reviewFeedback: "Review this concept — children under 12 enter for free.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Where can you not take photos?",
          options: ["Outside the museum", "The main hall", "The gift shop", "The entrance"],
          correctAnswer: "The main hall",
          reviewFeedback: "Review this concept — the sign says 'No photos in the main hall'.",
          successFeedback: "Well done — that's correct.",
        },
      ],
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
      questions: [
        {
          prompt: "Which is written correctly on a form?",
          options: ["name: john smith", "Name: John Smith", "NAME john SMITH", "Name; John, Smith"],
          correctAnswer: "Name: John Smith",
          reviewFeedback: "Review this concept — capitalize the label and each name.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which is the correct way to write a country name on a form?",
          options: ["turkey", "Turkey", "TURKEY.", "Turkey,"],
          correctAnswer: "Turkey",
          reviewFeedback: "Review this concept — country names start with a capital letter, with no extra punctuation.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which is the correct way to write an age on a form?",
          options: ["Age: twenty-five", "Age: 25", "Age - 25 years", "25(age)"],
          correctAnswer: "Age: 25",
          reviewFeedback: "Review this concept — forms expect a number after the label and a colon.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now fill in a simple form with your personal details correctly.",
    },
  ],

  "a2-pre-intermediate": [
    {
      id: "a2-grammar-1",
      level: "a2-pre-intermediate",
      skill: "grammar",
      title: "Past Simple",
      introLabel: "Explanation",
      introText:
        "We use the past simple to talk about finished actions and events in the past. Regular verbs add -ed (played, watched). Many common verbs are irregular (go → went, have → had, see → saw).",
      examples: [
        "I visited my grandparents last weekend.",
        "She went to the cinema yesterday.",
        "They didn't have time to finish.",
      ],
      questions: [
        {
          prompt: "Choose the correct sentence.",
          options: [
            "I visit my friend yesterday.",
            "I visited my friend yesterday.",
            "I visiting my friend yesterday.",
            "I have visit my friend yesterday.",
          ],
          correctAnswer: "I visited my friend yesterday.",
          reviewFeedback: "Review this concept — regular past simple verbs add -ed.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct past form of 'go'.",
          options: ["goed", "went", "gone", "going"],
          correctAnswer: "went",
          reviewFeedback: "Review this concept — 'go' is irregular: go → went.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct negative sentence.",
          options: [
            "She didn't went to work.",
            "She didn't go to work.",
            "She not went to work.",
            "She doesn't went to work.",
          ],
          correctAnswer: "She didn't go to work.",
          reviewFeedback: "Review this concept — after 'didn't', use the base form of the verb.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now talk about finished past events using the past simple.",
    },
    {
      id: "a2-vocabulary-1",
      level: "a2-pre-intermediate",
      skill: "vocabulary",
      title: "Daily Routines",
      introLabel: "Useful Vocabulary",
      introList: ["wake up", "get dressed", "have breakfast", "commute", "go to bed"],
      examples: [
        "I wake up at 7am every day.",
        "She commutes to work by bus.",
        "We have breakfast together before school.",
      ],
      questions: [
        {
          prompt: "Choose the correct word: 'I always ___ at 7am.'",
          options: ["wake up", "go to bed", "have lunch", "get dressed"],
          correctAnswer: "wake up",
          reviewFeedback: "Review this concept — 'wake up' describes the start of the day.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'He ___ to work by train every morning.'",
          options: ["commutes", "wakes", "dresses", "sleeps"],
          correctAnswer: "commutes",
          reviewFeedback: "Review this concept — 'commute' means to travel to work or school regularly.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'Before I leave the house, I ___.'",
          options: ["get dressed", "go to bed", "commute", "have dinner"],
          correctAnswer: "get dressed",
          reviewFeedback: "Review this concept — you get dressed before leaving the house.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now describe your daily routine using common everyday verbs.",
    },
    {
      id: "a2-reading-1",
      level: "a2-pre-intermediate",
      skill: "reading",
      title: "Short Narratives",
      introLabel: "Reading Text",
      passage:
        "Last Saturday, Maria woke up early and went for a run in the park. Afterwards, she met her friend Tom for breakfast at a small café. They talked for an hour before Maria went home to study for her exam.",
      questions: [
        {
          prompt: "What did Maria do first?",
          options: ["Studied for her exam", "Went for a run", "Met Tom", "Had breakfast"],
          correctAnswer: "Went for a run",
          reviewFeedback: "Review this concept — the text says she went for a run right after waking up.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Where did Maria and Tom meet?",
          options: ["At the park", "At Maria's house", "At a café", "At school"],
          correctAnswer: "At a café",
          reviewFeedback: "Review this concept — the text says they had breakfast at a small café.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "What did Maria do after meeting Tom?",
          options: ["Went for another run", "Went home to study", "Went to work", "Went to sleep"],
          correctAnswer: "Went home to study",
          reviewFeedback: "Review this concept — the text says she went home to study for her exam.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now understand the sequence of events in a short narrative.",
    },
    {
      id: "a2-writing-1",
      level: "a2-pre-intermediate",
      skill: "writing",
      title: "Informal Messages",
      introLabel: "Writing Focus",
      introText:
        "Informal messages to friends use casual greetings and short sentences. Start with 'Hi' or 'Hey', and end with a friendly closing like 'See you soon!'",
      examples: [
        "Hi Sarah, are you free this weekend?",
        "Hey! Thanks for the invite, see you Friday!",
        "Hope you're doing well!",
      ],
      questions: [
        {
          prompt: "Which is the best informal greeting to a friend?",
          options: ["Dear Sir,", "Hi Tom,", "To whom it may concern,", "Respected Sir,"],
          correctAnswer: "Hi Tom,",
          reviewFeedback: "Review this concept — informal messages use casual greetings like 'Hi'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which is the best informal closing?",
          options: ["Yours faithfully,", "See you soon!", "Sincerely,", "Best regards, Management"],
          correctAnswer: "See you soon!",
          reviewFeedback: "Review this concept — informal messages close casually, not formally.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which sentence fits an informal message?",
          options: [
            "I would be grateful if you could confirm your attendance.",
            "Are you coming to the party on Saturday?",
            "Please find attached the requested document.",
            "I am writing to inform you.",
          ],
          correctAnswer: "Are you coming to the party on Saturday?",
          reviewFeedback: "Review this concept — informal messages use simple, direct questions.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now write a short, informal message to a friend.",
    },
  ],
};

export function getCurriculumLessonsForLevel(levelSlug: string): CurriculumLesson[] {
  return CURRICULUM_LESSONS[levelSlug] ?? [];
}

export function getCurriculumLesson(levelSlug: string, lessonId: string): CurriculumLesson | null {
  return getCurriculumLessonsForLevel(levelSlug).find((l) => l.id === lessonId) ?? null;
}
