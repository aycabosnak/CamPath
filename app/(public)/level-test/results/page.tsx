"use client";

/**
 * app/(public)/level-test/results/page.tsx
 *
 * Experience Blueprint 1.1 — Placement Test results / completion
 * state. Polish pass (production-readiness sprint, Phase 1): visual
 * hierarchy, Question Review scannability, and responsiveness were
 * refined. No new sections, no new data, no service changes — every
 * value rendered here already existed on PlacementResult.
 *
 * Manifesto Check: no celebratory animation on load, no "you won"
 * framing — this is a calm, factual report, matching the same tone
 * as Mock Exam results elsewhere in the app.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MasteryBarList } from "@/components/ui/MasteryBar";
import { ReadinessGauge } from "@/components/ui/ReadinessGauge";
import { StageBadge, CefrBadge, SkillBadge } from "@/components/ui/Badge";
import type { PlacementResult, QuestionReviewItem } from "@/services/placementTestService";
import type { Skill } from "@/components/types";
import { trackEvent } from "@/services/analyticsService";
import { STORAGE_KEYS } from "@/constants/storageKeys";

const RESULTS_STORAGE_KEY = STORAGE_KEYS.placementResult;

const SKILL_ORDER: Skill[] = [
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "useOfEnglish",
  "writing",
];

type ReviewFilter = "all" | "needsReview";

/** One labeled number — used for the Correct/Incorrect/Accuracy row.
 *  Kept local to this page: it's a layout detail, not a reusable
 *  design-system primitive. */
function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="card-eyebrow mb-1">{label}</p>
      <p className="text-data" style={{ fontSize: "20px" }}>{value}</p>
    </div>
  );
}

function QuestionReviewCard({ item }: { item: QuestionReviewItem }) {
  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${item.isCorrect ? "var(--color-pine)" : "var(--color-sage)"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-caption">Question {item.number}</span>
        <SkillBadge skill={item.skill} />
        <span className="text-small font-semibold" style={{ marginLeft: "auto" }}>
          {item.isCorrect ? "✅ Correct" : "🔍 Needs Review"}
        </span>
      </div>

      <p className="text-body mb-4">{item.questionText}</p>

      <div className="flex flex-col gap-1 mb-4">
        <p className="text-small">
          <span className="text-ink-soft">Your answer: </span>
          {item.userAnswerText}
        </p>
        <p className="text-small">
          <span className="text-ink-soft">Correct answer: </span>
          {item.correctAnswerText}
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--color-line)", paddingTop: "12px" }}>
        <p className="card-eyebrow mb-1">Why</p>
        <p className="text-small text-ink-soft">{item.explanation}</p>
      </div>
    </div>
  );
}

