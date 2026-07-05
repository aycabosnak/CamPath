/**
 * services/myJourneyService.ts
 *
 * Behind this file's single exported function, My Journey doesn't
 * know or care whether its data comes from localStorage (today) or
 * from GET /api/users/me/summary (Database & API Design doc, 4.4)
 * later. The page only ever calls `getMyJourneySummary()`.
 *
 * Current behavior: this app only has one implemented entry point
 * so far (the Placement Test), so a summary only exists once a
 * placement result has been saved. Once Learn/Practice/Mock Exam are
 * implemented, this function's job grows to merge real UserProgress
 * data with the placement baseline — the return shape below is
 * already designed for that (see `MyJourneySummary`), so that future
 * change won't require touching the page.
 */
import { UNITS_PER_STAGE } from "@/lib/mock-data/myJourneyData";
import { STAGE_NAME_TO_SLUG } from "@/constants/cefr";
import type { PlacementResult } from "@/services/placementTestService";
import type { StageName, CefrLevel, Skill, ReadinessStatus, StudyPathNodeState } from "@/components/types";
import type { StudyPathNodeData } from "@/components/study-path/StudyPath";

const RESULTS_STORAGE_KEY = "campath_level_test_result";

export interface MyJourneySummary {
  stage: StageName;
  cefr: CefrLevel;
  overallProgress: { percentage: number; unitLabel: string };
  studyTime: { hours: number; minutes: number; trendLabel?: string };
  studyConsistency: { daysActive: number; daysInPeriod: number };
  cambridgeReadiness: { status: ReadinessStatus; examLabel: string } | null;
  completedUnits: { completed: number; total: number };
  masteryBySkill: Array<{ skill: Skill; percentage: number }>;
  studyPathPreview: StudyPathNodeData[];
  recommendedNextStep: { label: string; description: string };
  weakestSkill: Skill;
  fromPlacementTest: { stage: StageName; cefr: CefrLevel } | null;
}

const SKILL_ORDER: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];

function readPlacementResult(): PlacementResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(RESULTS_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as PlacementResult) : null;
}

function buildStudyPathPreview(stage: StageName): StudyPathNodeData[] {
  const slug = STAGE_NAME_TO_SLUG[stage];
  const titles = UNITS_PER_STAGE[slug] ?? [];

  return titles.map((title, i) => {
    const state: StudyPathNodeState = i === 0 ? "recommended" : "notStarted";
    return {
      id: `${slug}_unit_${i + 1}`,
      order: i + 1,
      state,
      title: `Unit ${i + 1} · ${title}`,
      subtitle: i === 0 ? "Recommended next" : "Not started · available anytime",
    };
  });
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

  const masteryBySkill = SKILL_ORDER.map((skill) => ({
    skill,
    percentage: placement.skill_breakdown[skill],
  }));

  const studyPathPreview = buildStudyPathPreview(placement.stage);
  const firstUnit = studyPathPreview[0];

  return {
    stage: placement.stage,
    cefr: placement.cefr,
    overallProgress: {
      percentage: 0,
      unitLabel: `${placement.stage} · Getting started`,
    },
    studyTime: { hours: 0, minutes: 0 },
    studyConsistency: { daysActive: 0, daysInPeriod: 30 },
    cambridgeReadiness: placement.readiness,
    completedUnits: { completed: 0, total: studyPathPreview.length },
    masteryBySkill,
    studyPathPreview,
    recommendedNextStep: {
      label: firstUnit ? firstUnit.title : placement.recommended_unit_label,
      description:
        "Based on your Placement Test, this is the best place to begin — nothing is locked, so you're free to explore the full path any time.",
    },
    weakestSkill: findWeakestSkill(masteryBySkill),
    fromPlacementTest: { stage: placement.stage, cefr: placement.cefr },
  };
}
