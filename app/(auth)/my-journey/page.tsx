"use client";

/**
 * app/(auth)/my-journey/page.tsx
 *
 * Experience Blueprint 1.2 — My Journey dashboard.
 *
 * Data comes exclusively through services/myJourneyService.ts — this
 * file has no hardcoded numbers, so swapping the service's internals
 * to call GET /api/users/me/summary later requires no change here.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyJourneySummary, type MyJourneySummary } from "@/services/myJourneyService";
import { MyJourneyMetricCard, type MyJourneyMetric } from "@/components/dashboard/MyJourneyMetricCard";
import { MasteryBarList } from "@/components/ui/MasteryBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StageBadge, CefrBadge } from "@/components/ui/Badge";
import { getTestLevelBySlug } from "@/constants/testLevels";
import { trackEvent } from "@/services/analyticsService";
import { formatDate } from "@/lib/formatDate";

export default function MyJourneyPage() {
  const [summary, setSummary] = useState<MyJourneySummary | null | undefined>(undefined);

  useEffect(() => {
    getMyJourneySummary().then((data) => {
      setSummary(data);
      trackEvent("my_journey_viewed", { hasPlacementResult: Boolean(data) });
    });
  }, []);

  if (summary === undefined) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading your journey…</p>
      </main>
    );
  }

  // Empty state — approved wording from the Experience Blueprint (1.2).
  if (summary === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-h1 mb-4">Your journey starts with a placement test.</p>
        <p className="text-body text-ink-soft mb-8">
          Take a short assessment across six skills to get your CamPath
          starting point.
        </p>
        <Link href="/level-test">
          <Button variant="primary" size="lg">
            Start Placement Test
          </Button>
        </Link>
      </main>
    );
  }

  const metrics: MyJourneyMetric[] = [
    { type: "studyTime", hours: summary.studyTime.hours, minutes: summary.studyTime.minutes, trendLabel: summary.studyTime.trendLabel },
    { type: "studyConsistency", daysActive: summary.studyConsistency.daysActive, daysInPeriod: summary.studyConsistency.daysInPeriod },
    { type: "completedUnits", completed: summary.completedUnits.completed, total: summary.completedUnits.total },
  ];
  if (summary.examReadiness) {
    metrics.push({
      type: "examReadiness",
      status: summary.examReadiness.status,
      examLabel: summary.examReadiness.examLabel,
      averageMastery: summary.examReadiness.averageMastery,
      weakestSkill: summary.examReadiness.weakestSkill,
    });
  }
  const currentLevel = getTestLevelBySlug(summary.currentLevelSlug);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">My Journey</p>
      <h1 className="text-display-l mb-3">Your learning journey.</h1>
      <p className="text-body-l text-ink-soft mb-5">
        Your current level, next action, progress, and skill mastery in one place.
      </p>
      <div className="flex items-center gap-3 mb-10">
        <StageBadge stage={summary.stage} />
        <CefrBadge level={summary.cefr} />
      </div>

      <Card className="mb-6 level-recommendation">
        <p className="card-eyebrow mb-2">Recommended next step</p>
        <p className="text-h2 mb-2">{summary.recommendedNextStep.label}</p>
        <p className="text-body text-ink-soft mb-6">{summary.recommendedNextStep.description}</p>
        <div className="flex flex-wrap gap-3">
          {summary.recommendedNextStep.href ? (
            <Link href={summary.recommendedNextStep.href}>
              <Button variant="primary">Continue</Button>
            </Link>
          ) : (
            <Button variant="primary" disabled>
              All Levels Completed
            </Button>
          )}
          <Link href="/practice">
            <Button variant="secondary">Choose practice</Button>
          </Link>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-5 mb-5">
          <div>
            <p className="card-eyebrow mb-2">Current level</p>
            <p className="text-h2 mb-1">{currentLevel?.title ?? summary.currentLevelSlug}</p>
            <p className="text-small text-ink-soft">{summary.overallProgress.unitLabel}</p>
          </div>
          <Link href={`/tests/${summary.currentLevelSlug}`}>
            <Button variant="secondary">Open level</Button>
          </Link>
        </div>
        <ProgressBar value={summary.overallProgress.percentage} label="Level completion" />
      </Card>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="card-eyebrow mb-1">Strengths and focus</p>
            <p className="text-h3">Mastery by skill</p>
          </div>
          <Link href="/practice/weakest-skill">
            <Button variant="tertiary">Practice weakest skill →</Button>
          </Link>
        </div>
        <MasteryBarList items={summary.masteryBySkill} />
      </Card>

      <div className="grid gap-4 mb-6 journey-support-grid">
        {metrics.map((metric, i) => (
          <MyJourneyMetricCard key={i} metric={metric} />
        ))}
      </div>

      {summary.fromPlacementTest && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="card-eyebrow mb-2">Placement baseline</p>
              <p className="text-small text-ink-soft">
                Your starting level and initial mastery came from the Placement Test.
              </p>
            </div>
            <Link href="/level-test">
              <Button variant="tertiary">Review or retake →</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* --- Milestones — now flows through myJourneyService instead of
           being read directly from progressService in the page
           component (Production Readiness Audit, point 7). Fires only
           from a completed Progress/Bridge Check. Calm, factual list —
           no badge graphics, no celebration. --- */}
      {summary.milestones.length > 0 && (
        <Card className="mt-6">
          <p className="text-h3 mb-4">Milestones</p>
          <div className="flex flex-col gap-3">
            {summary.milestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <p className={m.isBridge ? "text-small text-ink-soft" : "text-body"}>{m.label}</p>
                <p className="text-caption normal-case text-ink-soft">
                  {formatDate(m.achievedAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
}
