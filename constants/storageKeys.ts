/**
 * constants/storageKeys.ts
 *
 * Every localStorage key the app uses, in one place. Resolves the
 * long-standing "RESULTS_STORAGE_KEY duplicated in several files" debt
 * (docs/TechnicalDecisions.md) — and the sync layer needs to read the
 * same keys, which made a single source of truth necessary.
 */
export const STORAGE_KEYS = {
  placementResult: "campath_level_test_result",
  placementSession: "campath_level_test_session",
  progress: "campath_progress_state",
  analytics: "campath_analytics_events",
  authSession: "campath_auth_session",
} as const;
