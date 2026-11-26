/**
 * services/syncService.ts
 *
 * Keeps this device's localStorage progress and the learner's account
 * in step. localStorage stays the source the UI reads from (every
 * page keeps working offline and signed-out, unchanged); this service
 * just pushes the whole local state and writes back the merged result.
 *
 * Why "send everything, get everything back": the server's merge rules
 * are idempotent and order-independent (see backend
 * ProgressSyncService), so a full-state push can never lose or
 * double-count anything — no change log, no conflict UI needed.
 *
 * When it runs:
 * - right after sign-in / sign-up (authService)
 * - shortly after any local progress change (debounced)
 * - when the app loads or the tab regains focus (SyncAgent component)
 */
import { syncProgress, type PlacementPayload } from "@/lib/api-client/progress";
import { ApiError } from "@/lib/api-client";
import { readSession } from "@/lib/authSession";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getProgressState, replaceProgressState } from "@/services/progressService";
import type { PlacementResult } from "@/services/placementTestService";

export const PROGRESS_SYNCED_EVENT = "campath:progress-synced";

export type SyncOutcome =
  | { status: "synced"; syncedAt: string; changedLocally: boolean }
  | { status: "skipped" } // not signed in
  | { status: "failed"; message: string };

const DEBOUNCE_MS = 1500;
const LAST_SYNC_KEY = "campath_last_synced_at";

let inFlight: Promise<SyncOutcome> | null = null;
let queued = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function readPlacement(): PlacementPayload | null {
  const raw = window.localStorage.getItem(STORAGE_KEYS.placementResult);
  if (!raw) return null;
  try {
    const result = JSON.parse(raw) as PlacementResult;
    // Results saved before accounts existed have no timestamp: send the
    // oldest possible one so any timestamped result elsewhere wins.
    return { completedAt: result.completedAt ?? "1970-01-01T00:00:00.000Z", result };
  } catch {
    return null;
  }
}

async function runSync(): Promise<SyncOutcome> {
  if (!readSession()) return { status: "skipped" };

  const sent = getProgressState();
  const before = JSON.stringify(sent);
  const placementBefore = window.localStorage.getItem(STORAGE_KEYS.placementResult);

  try {
    const merged = await syncProgress({ progress: sent, placement: readPlacement() });

    // The learner did something while the request was in flight. Writing
    // the server's answer now would drop that change, so leave local
    // state alone and push again — the next round includes everything.
    if (JSON.stringify(getProgressState()) !== before) {
      queued = true;
      return { status: "synced", syncedAt: merged.syncedAt, changedLocally: false };
    }

    replaceProgressState(merged.progress);
    if (merged.placement) {
      window.localStorage.setItem(
        STORAGE_KEYS.placementResult,
        JSON.stringify({ ...merged.placement.result, completedAt: merged.placement.completedAt })
      );
    }
    window.localStorage.setItem(LAST_SYNC_KEY, merged.syncedAt);

    const changedLocally =
      JSON.stringify(getProgressState()) !== before ||
      window.localStorage.getItem(STORAGE_KEYS.placementResult) !== placementBefore;
    window.dispatchEvent(new CustomEvent(PROGRESS_SYNCED_EVENT, { detail: { changedLocally } }));
    return { status: "synced", syncedAt: merged.syncedAt, changedLocally };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "CamPath's server can't be reached right now.";
    return { status: "failed", message };
  }
}

/**
 * Syncs now. Concurrent calls share one request; a call that arrives
 * mid-flight queues exactly one follow-up so its changes aren't missed.
 */
export function syncNow(): Promise<SyncOutcome> {
  if (typeof window === "undefined") return Promise.resolve({ status: "skipped" });
  if (inFlight) {
    queued = true;
    return inFlight;
  }
  inFlight = runSync().finally(() => {
    inFlight = null;
    if (queued) {
      queued = false;
      void syncNow();
    }
  });
  return inFlight;
}

/** Debounced sync for bursts of local changes (e.g. finishing a lesson). */
export function scheduleSync(): void {
  if (typeof window === "undefined" || !readSession()) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void syncNow();
  }, DEBOUNCE_MS);
}

export function getLastSyncedAt(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_SYNC_KEY);
}
