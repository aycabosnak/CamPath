/**
 * lib/mock-data/listeningPractice.ts
 *
 * Listening content registry. Every item has exactly one `purpose`
 * and must not be reused across assessment types.
 *
 * Current real audio:
 * - Practice: 9 clips (3×A1, 3×A2, 3×B1)
 * - Placement: 2 unique clips (pt_listening_1/2) — never reused
 * mixed_test, progress_check, and lesson banks remain empty.
 *
 * Selection is always explicit:
 *   getListeningItems({ purpose: "practice", level: "a2-pre-intermediate" })
 */
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import type { CefrLevel } from "@/components/types";

export type ListeningPurpose =
  | "practice"
  | "mixed_test"
  | "progress_check"
  | "placement"
  | "lesson";

export const LISTENING_LEVEL_SLUGS = [
  "a1-elementary",
  "a2-pre-intermediate",
  "b1-intermediate",
  "b1-plus-upper-intermediate",
  "b2-pre-advanced",
  "c1-advanced",
] as const;

export const LEVEL_LISTENING_PURPOSES: ListeningPurpose[] = [
  "practice",
  "mixed_test",
  "progress_check",
  "lesson",
];

/** Planned slots per level × purpose. Not a promise that content exists. */
export const EXPECTED_LISTENING_ITEMS_PER_SLOT = 3;

export interface ListeningItem {
  id: string;
  purpose: ListeningPurpose;
  level: string;
  cefr_weight: CefrLevel;
  prompt: string;
  options: string[];
  correct_answer: string;
  audio_src: string;
  transcript: string;
  reviewFeedback: string;
  /** True only when the file at audio_src is actually in public/. */
  audioReady: boolean;
}

export interface GetListeningItemsOptions {
  purpose: ListeningPurpose;
  level?: string;
  playableOnly?: boolean;
}

