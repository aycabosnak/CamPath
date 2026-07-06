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

export interface LevelSequenceNode {
  id: string;
  order: number;
  state: "completed" | "recommended" | "notStarted";
  title: string;
  subtitle: string;
  href: string;
}

/**
 * UX review follow-up: builds ONE sequential list spanning lessons,
 * Mixed Tests, and the Progress Check — rendered through the same
 * StudyPath/StudyPathNode components already proven on My Journey.
 * This directly reuses an existing, already-solved pattern (current
 * item stands out, completed items are quiet, nothing is locked)
 * instead of inventing a new visual language for "what's next".
 */
export async function getLevelSequence(levelSlug: string): Promise<LevelSequenceNode[]> {
  const { isCurriculumLessonCompleted, getProgressCheckRecord, getTestAttempt } = await import("@/services/progressService");
  const { getTestsForLevel } = await import("@/lib/mock-data/tests");

  const lessons = await getLessonsForLevel(levelSlug);
  const orderedLessons = SEQUENCE_ORDER.flatMap((skill) => lessons.filter((l) => l.skill === skill));
  const tests = getTestsForLevel(levelSlug).filter((t) => t.status === "available");
  const progressCheck = await getProgressCheckData(levelSlug);

  let order = 0;
  let recommendedAssigned = false;
  const nodes: LevelSequenceNode[] = [];

  for (const lesson of orderedLessons) {
    order += 1;
    const completed = isCurriculumLessonCompleted(lesson.id);
    nodes.push({
      id: lesson.id,
      order,
      state: completed ? "completed" : !recommendedAssigned ? "recommended" : "notStarted",
      title: lesson.title,
      subtitle: completed ? "✓ Completed" : !recommendedAssigned ? "▶ Continue" : "Not Started",
      href: `/tests/${levelSlug}/lessons/${lesson.id}`,
    });
    if (!completed) recommendedAssigned = true;
  }

  for (const test of tests) {
    order += 1;
    // "Completed" = attempted at least once (sequencing signal only —
    // tests stay freely retakeable regardless of this state).
    const attempted = Boolean(getTestAttempt(levelSlug, test.id));
    nodes.push({
      id: test.id,
      order,
      state: attempted ? "completed" : !recommendedAssigned ? "recommended" : "notStarted",
      title: test.title,
      subtitle: attempted ? "✓ Completed" : !recommendedAssigned ? "▶ Continue" : "Not Started",
      href: `/tests/${levelSlug}/${test.id}`,
    });
    if (!attempted) recommendedAssigned = true;
  }

  if (progressCheck) {
    order += 1;
    const done = getProgressCheckRecord(levelSlug);
    nodes.push({
      id: "progress-check",
      order,
      state: done ? "completed" : !recommendedAssigned ? "recommended" : "notStarted",
      title: progressCheck.title,
      subtitle: done ? "✓ Completed" : !recommendedAssigned ? "▶ Continue" : "Not Started",
      href: `/tests/${levelSlug}/progress-check`,
    });
  }

  return nodes;
}

export interface LevelProgressItem {
  id: string;
  type: "lesson" | "test" | "progressCheck";
  title: string;
  href: string;
  completed: boolean;
}

export interface LevelProgress {
  items: LevelProgressItem[];
  completedCount: number;
  totalCount: number;
  /** First not-yet-completed item, or null if the level is fully done
   *  (or has no content at all yet). */
  nextItem: LevelProgressItem | null;
}

/**
 * The single traversal of "this level's lessons, then tests, then
 * progress check, in order" — extracted so getLevelSequence() (above,
 * the level page's StudyPath rendering) and myJourneyService (the
 * dashboard's numbers) never maintain two copies of this walk.
 */
export async function getLevelProgress(levelSlug: string): Promise<LevelProgress> {
  const { isCurriculumLessonCompleted, getProgressCheckRecord, getTestAttempt } = await import("@/services/progressService");
  const { getTestsForLevel } = await import("@/lib/mock-data/tests");

  const lessons = await getLessonsForLevel(levelSlug);
  const orderedLessons = SEQUENCE_ORDER.flatMap((skill) => lessons.filter((l) => l.skill === skill));
  const tests = getTestsForLevel(levelSlug).filter((t) => t.status === "available");
  const progressCheck = await getProgressCheckData(levelSlug);

  const items: LevelProgressItem[] = [];

  for (const lesson of orderedLessons) {
    items.push({
      id: lesson.id,
      type: "lesson",
      title: lesson.title,
      href: `/tests/${levelSlug}/lessons/${lesson.id}`,
      completed: isCurriculumLessonCompleted(lesson.id),
    });
  }
  for (const test of tests) {
    items.push({
      id: test.id,
      type: "test",
      title: test.title,
      href: `/tests/${levelSlug}/${test.id}`,
      // "Completed" here means "attempted at least once" — used only
      // to advance the recommended sequence to the Progress Check.
      // Tests remain freely retakeable regardless (see
      // /tests/[level]/[testId], which never gates a retake on this).
      completed: Boolean(getTestAttempt(levelSlug, test.id)),
    });
  }
  if (progressCheck) {
    const done = getProgressCheckRecord(levelSlug);
    items.push({
      id: "progress-check",
      type: "progressCheck",
      title: progressCheck.title,
      href: `/tests/${levelSlug}/progress-check`,
      completed: Boolean(done),
    });
  }

  const completedCount = items.filter((i) => i.completed).length;
  const nextItem = items.find((i) => !i.completed) ?? null;

  return { items, completedCount, totalCount: items.length, nextItem };
}

export interface NextStep {
  label: string;
  href: string;
}

/**
 * UX review follow-up: resolves what "next" means after finishing a
 * lesson, so the completion screen can offer a contextual action
 * instead of a generic "Back to Level". Falls back to the level's
 * first available Mixed Test once the last lesson in sequence is
 * done — the learner never has to re-scan the level page to find
 * their next step manually.
 */
export async function getNextStepAfterLesson(levelSlug: string, lessonId: string): Promise<NextStep> {
  const lessons = await getLessonsForLevel(levelSlug);
  const orderedBySkill = SEQUENCE_ORDER.flatMap((skill) => lessons.filter((l) => l.skill === skill));
  const currentIndex = orderedBySkill.findIndex((l) => l.id === lessonId);
  const next = currentIndex >= 0 ? orderedBySkill[currentIndex + 1] : undefined;

  if (next) {
    return { label: `Continue to ${next.title}`, href: `/tests/${levelSlug}/lessons/${next.id}` };
  }

  const { getTestsForLevel } = await import("@/lib/mock-data/tests");
  const firstAvailableTest = getTestsForLevel(levelSlug).find((t) => t.status === "available");
  if (firstAvailableTest) {
    return { label: "Continue to Mixed Test", href: `/tests/${levelSlug}/${firstAvailableTest.id}` };
  }

  return { label: "Back to Level", href: `/tests/${levelSlug}` };
}
