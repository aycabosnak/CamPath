/**
 * services/testsService.ts
 *
 * Thin accessor over lib/mock-data/tests.ts + constants/testLevels.ts,
 * matching the same async-wrapper pattern used by every other service
 * in this app. The Placement Test connection is read-only: this file
 * reads the same localStorage key My Journey already reads, and never
 * writes to it or touches placementTestService.ts.
 */
import { PLACEMENT_RESULT_STORAGE_KEY } from "@/constants/storageKeys";
import { TEST_LEVELS, getTestLevelBySlug, getTestLevelSlugForStage, type TestLevelMeta } from "@/constants/testLevels";
import { getTestsForLevel, getTestContent as getTestContentData, type TestSummary, type TestContent } from "@/lib/mock-data/tests";
import type { PlacementResult } from "@/services/placementTestService";

export interface TestLevelWithCount extends TestLevelMeta {
  availableCount: number;
  totalCount: number;
  isRecommended: boolean;
}

function readPlacementResult(): PlacementResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PLACEMENT_RESULT_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as PlacementResult) : null;
}

/** Null when no Placement Test has been taken yet — callers should
 *  simply not highlight any level in that case, not show an error. */
export function getRecommendedLevelSlug(): string | null {
  const placement = readPlacementResult();
  return placement ? getTestLevelSlugForStage(placement.stage) : null;
}

export async function getTestLevels(): Promise<TestLevelWithCount[]> {
  const recommendedSlug = getRecommendedLevelSlug();
  return TEST_LEVELS.map((level) => {
    const tests = getTestsForLevel(level.slug);
    return {
      ...level,
      availableCount: tests.filter((t) => t.status === "available").length,
      totalCount: tests.length,
      isRecommended: level.slug === recommendedSlug,
    };
  });
}

export async function getTestLevelDetail(
  slug: string
): Promise<{ meta: TestLevelMeta; tests: TestSummary[] } | null> {
  const meta = getTestLevelBySlug(slug);
  if (!meta) return null;
  return { meta, tests: getTestsForLevel(slug) };
}

export async function getTest(levelSlug: string, testId: string): Promise<TestContent | null> {
  return getTestContentData(levelSlug, testId);
}
