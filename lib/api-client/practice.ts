/** lib/api-client/practice.ts — Practice + progress. See API doc 4.4. */
import { apiRequest } from "./index";
import type { Exercise, UserProgress } from "@/types/entities";

export function getExercises(params: { skill?: string; level?: string; examType?: string }) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return apiRequest<Exercise[]>(`/exercises?${qs}`, { authenticated: false });
}

export function submitAttempt(payload: { exercise_id: string; answer: unknown }) {
  return apiRequest<{ session_id: string }>("/users/me/attempts", { method: "POST", body: payload });
}

export function getAttemptResults(sessionId: string) {
  return apiRequest<{ score: number; breakdown: Record<string, number> }>(
    `/users/me/attempts/${sessionId}/results`
  );
}

export function getMyProgress() {
  return apiRequest<UserProgress[]>("/users/me/progress");
}

export function updateLessonProgress(lessonId: string, payload: { status: string; score?: number }) {
  return apiRequest<UserProgress>(`/users/me/progress/${lessonId}`, { method: "POST", body: payload });
}

/** Powers every MyJourneyMetricCard in one call — see Database & API
 *  Design doc Section 4.4 reasoning on why this is a single endpoint
 *  rather than six separate ones. */
export function getMySummary() {
  return apiRequest<unknown>("/users/me/summary");
}