export const LISTENING_ITEMS: ListeningItem[] = [
  {
    id: "listening_a1_cafe_order",
    purpose: "practice",
    level: "a1-elementary",
    cefr_weight: "A1",
    prompt: "What does the speaker order?",
    options: ["Coffee", "Tea", "Orange juice", "Water"],
    correct_answer: "Tea",
    audio_src: "/audio/listening/a1-cafe-order.mp3",
    transcript: "Hello. I'd like a tea, please. No sugar. Thank you.",
    reviewFeedback: "The speaker asks for tea, with no sugar.",
    audioReady: true,
  },
  {
    id: "listening_a1_train_time",
    purpose: "practice",
    level: "a1-elementary",
    cefr_weight: "A1",
    prompt: "What time does the train leave?",
    options: ["6:15", "7:15", "7:45", "8:15"],
    correct_answer: "7:15",
    audio_src: "/audio/listening/a1-train-time.mp3",
    transcript: "The next train to Manchester leaves at seven fifteen from platform four.",
    reviewFeedback: "The speaker says the train leaves at seven fifteen.",
    audioReady: true,
  },
  {
    id: "listening_a1_weekend_plan",
    purpose: "practice",
    level: "a1-elementary",
    cefr_weight: "A1",
    prompt: "When are they going to the park?",
    options: ["Saturday morning", "Saturday afternoon", "Sunday morning", "Sunday afternoon"],
    correct_answer: "Saturday afternoon",
    audio_src: "/audio/listening/a1-weekend-plan.mp3",
    transcript: "On Saturday, I'm going to the park with my sister. We're going in the afternoon.",
    reviewFeedback: "They are going to the park on Saturday afternoon.",
    audioReady: true,
  },
  {
    id: "listening_a2_weather",
    purpose: "practice",
    level: "a2-pre-intermediate",
    cefr_weight: "A2",
    prompt: "What will the weather be like tomorrow?",
    options: ["Cold and rainy", "Warm and sunny", "Cloudy and windy", "Snowy"],
    correct_answer: "Warm and sunny",
    audio_src: "/audio/listening/a2-weather-tomorrow.mp3",
    transcript:
      "Good morning. Tomorrow will be warm and sunny, with a high of twenty-four degrees. No rain is expected.",
    reviewFeedback: "The forecast is warm and sunny, with no rain expected.",
    audioReady: true,
  },
  {
    id: "listening_a2_doctor",
    purpose: "practice",
    level: "a2-pre-intermediate",
    cefr_weight: "A2",
    prompt: "What time is the appointment?",
    options: ["9:30", "10:30", "11:30", "12:30"],
    correct_answer: "10:30",
    audio_src: "/audio/listening/a2-doctor-appointment.mp3",
    transcript:
      "Hello, this is Green Street Medical Center. Your appointment with Dr. Wilson is on Tuesday at half past ten in the morning.",
    reviewFeedback: "Half past ten means 10:30.",
    audioReady: true,
  },
  {
    id: "listening_a2_shopping",
    purpose: "practice",
    level: "a2-pre-intermediate",
    cefr_weight: "A2",
    prompt: "What is the speaker planning to buy?",
    options: ["Shoes", "A jacket", "A bag", "A shirt"],
    correct_answer: "A jacket",
    audio_src: "/audio/listening/a2-shopping-plan.mp3",
    transcript:
      "I need to buy a new jacket this weekend. I saw one online for sixty pounds, but I'm going to check the shops in town first.",
    reviewFeedback: "The speaker needs a new jacket and will check the shops in town first.",
    audioReady: true,
  },
  {
    id: "listening_b1_late_work",
    purpose: "practice",
    level: "b1-intermediate",
    cefr_weight: "B1",
    prompt: "Why did the speaker take the train?",
    options: [
      "The train was cheaper",
      "The bus did not arrive",
      "The speaker missed the bus",
      "The train was faster than usual",
    ],
    correct_answer: "The bus did not arrive",
    audio_src: "/audio/listening/b1-late-for-work.mp3",
    transcript:
      "I usually take the bus to work, but this morning it didn't arrive. After waiting for twenty minutes, I decided to take the train instead. Luckily, I arrived only five minutes late.",
    reviewFeedback:
      "The bus never came, so the speaker chose the train after waiting — not because the train was cheaper or usually faster.",
    audioReady: true,
  },
  {
    id: "listening_b1_weekend_trip",
    purpose: "practice",
    level: "b1-intermediate",
    cefr_weight: "B1",
    prompt: "Why did they change their plans?",
    options: [
      "The hotel was full",
      "They did not have enough money",
      "The weather forecast predicted rain",
      "The museum was cheaper",
    ],
    correct_answer: "The weather forecast predicted rain",
    audio_src: "/audio/listening/b1-weekend-trip.mp3",
    transcript:
      "We were planning to spend the weekend by the sea, but the weather forecast says it's going to rain. So we've decided to visit a museum and stay in the city instead.",
    reviewFeedback:
      "They stayed in the city because rain was forecast — cost and hotel availability are not mentioned.",
    audioReady: true,
  },
  {
    id: "listening_b1_new_job",
    purpose: "practice",
    level: "b1-intermediate",
    cefr_weight: "B1",
    prompt: "How does the speaker feel about the job now?",
    options: ["More confident", "Bored", "Angry", "Ready to leave"],
    correct_answer: "More confident",
    audio_src: "/audio/listening/b1-new-job.mp3",
    transcript:
      "I started my new job about three weeks ago. At first, I found it difficult because there was so much to learn, but my colleagues have been very helpful and I'm starting to feel more confident.",
    reviewFeedback:
      "The start was difficult, but with help from colleagues the speaker is now beginning to feel more confident.",
    audioReady: true,
  },
  {
    id: "pt_listening_1",
    purpose: "placement",
    level: "placement",
    cefr_weight: "A2",
    prompt: "What time will the meeting start?",
    options: ["2:00", "2:30", "3:00", "3:30"],
    correct_answer: "3:30",
    audio_src: "/audio/listening/placement-listening-1.mp3",
    transcript:
      "Hi Emma, it's Daniel. The meeting has been moved from two o'clock to half past three. We'll meet in room twelve instead of the main office.",
    reviewFeedback: "The meeting was moved to half past three, which means 3:30.",
    audioReady: true,
  },
  {
    id: "pt_listening_2",
    purpose: "placement",
    level: "placement",
    cefr_weight: "B1",
    prompt: "Why did the speaker take a coach?",
    options: [
      "The train was too expensive",
      "The train was cancelled",
      "The coach was faster",
      "The speaker missed the train",
    ],
    correct_answer: "The train was cancelled",
    audio_src: "/audio/listening/placement-listening-2.mp3",
    transcript:
      "I was planning to take the train to Bristol this morning, but it was cancelled because of a signalling problem. I ended up taking a coach instead, which took almost an hour longer.",
    reviewFeedback:
      "The speaker says the train was cancelled because of a signalling problem, so they took a coach instead.",
    audioReady: true,
  },
];

