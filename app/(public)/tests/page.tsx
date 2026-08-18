"use client";

/** Assessment discovery. Teaching lives in Learn; this page describes
 * Mixed Tests and Progress Checks without presenting lessons as tests. */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getLearningLevels,
  type LearningLevelOverview,
} from "@/services/learningDiscoveryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TestsPage() {
  const [levels, setLevels] = useState<LearningLevelOverview[] | null>(null);

  useEffect(() => {
    getLearningLevels().then(setLevels);
  }, []);

  if (!levels) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  const hasPlacementResult = levels.some((level) => level.isRecommended);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Tests</p>
      <h1 className="text-display-l mb-4">Test what you have learned.</h1>
      <p className="text-body-l text-ink-soft mb-6 max-w-2xl">
        Choose a level for a Mixed Test or Progress Check. Tests assess
        your knowledge; lessons and teaching are in Learn.
      </p>

      {!hasPlacementResult && (
        <Card className="mb-10">
          <p className="text-small">
            Not sure where to start?{" "}
            <Link href="/level-test" className="text-pine font-semibold">
              Take the Placement Test
            </Link>{" "}
            to get a recommended level — or browse freely below.
          </p>
        </Card>
      )}

      <div className="grid gap-4 level-grid">
        {levels.map((level) => {
          const availableTests = level.tests.filter((test) => test.status === "available");
          return (
          <Card key={level.meta.slug} className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge badge-neutral">{level.meta.shortLabel}</span>
              {level.isRecommended && (
                <span className="badge badge-pine">Recommended for you</span>
              )}
            </div>
            <p className="text-h3 mb-2">{level.meta.title}</p>
            <p className="text-small text-ink-soft mb-4">
              {availableTests.length
                ? `${availableTests.length} Mixed Test available`
                : "Mixed Test coming soon"}
              {" · "}
              {level.hasProgressCheck ? "Progress Check available" : "Progress Check coming soon"}
            </p>
            <Link href={`/tests/${level.meta.slug}#test-yourself`} className="mt-auto">
              <Button variant="secondary">View assessments</Button>
            </Link>
          </Card>
        )})}
      </div>
    </main>
  );
}
