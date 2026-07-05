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
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMyJourneySummary, type MyJourneySummary } from "@/services/myJourneyService";
import { MyJourneyMetricCard, type MyJourneyMetric } from "@/components/dashboard/MyJourneyMetricCard";
import { MasteryBarList } from "@/components/ui/MasteryBar";
import { StudyPath } from "@/components/study-path/StudyPath";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StageBadge, CefrBadge } from "@/components/ui/Badge";
import { trackEvent } from "@/services/analyticsService";

export default function MyJourneyPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<MyJourneySummary | null | undefined>(undefined);
  const studyPathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMyJourneySummary().then((data) => {
      setSummary(data);
      trackEvent("my_journey_viewed", { hasPlacementResult: Boolean(data) });
    });
  }, []);

  function scrollToStudyPath() {
    studyPathRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToUnit(nodeId: string) {
    router.push(`/learn/${nodeId}`);
  }

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
    { type: "currentStage", stage: summary.stage, cefr: summary.cefr },
    {
      type: "overallProgress",
      percentage: summary.overallProgress.percentage,
      unitLabel: summary.overallProgress.unitLabel,
    },
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

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">My Journey</p>
      <div className="flex items-center gap-3 mb-8">
        <StageBadge stage={summary.stage} />
        <CefrBadge level={summary.cefr} />
      </div>

      {/* --- Metric grid --- */}
      <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {metrics.map((metric, i) => (
          <MyJourneyMetricCard key={i} metric={metric} />
        ))}
      </div>

      {/* --- Mastery by skill --- */}
      <Card className="mb-6">
        <p className="text-h3 mb-4">Mastery by Skill</p>
        <MasteryBarList items={summary.masteryBySkill} />
      </Card>

      {/* --- From your Placement Test (Experience Blueprint requirement: show recent result if available) --- */}
      {summary.fromPlacementTest && (
        <Card className="mb-6">
          <p className="card-eyebrow mb-2">From Your Placement Test</p>
          <p className="text-small text-ink-soft mb-3">
            Your Current Stage above reflects your Placement Test result.
          </p>
          <Link href="/level-test" className="btn btn-tertiary btn-sm p-0">
            Retake Placement Test →
          </Link>
        </Card>
      )}

      {/* --- Recommended next step --- */}
      <Card className="mb-6">
        <p className="text-h3 mb-2">Recommended Next Step</p>
        <p className="card-eyebrow mb-1">First Recommended Lesson</p>
        <p className="text-body mb-4">{summary.recommendedNextStep.label}</p>
        <p className="text-body text-ink-soft mb-6">{summary.recommendedNextStep.description}</p>
        <div className="flex flex-wrap gap-3">
          {summary.recommendedNextStep.unitSlug ? (
            <Link href={`/learn/${summary.recommendedNextStep.unitSlug}`}>
              <Button variant="primary">Continue Learning</Button>
            </Link>
          ) : (
            <Button variant="primary" disabled>
              All Lessons Completed
            </Button>
          )}
          <Button variant="secondary" onClick={scrollToStudyPath}>
            View Study Path
          </Button>
          <Link href="/practice/weakest-skill">
            <Button variant="secondary">Practice Weakest Skill</Button>
          </Link>
        </div>
      </Card>

      {/* --- Compact Study Path preview --- */}
      <div ref={studyPathRef}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-h3">Study Path</p>
          </div>
          <StudyPath
            nodes={summary.studyPathPreview.slice(0, 3)}
            mode="guided"
            onSelectNode={goToUnit}
          />
        </Card>
      </div>
    </main>
  );
}
