/** lib/api-client/learn.ts — Content Graph reads. See API doc 4.2. */
import { apiRequest } from "./index";
import type { Skill, Level, Unit, Lesson } from "@/types/entities";

export function getSkills() {
  return apiRequest<Skill[]>("/skills", { authenticated: false });
}

export function getLevels() {
  return apiRequest<Level[]>("/levels", { authenticated: false });
}

export function getUnits(params: { skill?: string; level?: string }) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return apiRequest<Unit[]>(`/units?${qs}`, { authenticated: false });
}

export function getLesson(id: string) {
  return apiRequest<Lesson>(`/lessons/${id}`, { authenticated: false });
}
