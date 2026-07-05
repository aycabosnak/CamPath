import React from "react";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { ReadinessGauge } from "../ui/ReadinessGauge";
import { SkillBadge } from "../ui/Badge";
import type { ReadinessStatus, StageName, CefrLevel, Skill } from "../types";

/**
 * MyJourneyMetricCard
 *
 * Product Reasoning: this is a discriminated union rather than one
 * generic "stat card" — each metric on My Journey (Design System
 * Section 2/9) has a genuinely different shape of data (a stage name
 * vs. a percentage vs. a readiness status), and forcing them into one
 * generic `{ label, value }` shape would hide that difference from
 * whoever calls this component, inviting mismatched data later.
 *
 * Manifesto Check: every variant renders real, specific data (a
 * stage, a duration, a day count, a mastery percentage) — none of
 * them render an abstract "score" or "points" number.
 */
export type MyJourneyMetric =
  | { type: "currentStage"; stage: StageName; cefr: CefrLevel }
  | { type: "overallProgress"; percentage: number; unitLabel: string }
  | { type: "studyTime"; hours: number; minutes: number; trendLabel?: string }
  | { type: "studyConsistency"; daysActive: number; daysInPeriod: number }
  | { type: "examReadiness"; status: ReadinessStatus; examLabel: string; averageMastery: number; weakestSkill: Skill }
  | { type: "completedUnits"; completed: number; total: number };

export interface MyJourneyMetricCardProps {
  metric: MyJourneyMetric;
}

export function MyJourneyMetricCard({ metric }: MyJourneyMetricCardProps) {
  switch (metric.type) {
    case "currentStage":
      return (
        <Card>
          <p className="card-eyebrow">Current Stage</p>
          <p className="text-h2">
            {metric.stage} <span className="text-ink-soft">· {metric.cefr}</span>
          </p>
        </Card>
      );

    case "overallProgress":
      return (
        <Card>
          <p className="card-eyebrow">Overall Progress</p>
          <ProgressBar
            value={metric.percentage}
            label={metric.unitLabel}
            showValue
          />
        </Card>
      );

    case "studyTime":
      return (
        <Card>
          <p className="card-eyebrow">Study Time This Week</p>
          <p className="card-value">
            {metric.hours}h {metric.minutes}m
          </p>
          {metric.trendLabel && <p className="card-trend">{metric.trendLabel}</p>}
        </Card>
      );

    case "studyConsistency":
      return (
        <Card>
          <p className="card-eyebrow">Study Consistency</p>
          <p className="card-value">
            {metric.daysActive} / {metric.daysInPeriod} days
          </p>
        </Card>
      );

    case "examReadiness":
      return (
        <Card>
          <p className="card-eyebrow mb-2">Exam Readiness</p>
          <ReadinessGauge status={metric.status} examLabel={metric.examLabel} />
          <p className="text-small text-ink-soft mt-3">
            Based on {metric.averageMastery}% average mastery —{" "}
            <SkillBadge skill={metric.weakestSkill} /> needs the most attention.
          </p>
        </Card>
      );

    case "completedUnits":
      return (
        <Card>
          <p className="card-eyebrow">Completed Units</p>
          <p className="card-value">
            {metric.completed} / {metric.total}
          </p>
        </Card>
      );
  }
}