function assertListeningBankIntegrity(items: ListeningItem[]): void {
  const ids = new Set<string>();
  const readySrc = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate Listening id: ${item.id}`);
    }
    ids.add(item.id);
    if (item.audioReady && item.audio_src) {
      if (readySrc.has(item.audio_src)) {
        throw new Error(`Listening audio file used by more than one item: ${item.audio_src}`);
      }
      readySrc.add(item.audio_src);
    }
  }
}

assertListeningBankIntegrity(LISTENING_ITEMS);

function uniqueById(items: ListeningItem[]): ListeningItem[] {
  const seen = new Set<string>();
  const unique: ListeningItem[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  return unique;
}

/**
 * The only supported way to load Listening items. Purpose is required
 * so Mixed Tests cannot accidentally receive the Practice bank.
 */
export function getListeningItems(options: GetListeningItemsOptions): ListeningItem[] {
  const playableOnly = options.playableOnly !== false;
  let items = LISTENING_ITEMS.filter((item) => item.purpose === options.purpose);
  if (options.level) {
    items = items.filter((item) => item.level === options.level);
  }
  if (playableOnly) {
    items = items.filter((item) => item.audioReady && Boolean(item.audio_src));
  }
  return uniqueById(items);
}

export function toListeningPlacementQuestion(item: ListeningItem): PlacementQuestion {
  return {
    id: item.id,
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: item.cefr_weight,
    prompt: item.prompt,
    options: item.options,
    correct_answer: item.correct_answer,
    audio_src: item.audioReady ? item.audio_src : undefined,
    transcript: item.transcript,
  };
}

/** Placement Test questions 5–6. Unique to purpose: "placement". */
export function getPlacementListeningQuestions(): PlacementQuestion[] {
  return getListeningItems({ purpose: "placement", playableOnly: false }).map(toListeningPlacementQuestion);
}

export interface ListeningInventorySlot {
  level: string;
  purpose: ListeningPurpose;
  ready: number;
  expected: number;
}

export interface ListeningInventory {
  byLevel: ListeningInventorySlot[];
  placement: { ready: number; expected: number; note: string };
}

/** Developer inventory — not a learner-facing page. */
export function getListeningInventory(): ListeningInventory {
  const byLevel: ListeningInventorySlot[] = [];
  for (const level of LISTENING_LEVEL_SLUGS) {
    for (const purpose of LEVEL_LISTENING_PURPOSES) {
      const ready = getListeningItems({ purpose, level, playableOnly: true }).length;
      byLevel.push({
        level,
        purpose,
        ready,
        expected: EXPECTED_LISTENING_ITEMS_PER_SLOT,
      });
    }
  }

  const placementReady = getListeningItems({ purpose: "placement", playableOnly: true }).length;
  return {
    byLevel,
    placement: {
      ready: placementReady,
      expected: 2,
      note: "Placement Listening is not level-scoped. Clips are unique — never Practice audio. Ready files: placement-listening-1.mp3, placement-listening-2.mp3.",
    },
  };
}
