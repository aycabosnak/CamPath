/** lib/api-client/mockExams.ts — See API doc 4.5 and 5.5. */
import { apiRequest } from "./index";
import type { ReadinessResult } from "@/types/entities";

export function startMockExam(examTypeId: string) {
  return apiRequest<{ session_id: string; sections: Array<{ id: string; name: string; duration_minutes: number }> }>(
    `/mock-exams/${examTypeId}/start`,
    { method: "POST" }
  );
}

export function submitMockExamSection(
  sessionId: string,
  payload: { section_id: string; answers: unknown[] }
) {
  return apiRequest<{ ok: true }>(`/mock-exams/${sessionId}/submit-section`, {
    method: "POST",
    body: payload,
  });
}

export interface MockExamResults {
  overall_result: ReadinessResult;
  section_scores: Record<string, number>;
  recommended_next_unit: { id: string; title: string } | null;
}

export function getMockExamResults(sessionId: string) {
  return apiRequest<MockExamResults>(`/mock-exams/${sessionId}/results`);
}
