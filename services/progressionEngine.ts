/**
 * services/progressionEngine.ts
 *
 * Placeholder for "what's next" logic (IA Blueprint Layer 2 —
 * Progression Engine). Real implementation will likely move
 * server-side once the backend exists (see recommended_next_unit in
 * the Mock Exam results endpoint) — this stub exists so pages have a
 * stable import today instead of inlining ad-hoc logic that would
 * need to be found and removed later.
 */
import type { UserProgress, Unit } from "@/types/entities";

export function getNextRecommendedUnit(
  units: Unit[],
  progress: UserProgress[]
): Unit | null {
  // TODO: replace with real logic once UserProgress/Unit data is live.
  return units.find((u) => !progress.some((p) => p.lesson_id === u.id)) ?? null;
}
