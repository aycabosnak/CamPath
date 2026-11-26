"use client";

/**
 * components/auth/SyncAgent.tsx
 *
 * Invisible, mounted once in the root layout. Wires browser events to
 * services/syncService: sync on load, on tab focus, and (debounced)
 * after any local progress change. Does nothing while signed out.
 */
import { useEffect } from "react";
import { PROGRESS_CHANGED_EVENT } from "@/services/progressService";
import { scheduleSync, syncNow } from "@/services/syncService";
import { readSession } from "@/lib/authSession";

const FOCUS_SYNC_MIN_INTERVAL_MS = 60_000;

export function SyncAgent() {
  useEffect(() => {
    let lastFocusSync = 0;
    const syncIfSignedIn = () => {
      if (!readSession()) return;
      lastFocusSync = Date.now();
      void syncNow();
    };
    const onFocus = () => {
      if (Date.now() - lastFocusSync > FOCUS_SYNC_MIN_INTERVAL_MS) syncIfSignedIn();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") onFocus();
    };

    syncIfSignedIn();
    window.addEventListener(PROGRESS_CHANGED_EVENT, scheduleSync);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener(PROGRESS_CHANGED_EVENT, scheduleSync);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
