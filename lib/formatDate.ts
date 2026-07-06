/**
 * lib/formatDate.ts
 *
 * Extracted during the Engineering Cleanup Sprint — the exact same
 * `toLocaleDateString` call was duplicated identically in three
 * places (UnitLessonView, CurriculumLessonView, and My Journey's
 * Milestones list). Trivial individually, but a real, verified
 * duplication worth collapsing since all three need to stay in sync
 * if the display format ever changes.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
