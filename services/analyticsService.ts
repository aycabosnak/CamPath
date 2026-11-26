/**
 * services/analyticsService.ts
 *
 * Prototype-stage analytics. Every event listed in this sprint's
 * requirements is defined here as a typed constant so call sites
 * can't typo an event name. For now this logs to the console and
 * appends to localStorage — once a backend exists, only the body of
 * `trackEvent` changes (to a `POST /api/analytics/events` call);
 * every call site elsewhere in the app stays identical.
 *
 * This directly answers Design Review Report Finding #6 (Senior UX
 * Researcher / CTO): the product previously had zero instrumentation,
 * meaning no way to learn whether any design decision actually works.
 */

export type AnalyticsEventName =
  | "home_viewed"
  | "level_test_started"
  | "level_test_completed"
  | "results_viewed"
  | "my_journey_viewed"
  | "learn_preview_opened"
  | "lesson_started"
  | "lesson_completed"
  | "practice_started"
  | "test_started"
  | "test_completed"
  | "signup"
  | "login"
  | "logout"
  | "progress_synced";

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  timestamp: string;
  payload?: Record<string, unknown>;
}

import { STORAGE_KEYS } from "@/constants/storageKeys";

const STORAGE_KEY = STORAGE_KEYS.analytics;

export function trackEvent(event: AnalyticsEventName, payload?: Record<string, unknown>): void {
  const entry: AnalyticsEvent = {
    event,
    timestamp: new Date().toISOString(),
    payload,
  };

  // eslint-disable-next-line no-console
  console.log("[analytics]", entry.event, entry.payload ?? "");

  if (typeof window === "undefined") return;
  try {
    const existing: AnalyticsEvent[] = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    existing.push(entry);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Analytics must never break the product experience — fail silently.
  }
}

/** Lets us inspect what was captured during a user testing session. */
export function getTrackedEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function clearTrackedEvents(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
