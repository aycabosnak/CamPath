/** lib/api-client/teacher.ts — See API doc 4.7. Every function here
 *  assumes the caller already has role === "teacher"; middleware.ts
 *  is the enforcement point, not this file. */
import { apiRequest } from "./index";
import type { Class, Assignment } from "@/types/entities";

export function getMyClasses() {
  return apiRequest<Class[]>("/teacher/classes");
}

export function createClass(name: string) {
  return apiRequest<Class>("/teacher/classes", { method: "POST", body: { name } });
}

export function getClassHeatmap(classId: string) {
  return apiRequest<unknown>(`/teacher/classes/${classId}/heatmap`);
}

export function inviteStudent(classId: string, email?: string) {
  return apiRequest<{ invite_code: string }>(`/teacher/classes/${classId}/invite`, {
    method: "POST",
    body: { email },
  });
}

export function getClassStudents(classId: string) {
  return apiRequest<unknown[]>(`/teacher/classes/${classId}/students`);
}

export function getStudentProgress(classId: string, studentId: string) {
  return apiRequest<unknown>(`/teacher/classes/${classId}/students/${studentId}`);
}

export function createAssignment(
  classId: string,
  payload: Pick<Assignment, "target_type" | "target_id" | "due_date"> & { student_ids?: string[] }
) {
  return apiRequest<Assignment>(`/teacher/classes/${classId}/assignments`, {
    method: "POST",
    body: payload,
  });
}

export function getAssignments(classId: string) {
  return apiRequest<Assignment[]>(`/teacher/classes/${classId}/assignments`);
}
