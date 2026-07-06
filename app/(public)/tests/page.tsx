"use client";

/**
 * app/(public)/tests/page.tsx
 *
 * Tests Architecture, Step 2. Shows the 7 learner-friendly levels
 * (Option C — separate from the internal CamPath Stage system; see
 * constants/testLevels.ts for the bridge mapping). If the learner has
 * a Placement Test result, their matching level is marked
 * "Recommended for you" — read-only, nothing here writes back to the
 * Placement Test data.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTestLevels, type TestLevelWithCount } from "@/services/testsService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TestsPage() {
  const [levels, setLevels] = useState<TestLevelWithCount[] | null>(null);

  useEffect(() => {
    getTestLevels().then(setLevels);
  }, []);

  if (!levels) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  const hasPlacementResult = levels.some((l) => l.isRecommended);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Tests</p>
      <h1 className="text-display-l mb-4">Find your level.</h1>
      <p className="text-body-l text-ink-soft mb-6">
        Structured lessons and complete, mixed Cambridge-style tests —
        Grammar, Vocabulary, Reading, and Writing together, the way a
        real exam works.
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

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {levels.map((level) => (
          <Card key={level.slug}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge badge-neutral">{level.shortLabel}</span>
              {level.isRecommended && (
                <span className="badge badge-pine">Recommended for you</span>
              )}
            </div>
            <p className="text-h3 mb-2">{level.title}</p>
            <p className="text-small text-ink-soft mb-3">{level.description}</p>
            {/* Same gating rule as the level detail page: unexplained
                Stage jargon only appears once the learner has real
                placement context (QA follow-up fix). */}
            {level.bridge && hasPlacementResult && (
              <p className="text-caption normal-case mb-3">{level.bridge}</p>
            )}
            <p className="text-small text-ink-soft mb-4">
              {level.availableCount} of {level.totalCount} tests available
            </p>
            <Link href={`/tests/${level.slug}`}>
              <Button variant="secondary">View Tests</Button>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
