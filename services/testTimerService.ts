/**
 * services/testTimerService.ts
 *
 * Persists the ENTIRE in-progress Placement Test session — not just
 * the countdown, but the current question index and answers too.
 * This goes slightly beyond the literal "persist the timer" ask: if
 * only the timer survived a refresh, the countdown would keep
 * ticking correctly but every answered question would vanish (state
 * resets to empty), which is a worse, inconsistent experience than
 * either "nothing persists" or "everything persists". See the
 * explanation given to the user before this file was written.
 *
 * The timer itself is stored as an absolute deadline (epoch ms), not
 * a remaining-seconds counter — remaining time is always recomputed
 * as `deadline - Date.now()`. This is immune to setInterval drift,
 * throttled background tabs, and page refreshes, because it never
 * depends on how many ticks actually fired, only on wall-clock time.
 */
import type { PlacementAnswerMap } from "@/services/placementTestService";

const SESSION_KEY = "campath_level_test_session";
export const TEST_DURATION_MS = 15 * 60 * 1000;

export interface TimedTestSession {
  deadline: number; // epoch ms
  index: number;
  answers: PlacementAnswerMap;
}

export function readSession(): TimedTestSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as TimedTestSession) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: TimedTestSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function createNewSession(): TimedTestSession {
  const session: TimedTestSession = {
    deadline: Date.now() + TEST_DURATION_MS,
    index: 0,
    answers: {},
  };
  writeSession(session);
  return session;
}

export function getRemainingMs(session: TimedTestSession): number {
  return Math.max(0, session.deadline - Date.now());
}

export function formatMmSs(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