export default function LevelTestResultsPage() {
  const [result, setResult] = useState<PlacementResult | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(RESULTS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as PlacementResult) : null;
    setResult(parsed);
    if (parsed) {
      trackEvent("results_viewed", { stage: parsed.stage, cefr: parsed.cefr });
    }
  }, []);

  function handleReviewAnswers() {
    setReviewOpen(true);
    requestAnimationFrame(() => reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  // Loading state (brief — reading localStorage is synchronous, but
  // this keeps the pattern identical to a real fetch-based version).
  if (result === undefined) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading your results…</p>
      </main>
    );
  }

  // Empty state — someone landed here without taking the test.
  if (result === null) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-h2 mb-4">No results yet.</p>
        <p className="text-body text-ink-soft mb-8">
          Take the Placement Test to see your CamPath starting point.
        </p>
        <Link href="/level-test">
          <Button variant="primary">Start Placement Test</Button>
        </Link>
      </main>
    );
  }

  const masteryItems = SKILL_ORDER.map((skill) => ({
    skill,
    percentage: result.skill_breakdown[skill],
  }));

  // Defensive defaults: a result saved before the review/study-plan
  // fields existed won't have them — fall back gracefully.
  const questionReview = result.questionReview ?? [];
  const studyPlan = result.studyPlan ?? [];
  const correctCount = result.correctCount ?? 0;
  const totalCount = result.totalCount ?? questionReview.length;
  const accuracyPercentage = result.accuracyPercentage ?? 0;
  const completedOnTime = result.completedOnTime ?? true;
  const incorrectCount = totalCount - correctCount;

  const visibleReview =
    filter === "all" ? questionReview : questionReview.filter((q) => !q.isCorrect);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Your Result</p>
      <div className="flex items-center gap-3 mb-4">
        <StageBadge stage={result.stage} />
        <CefrBadge level={result.cefr} />
      </div>
      <h1 className="text-display-l mb-3">You're starting at {result.stage}.</h1>
      <p className="text-small text-ink-soft mb-10">
        {completedOnTime ? "Completed within the time limit." : "Completed after time expired."}
      </p>

      <Card className="mb-6">
        <p className="text-h3 mb-4">Mastery by Skill</p>
        <MasteryBarList items={masteryItems} />
      </Card>

      {result.readiness && (
        <Card className="mb-6">
          <p className="text-h3 mb-4">Exam Readiness</p>
          <ReadinessGauge status={result.readiness.status} examLabel={result.readiness.examLabel} />
        </Card>
      )}

      <Card className="mb-10">
        <p className="card-eyebrow mb-1">Recommended Starting Point</p>
        <p className="text-body">{result.recommended_unit_label}</p>
      </Card>

      {/* --- Question Review --- */}
      <div ref={reviewRef} />
      <Card className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-h3">Question Review</p>
          <Button variant="tertiary" size="sm" onClick={() => setReviewOpen((v) => !v)}>
            {reviewOpen ? "Hide" : "Show"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-8 mb-6">
          <StatCell label="Correct" value={`${correctCount} / ${totalCount}`} />
          <StatCell label="Incorrect" value={`${incorrectCount} / ${totalCount}`} />
          <StatCell label="Accuracy" value={`${accuracyPercentage}%`} />
        </div>

        {reviewOpen && (
          <>
            {incorrectCount > 0 && (
              <div className="flex gap-2 mb-4" role="group" aria-label="Filter questions">
                <Button
                  variant={filter === "all" ? "secondary" : "tertiary"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All ({totalCount})
                </Button>
                <Button
                  variant={filter === "needsReview" ? "secondary" : "tertiary"}
                  size="sm"
                  onClick={() => setFilter("needsReview")}
                >
                  Needs Review ({incorrectCount})
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {visibleReview.map((item) => (
                <QuestionReviewCard key={item.number} item={item} />
              ))}
            </div>
          </>
        )}
      </Card>

      {/* --- Recommended Study Plan --- */}
      {studyPlan.length > 0 && (
        <Card className="mb-10">
          <p className="text-h3 mb-4">Recommended Study Plan</p>
          <div className="flex flex-col gap-5">
            {studyPlan.map((group) => (
              <div key={group.skill}>
                <div className="mb-2">
                  <SkillBadge skill={group.skill} />
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "20px" }}>
                  {group.recommendations.map((rec) => (
                    <li key={rec} className="text-small">{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <Link href="/my-journey">
          <Button variant="primary" size="lg">Start My Journey</Button>
        </Link>
        <Button variant="secondary" size="lg" onClick={handleReviewAnswers}>
          Review Answers
        </Button>
        <Link href="/level-test">
          <Button variant="secondary" size="lg">Retake Placement Test</Button>
        </Link>
      </div>

      {!saved ? (
        <Button variant="tertiary" size="sm" onClick={() => setSaved(true)}>
          Save results / Create account
        </Button>
      ) : (
        <p className="text-small text-ink-soft">
          Account creation is coming soon — your results are kept on this device for now.
        </p>
      )}
    </main>
  );
}
