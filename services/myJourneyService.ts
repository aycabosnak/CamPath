/**
 * services/myJourneyService.ts
 *
 * Architecture unification (Production Readiness Audit follow-up):
 * this file previously only knew about the legacy Study Path
 * (unit-1/2/3, Stage-based). It now treats the Level Curriculum
 * system (Tests-level-based: a1-elementary, a2-pre-intermediate, ...)
 * as the PRIMARY source for Overall Progress, Completed Learning
 * Items, and Recommended Next Step. Study Path is still computed and
 * still returned (studyPathPreview) — it is not removed — but it no
 * longer drives the dashboard's headline numbers.
 *
 * "Current level" is derived once, here, by walking forward from the
 * Placement Test's recommended level through TEST_LEVELS, past any
 * level whose Milestone already exists. This is the single piece of
 * logic that makes this file scale to A2 through C1 without further
 * changes: once a level's content exists and its Progress Check is
 * completed, this function automatically advances to the next one.
 */
import { UNITS_PER_STAGE } from "@/lib/mock-data/myJourneyData";
import { UNIT_LESSONS } from "@/lib/mock-data/unitLessons";
import { STAGE_NAME_TO_SLUG } from "@/constants/cefr";
import { TEST_LEVELS, getTestLevelBySlug, getTestLevelSlugForStage } from "@/constants/testLevels";
import { deriveReadinessStatus, type PlacementResult } from "@/services/placementTestService";
import { getLevelProgress, type LevelProgressItem } from "@/services/curriculumService";
import { getProgressState, getMilestones, type ProgressState, type MilestoneRecord } from "@/services/progressService";
import type { StageName, CefrLevel, Skill, ReadinessStatus, StudyPathNodeState } from "@/components/types";
import type { StudyPathNodeData } from "@/components/study-path/StudyPath";
import { STORAGE_KEYS } from "@/constants/storageKeys";

const RESULTS_STORAGE_KEY = STORAGE_KEYS.placementResult;

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
  /** Legacy Study Path preview — still computed, still shown in its
   *  own labeled section, no longer the source of the numbers above. */
  studyPathPreview: StudyPathNodeData[];
  recommendedNextStep: { label: string; description: string; href: string | null };
  weakestSkill: Skill;
  fromPlacementTest: { stage: StageName; cefr: CefrLevel } | null;
  /** Now flows through this service instead of being read directly
   *  by the page component (Production Readiness Audit, point 7). */
  milestones: MilestoneRecord[];
}

const SKILL_ORDER: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];
const SEQUENTIAL_LEVELS = TEST_LEVELS.filter((l) => l.slug !== "grammar-shorts");

function readPlacementResult(): PlacementResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(RESULTS_STORAGE_KEY);
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

/**
 * Legacy Study Path preview — unchanged logic, kept exactly as it
 * was before the unification. Still computed and returned so the
 * existing "Study Path" section in My Journey keeps working.
 */
function buildStudyPathPreview(
  stage: StageName,
  progress: ProgressState
): StudyPathNodeData[] {
  const slug = STAGE_NAME_TO_SLUG[stage];
  const titles = UNITS_PER_STAGE[slug] ?? [];
  let recommendedAssigned = false;

  return titles.map((genericTitle, i) => {
    const order = i + 1;
    const unitSlug = `unit-${order}`;
    const realLesson = UNIT_LESSONS[unitSlug];
    const isReal = Boolean(realLesson);
    const completed = Boolean(progress.completions[unitSlug]);

    let state: StudyPathNodeState;
    let subtitle: string;
    if (completed) {
      state = "completed";
      subtitle = "✓ Completed";
    } else if (isReal && !recommendedAssigned) {
      state = "recommended";
      subtitle = "▶ Continue";
      recommendedAssigned = true;
    } else {
      state = "notStarted";
      subtitle = "Not Started";
    }

    const displayTitle = isReal ? realLesson.title : genericTitle;
    return { id: unitSlug, order, state, title: `Unit ${order} · ${displayTitle}`, subtitle };
  });
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

  const studyPathPreview = buildStudyPathPreview(placement.stage, progress);

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
    studyPathPreview,
    recommendedNextStep,
    weakestSkill,
    fromPlacementTest: { stage: placement.stage, cefr: placement.cefr },
    milestones,
  };
}
