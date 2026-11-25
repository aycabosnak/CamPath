/**
 * constants/testLevels.ts
 *
 * Learner-friendly level names for the Tests feature (Option C,
 * approved) — kept deliberately separate from the CamPath Stage
 * system (Foundation..Master) used everywhere else in the app. The
 * `bridge` field is the only place these two systems touch, and only
 * where it's genuinely useful (level cards, level detail header).
 *
 * Two honest gaps, not silently smoothed over:
 * - "B1+ Upper Intermediate" has no 1:1 CamPath Stage — it sits
 *   between Communicator and Independent, so its bridge says
 *   "Bridges toward" rather than "Maps to".
 * - CamPath's Stage system stops at Master (C2), but this level list
 *   (matching the approved brief) stops at C1 Advanced — there is no
 *   C2 entry yet. See services/testsService.ts for how a Master-level
 *   placement result is handled without pretending a C2 level exists.
 */
import type { CefrLevel, StageName } from "@/components/types";

export interface TestLevelMeta {
  slug: string;
  title: string;
  /** Shown on the dedicated level page's H1 — distinct from `title`
   *  (used in compact grids like Home/Footer where a long descriptive
   *  title doesn't fit). Only B1+ currently differs from `title`. */
  pageTitle: string;
  cefr: CefrLevel | null;
  shortLabel: string;
  /** True only for B1+ — approved architecture decision: B1+ is a
   *  consolidation bridge between B1 and B2, not a formal CEFR level.
   *  Affects Progress Check -> Milestone treatment (lighter, not
   *  equal to a full level's milestone) and should gate any future
   *  "this is a full level" UI language. */
  isBridge: boolean;
  bridge: string | null;
  description: string;
}

export const TEST_LEVELS: TestLevelMeta[] = [
  {
    slug: "a1-elementary",
    title: "A1 Elementary",
    pageTitle: "A1 Elementary",
    cefr: "A1",
    shortLabel: "A1",
    isBridge: false,
    bridge: "Maps to: Foundation",
    description: "The basics — everyday phrases, simple present tense, and core vocabulary.",
  },
  {
    slug: "a2-pre-intermediate",
    title: "A2 Pre-Intermediate",
    pageTitle: "A2 Pre-Intermediate",
    cefr: "A2",
    shortLabel: "A2",
    isBridge: false,
    bridge: "Maps to: Explorer",
    description: "Talking about the past, making comparisons, and describing daily routines.",
  },
  {
    slug: "b1-intermediate",
    title: "B1 Intermediate",
    pageTitle: "B1 Intermediate",
    cefr: "B1",
    shortLabel: "B1",
    isBridge: false,
    bridge: "Maps to: Communicator",
    description: "Expressing opinions, real future possibilities, and everyday narrative tenses.",
  },
  {
    slug: "b1-plus-upper-intermediate",
    title: "B1+ Upper Intermediate",
    pageTitle: "B1+ — Bridge to B2",
    cefr: "B1",
    shortLabel: "B1+",
    isBridge: true,
    bridge: "Bridges toward: Independent",
    description: "Consolidating B1 grammar while building toward more complex, abstract language.",
  },
  {
    slug: "b2-pre-advanced",
    title: "B2 Pre-Advanced",
    pageTitle: "B2 Pre-Advanced",
    cefr: "B2",
    shortLabel: "B2",
    isBridge: false,
    bridge: "Maps to: Independent",
    description: "The passive voice, work and career vocabulary, reading for attitude, and linking devices.",
  },
  {
    slug: "c1-advanced",
    title: "C1 Advanced",
    pageTitle: "C1 Advanced",
    cefr: "C1",
    shortLabel: "C1",
    isBridge: false,
    bridge: "Maps to: Advanced",
    description: "Nuanced argumentation, idiomatic language, and academic register.",
  },
  {
    slug: "grammar-shorts",
    title: "Grammar Shorts",
    pageTitle: "Grammar Shorts",
    cefr: null,
    shortLabel: "GS",
    isBridge: false,
    bridge: null,
    description: "Quick, focused grammar-only drills — for any level, whenever you need a refresher.",
  },
];

export function getTestLevelBySlug(slug: string): TestLevelMeta | null {
  return TEST_LEVELS.find((l) => l.slug === slug) ?? null;
}

/**
 * Maps a CamPath Stage (from a Placement Test result) to the closest
 * Tests level slug. "Master" has no direct match in this level list
 * (see file header) — it honestly falls back to C1 Advanced rather
 * than inventing a C2 entry that doesn't exist yet.
 */
const STAGE_TO_TEST_LEVEL_SLUG: Record<StageName, string> = {
  Foundation: "a1-elementary",
  Explorer: "a2-pre-intermediate",
  Communicator: "b1-intermediate",
  Independent: "b2-pre-advanced",
  Advanced: "c1-advanced",
  Master: "c1-advanced", // closest available — see file header note
};

export function getTestLevelSlugForStage(stage: StageName): string {
  return STAGE_TO_TEST_LEVEL_SLUG[stage];
}
