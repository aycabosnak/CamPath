/**
 * lib/mock-data/levels.ts
 *
 * Static local fixtures so UI can be built and previewed before the
 * real backend exists. Shapes match types/entities.ts exactly —
 * when the real API is wired in, these files are deleted, not
 * refactored, because api-client functions already return the same
 * shape. Never import mock-data from anywhere except Storybook-style
 * preview pages or local dev fallbacks.
 */
import type { Level } from "@/types/entities";

export const MOCK_LEVELS: Level[] = [
  { id: "lvl_foundation", slug: "foundation", cefr: "A1", stage_name: "Foundation", order: 1 },
  { id: "lvl_explorer", slug: "explorer", cefr: "A2", stage_name: "Explorer", order: 2 },
  { id: "lvl_communicator", slug: "communicator", cefr: "B1", stage_name: "Communicator", order: 3 },
  { id: "lvl_independent", slug: "independent", cefr: "B2", stage_name: "Independent", order: 4 },
  { id: "lvl_advanced", slug: "advanced", cefr: "C1", stage_name: "Advanced", order: 5 },
  { id: "lvl_master", slug: "master", cefr: "C2", stage_name: "Master", order: 6 },
];
