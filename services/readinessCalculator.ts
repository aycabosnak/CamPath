/**
 * services/readinessCalculator.ts
 *
 * Pure function layer — deliberately separate from lib/api-client.
 * Once the real backend computes `overall_result` server-side (see
 * Database & API Design doc, MockExamSession), this file's job
 * shrinks to formatting/labeling only. Until then, it's a clearly
 * marked stand-in so no page imports guesswork logic disguised as
 * an API response.
 */
import type { ReadinessResult } from "@/types/entities";
import type { ReadinessStatus } from "@/components/types";

const RESULT_TO_STATUS: Record<ReadinessResult, ReadinessStatus> = {
  not_ready: "notReady",
  approaching: "approaching",
  ready: "ready",
};

export function toReadinessStatus(result: ReadinessResult): ReadinessStatus {
  return RESULT_TO_STATUS[result];
}
