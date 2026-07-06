/**
 * services/curriculumService.ts
 *
 * Accessor layer for the new Level Curriculum content
 * (lib/mock-data/curriculumLessons.ts, lib/mock-data/progressChecks.ts).
 * Kept separate from testsService.ts (Mixed Tests) even though both
 * live under /tests/[level] — Lessons, Mixed Tests, and the Progress
 * Check are three distinct concepts in the approved curriculum
 * architecture and deserve distinct, readable service boundaries
 * rather than one large mixed file.
 */
import { getCurriculumLessonsForLevel, getCurriculumLesson as getCurriculumLessonData, type CurriculumLesson } from "@/lib/mock-data/curriculumLessons";
import { getProgressCheck as getProgressCheckData, type ProgressCheckContent } from "@/lib/mock-data/progressChecks";
import type { Skill } from "@/components/types";

export async function getLessonsForLevel(levelSlug: string): Promise<CurriculumLesson[]> {
  return getCurriculumLessonsForLevel(levelSlug);
}

export async function getLesson(levelSlug: string, lessonId: string): Promise<CurriculumLesson | null> {
  return getCurriculumLessonData(levelSlug, lessonId);
}

export async function getProgressCheck(levelSlug: string): Promise<ProgressCheckContent | null> {
  return getProgressCheckData(levelSlug);
}

/** Groups a level's lessons by skill, in the approved learning
 *  sequence order (Grammar -> Vocabulary -> Reading -> Writing) —
 *  used by the level page to render each section in the right order
 *  regardless of the order lessons happen to be authored in. */
const SEQUENCE_ORDER: Skill[] = ["grammar", "vocabulary", "reading", "writing", "useOfEnglish"];

export async function getLessonsGroupedBySkill(
  levelSlug: string
): Promise<Array<{ skill: Skill; lessons: CurriculumLesson[] }>> {
  const lessons = await getLessonsForLevel(levelSlug);
  return SEQUENCE_ORDER.map((skill) => ({
    skill,
    lessons: lessons.filter((l) => l.skill === skill),
  })).filter((group) => group.lessons.length > 0);
}
