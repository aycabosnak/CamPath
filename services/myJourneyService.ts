/**
 * services/myJourneyService.ts
 *
 * Architecture unification (Production Readiness Audit follow-up):
 * this file previously only knew about the legacy Study Path
 * (unit-1/2/3, Stage-based). It treats the Level Curriculum
 * system (Tests-level-based: a1-elementary, a2-pre-intermediate, ...)
 * as the PRIMARY source for Overall Progress, Completed Learning
 * Items, and Recommended Next Step. Legacy `/learn/unit-*` completions
 * remain in progress state for compatibility and are not migrated
 * or displayed here.
 *
 * "Current level" is derived once, here, by walking forward from the
 * Placement Test's recommended level through TEST_LEVELS, past any
 * level whose Milestone already exists. This is the single piece of
 * logic that makes this file scale to A2 through C1 without further
 * changes: once a level's content exists and its Progress Check is
 * completed, this function automatically advances to the next one.
 */
import { TEST_LEVELS, getTestLevelBySlug, getTestLevelSlugForStage } from "@/constants/testLevels";
import { PLACEMENT_RESULT_STORAGE_KEY } from "@/constants/storageKeys";
import { deriveReadinessStatus, type PlacementResult } from "@/services/placementTestService";
import { getLevelProgress, type LevelProgressItem } from "@/services/curriculumService";
import { getProgressState, getMilestones, type MilestoneRecord } from "@/services/progressService";
import type { StageName, CefrLevel, Skill, ReadinessStatus } from "@/components/types";

export interface MyJourneySummary {
  stage: StageName;
  cefr: CefrLevel;
  overallProgress: { percentage: number; unitLabel: string };
  studyTime: { hours: number; minutes: number; trendLabel?: string };
  studyConsistency: { daysActive: number; daysInPeriod: number };
  examReadiness: {
    status: ReadinessStatus;
    examLabel: string;
    averageMastery: number;
    weakestSkill: Skill;
  } | null;
  /** Displayed as "Completed Learning Items" — current-level Level
   *  Curriculum items (lessons + tests + progress check), not a
   *  merge with Study Path's unrelated count. See the architecture
   *  unification note above for why these are kept separate. */
  completedUnits: { completed: number; total: number };
  masteryBySkill: Array<{ skill: Skill; percentage: number }>;
  recommendedNextStep: { label: string; description: string; href: string | null };
  weakestSkill: Skill;
  /** Tests-level slug My Journey currently treats as "in progress"
   *  — used by Weakest Skill Practice to prefer that level's questions. */
  currentLevelSlug: string;
  fromPlacementTest: { stage: StageName; cefr: CefrLevel } | null;
  /** Now flows through this service instead of being read directly
   *  by the page component (Production Readiness Audit, point 7). */
  milestones: MilestoneRecord[];
}

const SKILL_ORDER: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];
const SEQUENTIAL_LEVELS = TEST_LEVELS.filter((l) => l.slug !== "grammar-shorts");

function readPlacementResult(): PlacementResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PLACEMENT_RESULT_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as PlacementResult) : null;
}

/**
 * Walks forward from the Placement Test's recommended level through
 * consecutive completed levels (Milestone exists) until it finds one
 * that isn't fully done yet. This is what makes "If A1 Progress Check
 * is completed, recommend A2 start" work automatically, and keeps
 * working the same way once A2's own Progress Check exists too.
 */
function getCurrentLevelSlug(stage: StageName, milestones: MilestoneRecord[]): string {
  const completedSlugs = new Set(milestones.map((m) => m.id));
  const startSlug = getTestLevelSlugForStage(stage);
  let idx = SEQUENTIAL_LEVELS.findIndex((l) => l.slug === startSlug);
  if (idx === -1) idx = 0;
  while (idx < SEQUENTIAL_LEVELS.length - 1 && completedSlugs.has(SEQUENTIAL_LEVELS[idx].slug)) {
    idx += 1;
  }
  return SEQUENTIAL_LEVELS[idx].slug;
}

