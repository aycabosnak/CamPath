/**
 * services/myJourneyService.ts
 *
 * Behind this file's single exported function, My Journey doesn't
 * know or care whether its data comes from localStorage (today) or
 * from GET /api/users/me/summary (Database & API Design doc, 4.4)
 * later. The page only ever calls `getMyJourneySummary()`.
 *
 * This version merges two sources: the Placement Test result
 * (baseline stage/CEFR/mastery) and services/progressService.ts
 * (what the learner has actually done since — completed lessons,
 * study time, practice-driven mastery changes). Every derived number
 * (progress %, completed units, readiness, recommended next step) is
 * computed here, once, so no page re-derives this logic itself.
 */
import { UNITS_PER_STAGE } from "@/lib/mock-data/myJourneyData";
import { UNIT_LESSONS } from "@/lib/mock-data/unitLessons";
import { STAGE_NAME_TO_SLUG } from "@/constants/cefr";
import { deriveReadinessStatus, type PlacementResult } from "@/services/placementTestService";
import { getProgressState, type ProgressState } from "@/services/progressService";
import type { StageName, CefrLevel, Skill, ReadinessStatus, StudyPathNodeState } from "@/components/types";
import type { StudyPathNodeData } from "@/components/study-path/StudyPath";

const RESULTS_STORAGE_KEY = "campath_level_test_result";

export interface MyJourneySummary {
  stage: StageName;
  cefr: CefrLevel;
  overallProgress: { percentage: number; unitLabel: string };
  studyTime: { hours: number; minutes: number; trendLabel?: string };
  studyConsistency: { daysActive: number; daysInPeriod: number };
  examReadiness: { status: ReadinessStatus; examLabel: string } | null;
  completedUnits: { completed: number; total: number };
  masteryBySkill: Array<{ skill: Skill; percentage: number }>;
  studyPathPreview: StudyPathNodeData[];
  /** `unitSlug` is null once every unit with real content is
   *  completed — callers must not link to a unit that doesn't exist. */
  recommendedNextStep: { label: string; description: string; unitSlug: string | null };
  weakestSkill: Skill;
  fromPlacementTest: { stage: StageName; cefr: CefrLevel } | null;
}

const SKILL_ORDER: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];

function readPlacementResult(): PlacementResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(RESULTS_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as PlacementResult) : null;
}

/**
 * Builds the Study Path preview AND figures out which unit (if any)
 * is the "recommended / current" one — in one pass, so the two
 * things can never disagree with each other.
 */
function buildStudyPathPreview(
  stage: StageName,
  progress: ProgressState
): { nodes: StudyPathNodeData[]; nextActionable: { unitSlug: string; title: string } | null } {
  const slug = STAGE_NAME_TO_SLUG[stage];
  const titles = UNITS_PER_STAGE[slug] ?? [];

  let nextActionable: { unitSlug: string; title: string } | null = null;

  const nodes = titles.map((genericTitle, i) => {
    const order = i + 1;
    const unitSlug = `unit-${order}`;
    const realLesson = UNIT_LESSONS[unitSlug];
    const isReal = Boolean(realLesson);
    const completed = progress.completedLessons.includes(unitSlug);

    let state: StudyPathNodeState;
    let subtitle: string;

    if (completed) {
      state = "completed";
      subtitle = "✓ Completed";
    } else if (isReal && !nextActionable) {
      // First not-yet-completed unit that actually has content —
      // this becomes BOTH this node's "recommended" state AND the
      // dashboard's Recommended Next Step, from the same check.
      state = "recommended";
      subtitle = "▶ Continue";
      nextActionable = { unitSlug, title: realLesson.title };
    } else {
      // Deliberately "Not Started", never "Locked" — nothing in
      // CamPath is technically locked (approved architecture
      // decision). A unit with no content yet is simply not
      // actionable, which is a content gap, not a permission gate.
      state = "notStarted";
      subtitle = "Not Started";
    }

    const displayTitle = isReal ? realLesson.title : genericTitle;
    return {
      id: unitSlug,
      order,
      state,
      title: `Unit ${order} · ${displayTitle}`,
      subtitle,
    };
  });

  return { nodes, nextActionable };
}

function findWeakestSkill(masteryBySkill: Array<{ skill: Skill; percentage: number }>): Skill {
  return masteryBySkill.reduce((weakest, current) =>
    current.percentage < weakest.percentage ? current : weakest
  ).skill;
}

/**
 * Returns `null` when there is nothing to show yet — the page renders
 * the approved empty state ("Your journey starts with a placement
 * test.") in that case, per the Experience Blueprint's My Journey
 * empty-state rule (Section 1.2).
 */
export async function getMyJourneySummary(): Promise<MyJourneySummary | null> {
  const placement = readPlacementResult();
  if (!placement) return null;

  const progress = getProgressState();

  // Practice-driven mastery overrides sit on top of the placement
  // baseline — completing a practice session changes what's shown
  // here without ever touching the original placement result.
  const masteryBySkill = SKILL_ORDER.map((skill) => ({
    skill,
    percentage: progress.masteryOverrides[skill] ?? placement.skill_breakdown[skill],
  }));

  const { nodes: studyPathPreview, nextActionable } = buildStudyPathPreview(placement.stage, progress);

  const totalUnits = studyPathPreview.length;
  const completedCount = studyPathPreview.filter((n) => n.state === "completed").length;
  const progressPercentage = totalUnits ? Math.round((completedCount / totalUnits) * 100) : 0;

  const overallAverageMastery =
    masteryBySkill.reduce((sum, m) => sum + m.percentage, 0) / masteryBySkill.length;

  const examReadiness = placement.readiness
    ? { status: deriveReadinessStatus(overallAverageMastery), examLabel: placement.readiness.examLabel }
    : null;

  return {
    stage: placement.stage,
    cefr: placement.cefr,
    overallProgress: {
      percentage: progressPercentage,
      unitLabel:
        completedCount > 0
          ? `${placement.stage} · ${completedCount}/${totalUnits} units`
          : `${placement.stage} · Getting started`,
    },
    studyTime: (() => {
      const total = progress.studyTimeMinutes;
      return { hours: Math.floor(total / 60), minutes: total % 60 };
    })(),
    studyConsistency: { daysActive: Math.min(progress.studyDates.length, 30), daysInPeriod: 30 },
    examReadiness,
    completedUnits: { completed: completedCount, total: totalUnits },
    masteryBySkill,
    studyPathPreview,
    recommendedNextStep: nextActionable
      ? {
          label: nextActionable.title,
          description:
            "Based on your progress, this is the best place to continue — nothing is locked, so you're free to explore the full path any time.",
          unitSlug: nextActionable.unitSlug,
        }
      : {
          label: "All available lessons completed",
          description: "You've completed every lesson available in this preview — more units are coming soon.",
          unitSlug: null,
        },
    weakestSkill: findWeakestSkill(masteryBySkill),
    fromPlacementTest: { stage: placement.stage, cefr: placement.cefr },
  };
}
