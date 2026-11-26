/**
 * services/progressService.ts
 *
 * Single source of truth for everything "progress" — lesson
 * completion (with enough detail to show a meaningful completed
 * state), accumulated study time, study-day consistency, and
 * practice-driven mastery adjustments.
 *
 * v1.1: completions are now a record keyed by unit slug, storing
 * *when* and *how* a lesson was completed — not just a flat list of
 * slugs. This was needed to make the "Already Completed" view show
 * real information instead of a generic message. `completedLessons`
 * (a plain string array) is no longer stored separately — it's
 * always derived from `Object.keys(completions)`, so there is exactly
 * one place completion is recorded.
 */
import type { Skill } from "@/components/types";
import { STORAGE_KEYS } from "@/constants/storageKeys";

export interface LessonCompletionRecord {
  completedAt: string; // ISO timestamp
  correctFirstTry: boolean;
  minutesSpent: number;
}

export interface MilestoneRecord {
  id: string; // levelSlug, unique per level
  label: string; // e.g. "Completed A1 Elementary"
  achievedAt: string; // ISO timestamp
  isBridge: boolean; // true for B1+ — rendered lighter, not equal to a full level milestone
}

export interface ProgressCheckRecord {
  completedAt: string;
  correctCount: number;
  totalCount: number;
}

export interface TestAttemptRecord {
  completedAt: string;
  correctCount: number;
  totalCount: number;
}

export interface ProgressState {
  completions: Record<string, LessonCompletionRecord>;
  /** Level Curriculum lesson completions (e.g. "a1-grammar-1") — a
   *  deliberately separate namespace from `completions` above, which
   *  belongs to the CamPath-Stage-based Study Path (unit-1/2/3) and
   *  must not be touched by the new Level Curriculum architecture. */
  curriculumCompletions: Record<string, LessonCompletionRecord>;
  /** Keyed by test id (e.g. "test-1"). Records that a Mixed Test has
   *  been attempted at least once — needed so getLevelProgress's
   *  sequencing can move past it and recommend the Progress Check
   *  next. Tests remain freely retakeable regardless: this is a
   *  sequencing signal only, never a lock. */
  testAttempts: Record<string, TestAttemptRecord>;
  progressChecks: Record<string, ProgressCheckRecord>; // keyed by levelSlug
  milestones: MilestoneRecord[];
  studyTimeMinutes: number;
  studyDates: string[];
  masteryOverrides: Partial<Record<Skill, number>>;
  /** When each mastery value was last set (ISO). Lets account sync
   *  resolve two devices' values by "latest wins". */
  masteryUpdatedAt: Partial<Record<Skill, string>>;
}

const STORAGE_KEY = STORAGE_KEYS.progress;

const DEFAULT_STATE: ProgressState = {
  completions: {},
  curriculumCompletions: {},
  testAttempts: {},
  progressChecks: {},
  milestones: [],
  studyTimeMinutes: 0,
  studyDates: [],
  masteryOverrides: {},
  masteryUpdatedAt: {},
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Migrates the previous shape (`completedLessons: string[]`, no
 * per-lesson detail) into the current one, so a browser that already
 * has prototype data from an earlier sprint doesn't lose progress or
 * crash. Each migrated lesson gets a synthetic "completed now" record
 * — we have no real timestamp for it, and that's an honest tradeoff.
 */
function migrate(parsed: any): ProgressState {
  if (parsed && parsed.completions) {
    return { ...DEFAULT_STATE, ...parsed };
  }
  if (parsed && Array.isArray(parsed.completedLessons)) {
    const completions: Record<string, LessonCompletionRecord> = {};
    for (const slug of parsed.completedLessons) {
      completions[slug] = { completedAt: new Date().toISOString(), correctFirstTry: true, minutesSpent: 1 };
    }
    return { ...DEFAULT_STATE, ...parsed, completions };
  }
  return DEFAULT_STATE;
}

function readState(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return migrate(JSON.parse(raw));
  } catch {
    return DEFAULT_STATE;
  }
}

/** Fired after every local progress change — services/syncService.ts
 *  listens for it to push changes to the learner's account. */
export const PROGRESS_CHANGED_EVENT = "campath:progress-changed";

function writeState(state: ProgressState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(PROGRESS_CHANGED_EVENT));
}

/**
 * Replaces the whole local state with the account's merged state after
 * a sync. Deliberately does NOT fire PROGRESS_CHANGED_EVENT — that
 * would trigger another sync of data the server just sent.
 */
export function replaceProgressState(state: ProgressState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_STATE, ...state }));
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
  return Boolean(readState().completions[unitSlug]);
}

export function getLessonCompletion(unitSlug: string): LessonCompletionRecord | null {
  return readState().completions[unitSlug] ?? null;
}

export interface CompleteLessonResult {
  alreadyCompleted: boolean;
  record: LessonCompletionRecord;
  state: ProgressState;
}

/**
 * Idempotent by design: calling this twice for the same unitSlug
 * never overwrites the original completion record or double-counts
 * study time — it just returns the existing record.
 */
export function completeLesson(
  unitSlug: string,
  minutesSpent: number,
  correctFirstTry: boolean
): CompleteLessonResult {
  let state = readState();
  const existing = state.completions[unitSlug];
  if (existing) {
    return { alreadyCompleted: true, record: existing, state };
  }

  const record: LessonCompletionRecord = {
    completedAt: new Date().toISOString(),
    correctFirstTry,
    minutesSpent: Math.max(0, minutesSpent),
  };

  state = {
    ...state,
    completions: { ...state.completions, [unitSlug]: record },
    studyTimeMinutes: state.studyTimeMinutes + record.minutesSpent,
  };
  state = markStudyDayActive(state);
  writeState(state);
  return { alreadyCompleted: false, record, state };
}

