"use client";

/**
 * app/(public)/level-test/results/page.tsx
 *
 * Experience Blueprint 1.1 — Placement Test results / completion
 * state. Reads the mock result from localStorage for now (see the
 * comment in /level-test/take/page.tsx's finishTest function for
 * what replaces this once GET /api/level-test/:sessionId/results
 * exists).
 *
 * Manifesto Check: no celebratory animation on load, no "you won"
 * framing — this is a calm, factual report, matching the same tone
 * as Mock Exam results elsewhere in the app.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MasteryBarList } from "@/components/ui/MasteryBar";
import { ReadinessGauge } from "@/components/ui/ReadinessGauge";
import { StageBadge, CefrBadge } from "@/components/ui/Badge";
import type { PlacementResult } from "@/services/placementTestService";
import type { Skill } from "@/components/types";

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

  useEffect(() => {
    const raw = localStorage.getItem(RESULTS_STORAGE_KEY);
    setResult(raw ? (JSON.parse(raw) as PlacementResult) : null);
  }, []);

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

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
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
          <p className="text-h3 mb-4">Cambridge Readiness</p>
          <ReadinessGauge status={result.readiness.status} examLabel={result.readiness.examLabel} />
        </Card>
      )}

      <Card className="mb-10">
        <p className="card-eyebrow mb-1">Recommended Starting Point</p>
        <p className="text-body">{result.recommended_unit_label}</p>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/my-journey">
          <Button variant="primary" size="lg">
            Start My Journey
          </Button>
        </Link>

        {!saved ? (
          <Button variant="secondary" size="lg" onClick={() => setSaved(true)}>
            Save results / Create account
          </Button>
        ) : (
          <p className="text-small text-ink-soft self-center">
            Account creation is coming soon — your results are kept on
            this device for now.
          </p>
        )}
      </div>
    </main>
  );
}
