/**
 * lib/api-client/progress.ts
 *
 * Typed calls to /api/progress (backend ProgressController). The body
 * is the frontend's own ProgressState, unchanged — the API mirrors it
 * field-for-field so no mapping layer is needed on either side.
 */
import { apiRequest } from "./index";
import type { ProgressState } from "@/services/progressService";
import type { PlacementResult } from "@/services/placementTestService";

export interface PlacementPayload {
  completedAt: string;
  result: PlacementResult;
}

export interface SyncPayload {
  progress: ProgressState;
  placement: PlacementPayload | null;
}

export interface SyncResult extends SyncPayload {
  syncedAt: string;
}

export function getProgress() {
  return apiRequest<SyncResult>("/progress");
}

export function syncProgress(payload: SyncPayload) {
  return apiRequest<SyncResult>("/progress/sync", { method: "PUT", body: payload });
}
