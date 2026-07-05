/**
 * lib/mock-data/myJourneyData.ts
 *
 * Stand-in content for the Study Path preview and unit counts shown
 * on My Journey. Once GET /api/units?level= (Database & API Design
 * doc, 4.2) is live, `services/myJourneyService.ts` fetches real
 * Unit records instead of reading UNIT_TEMPLATES — this file is
 * deleted at that point, not refactored, since the service already
 * returns the same StudyPathNodeData shape either way.
 */
import type { StudyPathMode } from "@/components/types";

export const UNITS_PER_STAGE: Record<string, string[]> = {
  foundation: ["Greetings & Introductions", "Everyday Objects", "Simple Routines", "Family & Friends", "Numbers & Time"],
  explorer: ["Talking About the Past", "Making Plans", "Describing Places", "Likes & Dislikes", "Shopping & Money"],
  communicator: ["Talking About the Past", "Giving Opinions", "Future Plans", "Comparisons", "Cause & Effect"],
  independent: ["Hypothetical Situations", "Reported Speech", "Formal Requests", "Narrative Tenses", "Persuasive Writing"],
  advanced: ["Nuanced Argumentation", "Idiomatic Language", "Academic Register", "Complex Conditionals", "Critical Analysis"],
  master: ["Rhetorical Precision", "Stylistic Range", "Specialised Registers", "Ambiguity & Nuance", "Editorial Judgement"],
};

export const DEFAULT_STUDY_PATH_MODE: StudyPathMode = "guided";
