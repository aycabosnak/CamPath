/**
 * services/progressService.ts
 *
 * Single source of truth for everything "progress" — lesson
 * completion, accumulated study time, study-day consistency, and
 * practice-driven mastery adjustments. Every page/component that
 * needs to read or change progress goes through this file; nothing
 * else touches localStorage for progress data directly. This is the
 * "reusable progress helper" layer requested — avoids the same
 * completion/persistence logic being reimplemented per page.
 *
 * Persistence: localStorage today, under one key. Swapping to a real
 * backend later (POST /api/users/me/progress/:lessonId, per the
 * Database & API Design doc) only requires changing the functions in
 * this file — callers already treat them as the source of truth.
 */
import type { Skill } from "@/components/types";

export interface ProgressState {
  /** Unit slugs, e.g. "unit-1". Presence in this array = completed. */
  completedLessons: string[];
  /** Total accumulated study time, in minutes, across all lessons. */
  studyTimeMinutes: number;
  /** Unique ISO dates (YYYY-MM-DD) on which the learner did something. */
  studyDates: string[];
  /** Practice-driven mastery adjustments, layered on top of the
   *  placement test's skill_breakdown by myJourneyService. */
  masteryOverrides: Partial<Record<Skill, number>>;
}

const STORAGE_KEY = "campath_progress_state";

const DEFAULT_STATE: ProgressState = {
  completedLessons: [],
  studyTimeMinutes: 0,
  studyDates: [],
  masteryOverrides: {},
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function readState(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Merge with defaults so older/partial saved states (from before a
    // field existed) never crash a page that expects the new shape.
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: ProgressState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function markStudyDayActive(state: ProgressState): ProgressState {
  const today = todayIso();
  if (state.studyDates.includes(today)) return state;
  return { ...state, studyDates: [...state.studyDates, today] };
}

export function getProgressState(): ProgressState {
  return readState();
}

export function isLessonCompleted(unitSlug: string): boolean {
  return readState().completedLessons.includes(unitSlug);
}

export interface CompleteLessonResult {
  alreadyCompleted: boolean;
  state: ProgressState;
}

/**
 * Idempotent by design: calling this twice for the same unitSlug
 * never duplicates the completion or double-counts study time —
 * directly answers the "prevent duplicate completions" requirement.
 */
export function completeLesson(unitSlug: string, minutesSpent: number): CompleteLessonResult {
  let state = readState();

  if (state.completedLessons.includes(unitSlug)) {
    return { alreadyCompleted: true, state };
  }

  state = {
    ...state,
    completedLessons: [...state.completedLessons, unitSlug],
    studyTimeMinutes: state.studyTimeMinutes + Math.max(0, minutesSpent),
  };
  state = markStudyDayActive(state);
  writeState(state);
  return { alreadyCompleted: false, state };
}

/**
 * Prototype heuristic for "completing a practice session": since the
 * full Practice module isn't built yet, one click of "Start Practice"
 * simulates a session that raises that skill's mastery. This is
 * explicitly a placeholder — once real Practice exercises exist,
 * this should be driven by actual UserExerciseAttempt results
 * (Database & API Design doc), not a fixed bump.
 */
export function recordPracticeSession(skill: Skill, currentPercentage: number, bump = 40): ProgressState {
  let state = readState();
  const newValue = Math.min(100, currentPercentage + bump);
  state = {
    ...state,
    masteryOverrides: { ...state.masteryOverrides, [skill]: newValue },
  };
  state = markStudyDayActive(state);
  writeState(state);
  return state;
}

export function getStudyConsistency(daysInPeriod = 30): { daysActive: number; daysInPeriod: number } {
  const state = readState();
  return { daysActive: Math.min(state.studyDates.length, daysInPeriod), daysInPeriod };
}

export function getStudyTime(): { hours: number; minutes: number } {
  const total = readState().studyTimeMinutes;
  return { hours: Math.floor(total / 60), minutes: total % 60 };
}

/** Escape hatch for testing — not wired to any UI button by default. */
export function resetProgress(): void {
  writeState(DEFAULT_STATE);
}
