/**
 * lib/api-client/levelTest.ts
 * Mirrors Database & API Design doc, Section 4.3 and 5.1.
 */
import { apiRequest } from "./index";
import type { Skill, Level } from "@/types/entities";

export interface StartLevelTestResponse {
  session_id: string;
  guest_token?: string;
  first_exercise: { id: string; skill: Skill["slug"]; content: unknown };
}

export function startLevelTest() {
  return apiRequest<StartLevelTestResponse>("/level-test/start", {
    method: "POST",
    authenticated: false,
  });
}

export function submitLevelTestAnswer(
  sessionId: string,
  payload: { exercise_id: string; answer: unknown }
) {
  return apiRequest<{ next_exercise: { id: string; skill: Skill["slug"]; content: unknown } | null }>(
    `/level-test/${sessionId}/answer`,
    { method: "POST", body: payload, authenticated: false }
  );
}

export function completeLevelTest(sessionId: string) {
  return apiRequest<{ ok: true }>(`/level-test/${sessionId}/complete`, {
    method: "POST",
    authenticated: false,
  });
}

export interface LevelTestResults {
  result_level: Pick<Level, "slug" | "cefr">;
  skill_breakdown: Record<Skill["slug"], number>;
}

export function getLevelTestResults(sessionId: string) {
  return apiRequest<LevelTestResults>(`/level-test/${sessionId}/results`, {
    authenticated: false,
  });
}
