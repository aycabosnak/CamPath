/** constants/cefr.ts — single source of truth for Stage↔CEFR naming, matching IA Blueprint Section 2. */
export const STAGE_TO_CEFR = {
  foundation: "A1",
  explorer: "A2",
  communicator: "B1",
  independent: "B2",
  advanced: "C1",
  master: "C2",
} as const;

export const STAGE_LABELS = {
  foundation: "Foundation",
  explorer: "Explorer",
  communicator: "Communicator",
  independent: "Independent",
  advanced: "Advanced",
  master: "Master",
} as const;

export const STAGE_NAME_TO_SLUG: Record<string, keyof typeof STAGE_LABELS> = {
  Foundation: "foundation",
  Explorer: "explorer",
  Communicator: "communicator",
  Independent: "independent",
  Advanced: "advanced",
  Master: "master",
};