function describeNextItem(type: LevelProgressItem["type"]): string {
  switch (type) {
    case "lesson":
      return "Continue your current level — nothing is locked, so you're free to explore any time.";
    case "test":
      return "Put your lessons into practice with a mixed test.";
    case "progressCheck":
      return "An honest checkpoint on what you've learned — not a pass/fail gate.";
  }
}

function findWeakestSkill(masteryBySkill: Array<{ skill: Skill; percentage: number }>): Skill {
  return masteryBySkill.reduce((weakest, current) =>
    current.percentage < weakest.percentage ? current : weakest
  ).skill;
}

export async function getMyJourneySummary(): Promise<MyJourneySummary | null> {
  const placement = readPlacementResult();
  if (!placement) return null;

  const progress = getProgressState();
  const milestones = getMilestones();

  // Practice-driven AND Progress-Check-driven overrides both live in
  // the same masteryOverrides field — this file needs no special
  // case for either source, it just reads the merged result.
  const masteryBySkill = SKILL_ORDER.map((skill) => ({
    skill,
    percentage: progress.masteryOverrides[skill] ?? placement.skill_breakdown[skill],
  }));
  const overallAverageMastery =
    masteryBySkill.reduce((sum, m) => sum + m.percentage, 0) / masteryBySkill.length;
  const weakestSkill = findWeakestSkill(masteryBySkill);

  const examReadiness = placement.readiness
    ? {
        status: deriveReadinessStatus(overallAverageMastery),
        examLabel: placement.readiness.examLabel,
        averageMastery: Math.round(overallAverageMastery),
        weakestSkill,
      }
    : null;

  // --- Level Curriculum: the primary source for progress + next step ---
  const currentLevelSlug = getCurrentLevelSlug(placement.stage, milestones);
  const currentLevelMeta = getTestLevelBySlug(currentLevelSlug);
  const levelProgress = await getLevelProgress(currentLevelSlug);

  const progressPercentage = levelProgress.totalCount
    ? Math.round((levelProgress.completedCount / levelProgress.totalCount) * 100)
    : 0;

  const currentLevelLabel = currentLevelMeta?.title ?? currentLevelSlug;

  const overallProgress = {
    percentage: progressPercentage,
    unitLabel: levelProgress.totalCount
      ? `${currentLevelLabel} · ${levelProgress.completedCount}/${levelProgress.totalCount} items`
      : `${currentLevelLabel} · Coming soon`,
  };

  let recommendedNextStep: MyJourneySummary["recommendedNextStep"];
  if (levelProgress.nextItem) {
    recommendedNextStep = {
      label: levelProgress.nextItem.title,
      description: describeNextItem(levelProgress.nextItem.type),
      href: levelProgress.nextItem.href,
    };
  } else if (levelProgress.totalCount > 0) {
    // This level is fully done — recommend advancing to the next one.
    const idx = SEQUENTIAL_LEVELS.findIndex((l) => l.slug === currentLevelSlug);
    const next = SEQUENTIAL_LEVELS[idx + 1];
    recommendedNextStep = next
      ? {
          label: `Start ${next.title}`,
          description: `You've completed ${currentLevelLabel}. Ready for the next level whenever you are.`,
          href: `/tests/${next.slug}`,
        }
      : {
          label: "All available levels completed",
          description: "You've worked through every level currently available.",
          href: null,
        };
  } else {
    recommendedNextStep = {
      label: `${currentLevelLabel} is coming soon`,
      description: "This level's lessons haven't been published yet — check back soon.",
      href: `/tests/${currentLevelSlug}`,
    };
  }

  return {
    stage: placement.stage,
    cefr: placement.cefr,
    overallProgress,
    studyTime: (() => {
      const total = progress.studyTimeMinutes;
      return { hours: Math.floor(total / 60), minutes: total % 60 };
    })(),
    studyConsistency: { daysActive: Math.min(progress.studyDates.length, 30), daysInPeriod: 30 },
    examReadiness,
    completedUnits: { completed: levelProgress.completedCount, total: levelProgress.totalCount },
    masteryBySkill,
    recommendedNextStep,
    weakestSkill,
    currentLevelSlug,
    fromPlacementTest: { stage: placement.stage, cefr: placement.cefr },
    milestones,
  };
}
