/** lib/api-client/writing.ts — See API doc 4.6 and 5.3. */
import { apiRequest } from "./index";
import type { WritingSubmission, RubricScore } from "@/types/entities";

export function submitWriting(payload: { exercise_id?: string; content: string }) {
  return apiRequest<WritingSubmission>("/writing-submissions", { method: "POST", body: payload });
}

export function getPendingSubmissions(classId: string) {
  return apiRequest<WritingSubmission[]>(
    `/teacher/classes/${classId}/writing-submissions?status=pending`
  );
}

export function submitRubricFeedback(
  submissionId: string,
  payload: Omit<RubricScore, "id" | "writing_submission_id" | "reviewer_id" | "reviewed_at">
) {
  return apiRequest<RubricScore>(`/teacher/writing-submissions/${submissionId}/feedback`, {
    method: "POST",
    body: payload,
  });
}
