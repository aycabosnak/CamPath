/**
 * services/unitLessonService.ts
 * Thin accessor over lib/mock-data/unitLessons.ts — pages never read
 * the mock-data file directly, consistent with every other feature.
 */
import { UNIT_LESSONS, type UnitLessonContent } from "@/lib/mock-data/unitLessons";

export async function getUnitLesson(unitSlug: string): Promise<UnitLessonContent | null> {
  return UNIT_LESSONS[unitSlug] ?? null;
}