/**
 * Level Curriculum equivalent of completeLesson() above — same
 * idempotency guarantee, same shared study-time/study-day pool, but
 * writes to `curriculumCompletions` instead of `completions` so the
 * Study Path (unit-1/2/3) is never affected by Level Curriculum
 * activity or vice versa.
 */
export function completeCurriculumLesson(
  lessonId: string,
  minutesSpent: number,
  correctFirstTry: boolean
): CompleteLessonResult {
  let state = readState();
  const existing = state.curriculumCompletions[lessonId];
  if (existing) {
    return { alreadyCompleted: true, record: existing, state };
  }

  const record: LessonCompletionRecord = {
    completedAt: new Date().toISOString(),
    correctFirstTry,
    minutesSpent: Math.max(0, minutesSpent),
  };

  state = {
    ...state,
    curriculumCompletions: { ...state.curriculumCompletions, [lessonId]: record },
    studyTimeMinutes: state.studyTimeMinutes + record.minutesSpent,
  };
  state = markStudyDayActive(state);
  writeState(state);
  return { alreadyCompleted: false, record, state };
}

export function isCurriculumLessonCompleted(lessonId: string): boolean {
  return Boolean(readState().curriculumCompletions[lessonId]);
}

export function getCurriculumLessonCompletion(lessonId: string): LessonCompletionRecord | null {
  return readState().curriculumCompletions[lessonId] ?? null;
}

/**
 * Records a Progress Check result AND fires the level's Milestone in
 * one atomic write — a Milestone only ever comes from a Progress
 * Check completion (never from a single lesson or a Mixed Test), per
 * the approved curriculum architecture. Idempotent: retaking a
 * Progress Check updates the score record but never duplicates the
 * Milestone.
 */
/**
 * `skillBreakdown`, when provided, writes directly into the SAME
 * masteryOverrides field Practice Weakest Skill already uses — no
 * second mastery concept was introduced. Unlike Practice's "bump by
 * 40" heuristic, a Progress Check is a real, deliberate assessment,
 * so it SETS the measured percentage rather than nudging toward it.
 */
/**
 * Records that a Mixed Test was attempted — sequencing signal only.
 * Tests stay freely retakeable; this just lets getLevelProgress know
 * the learner has been through it at least once, so the recommended
 * sequence can advance to the Progress Check.
 *
 * Keyed by `${levelSlug}:${testId}`, not testId alone — test ids like
 * "test-1" are reused across levels (every level's placeholder is
 * named "test-1"), so a bare testId key would collide the moment a
 * second level has a real Test 1.
 */
export function recordTestAttempt(levelSlug: string, testId: string, correctCount: number, totalCount: number): ProgressState {
  let state = readState();
  const key = `${levelSlug}:${testId}`;
  state = {
    ...state,
    testAttempts: {
      ...state.testAttempts,
      [key]: { completedAt: new Date().toISOString(), correctCount, totalCount },
    },
  };
  state = markStudyDayActive(state);
  writeState(state);
  return state;
}

export function getTestAttempt(levelSlug: string, testId: string): TestAttemptRecord | null {
  return readState().testAttempts[`${levelSlug}:${testId}`] ?? null;
}

export function recordProgressCheck(
  levelSlug: string,
  correctCount: number,
  totalCount: number,
  milestoneLabel: string,
  isBridge: boolean,
  skillBreakdown?: Partial<Record<Skill, number>>
): ProgressState {
  let state = readState();

  state = {
    ...state,
    progressChecks: {
      ...state.progressChecks,
      [levelSlug]: { completedAt: new Date().toISOString(), correctCount, totalCount },
    },
  };

  if (skillBreakdown) {
    const now = new Date().toISOString();
    const stamps = Object.fromEntries(Object.keys(skillBreakdown).map((s) => [s, now]));
    state = {
      ...state,
      masteryOverrides: { ...state.masteryOverrides, ...skillBreakdown },
      masteryUpdatedAt: { ...state.masteryUpdatedAt, ...stamps },
    };
  }

  const alreadyHasMilestone = state.milestones.some((m) => m.id === levelSlug);
  if (!alreadyHasMilestone) {
    state = {
      ...state,
      milestones: [
        ...state.milestones,
        { id: levelSlug, label: milestoneLabel, achievedAt: new Date().toISOString(), isBridge },
      ],
    };
  }

  state = markStudyDayActive(state);
  writeState(state);
  return state;
}

export function getProgressCheckRecord(levelSlug: string): ProgressCheckRecord | null {
  return readState().progressChecks[levelSlug] ?? null;
}

export function getMilestones(): MilestoneRecord[] {
  return [...readState().milestones].sort((a, b) => b.achievedAt.localeCompare(a.achievedAt));
}

/**
 * Prototype heuristic for "completing a practice session" — see
 * previous sprint's note: once real Practice exercises exist, this
 * should be driven by actual attempt results, not a fixed bump.
 */
export function recordPracticeSession(skill: Skill, currentPercentage: number, bump = 40): ProgressState {
  let state = readState();
  const newValue = Math.min(100, currentPercentage + bump);
  state = {
    ...state,
    masteryOverrides: { ...state.masteryOverrides, [skill]: newValue },
    masteryUpdatedAt: { ...state.masteryUpdatedAt, [skill]: new Date().toISOString() },
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
