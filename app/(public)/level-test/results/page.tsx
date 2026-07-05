"use client";

/**
 * app/(public)/level-test/results/page.tsx
 *
 * Experience Blueprint 1.1 — Placement Test results / completion
 * state. Extended per request to add Question Review, score summary,
 * and a Recommended Study Plan — everything else in the app is
 * untouched; this file and services/placementTestService.ts (which
 * now also computes the review/study-plan data) are the only changes.
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
import type { PlacementResult } from "@/services/placementTestService";
import type { Skill } from "@/components/types";
import { trackEvent } from "@/services/analyticsService";

const RESULTS_STORAGE_KEY = "campath_level_test_result";

const SKILL_ORDER: Skill[] = [
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "useOfEnglish",
  "writing",
];

export default function LevelTestResultsPage() {
  const [result, setResult] = useState<PlacementResult | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
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
    // Scroll happens after the section renders open.
    requestAnimationFrame(() => reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  // Loading state (brief — reading localStorage is synchronous, but
  // this keeps the pattern identical to a real fetch-based version).
  if (result === undefined) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading your results…</p>
      </main>
    );
  }

  // Empty state — someone landed here without taking the test.
  if (result === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
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

  // Defensive defaults: a result saved in localStorage before this
  // sprint's schema change (questionReview/studyPlan/counts) won't
  // have these fields. Rather than crash, fall back to empty state —
  // the user can retake the test to get the full review.
  const questionReview = result.questionReview ?? [];
  const studyPlan = result.studyPlan ?? [];
  const correctCount = result.correctCount ?? 0;
  const totalCount = result.totalCount ?? questionReview.length;
  const accuracyPercentage = result.accuracyPercentage ?? 0;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Your Result</p>
      <div className="flex items-center gap-3 mb-6">
        <StageBadge stage={result.stage} />
        <CefrBadge level={result.cefr} />
      </div>

      <h1 className="text-display-l mb-8">
        You're starting at {result.stage}.
      </h1>

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
        <div className="flex items-center justify-between mb-1">
          <p className="text-h3">Question Review</p>
          <Button variant="tertiary" size="sm" onClick={() => setReviewOpen((v) => !v)}>
            {reviewOpen ? "Hide" : "Show"}
          </Button>
        </div>
        <p className="text-small text-ink-soft mb-6">
          Correct Answers: <span className="text-data">{correctCount} / {totalCount}</span>
          {"  ·  "}
          Incorrect Answers: <span className="text-data">{totalCount - correctCount} / {totalCount}</span>
          {"  ·  "}
          Accuracy: <span className="text-data">{accuracyPercentage}%</span>
        </p>

        {reviewOpen && (
          <div className="flex flex-col gap-4">
            {questionReview.map((item) => (
              <div key={item.number} className="card">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-caption">Question {item.number}</span>
                  <SkillBadge skill={item.skill} />
                  <span className="text-small font-semibold" style={{ marginLeft: "auto" }}>
                    {item.isCorrect ? "✅ Correct" : "🔍 Needs Review"}
                  </span>
                </div>
                <p className="text-body mb-3">{item.questionText}</p>
                <p className="text-small mb-1">
                  <span className="text-ink-soft">Your answer: </span>
                  {item.userAnswerText}
                </p>
                <p className="text-small mb-3">
                  <span className="text-ink-soft">Correct answer: </span>
                  {item.correctAnswerText}
                </p>
                <p className="text-small text-ink-soft">{item.explanation}</p>
              </div>
            ))}
          </div>
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
          <Button variant="primary" size="lg">
            Start My Journey
          </Button>
        </Link>
        <Button variant="secondary" size="lg" onClick={handleReviewAnswers}>
          Review Answers
        </Button>
        <Link href="/level-test">
          <Button variant="secondary" size="lg">
            Retake Placement Test
          </Button>
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
