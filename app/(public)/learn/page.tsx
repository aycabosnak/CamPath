"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getLearningLevels,
  type LearningLevelOverview,
} from "@/services/learningDiscoveryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

function availabilityLabel(level: LearningLevelOverview): string {
  const lessons = level.areas.reduce((sum, area) => sum + area.lessonCount, 0);
  const practiceAreas = level.areas.filter((area) => area.practiceHref).length;
  return `${lessons} lessons · ${practiceAreas} practice areas`;
}

export default function LearnPage() {
  const [levels, setLevels] = useState<LearningLevelOverview[] | null>(null);

  useEffect(() => {
    getLearningLevels().then(setLevels);
  }, []);

  if (!levels) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading levels…</p>
      </main>
    );
  }

  const recommended = levels.find((level) => level.isRecommended);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <section className="mb-12">
        <p className="text-caption mb-2">Learn</p>
        <h1 className="text-display-l mb-4">Learn English by level.</h1>
        <p className="text-body-l text-ink-soft max-w-2xl">
          Choose a CEFR level, study short lessons with guided practice,
          then check your understanding when you are ready.
        </p>
      </section>

      {recommended ? (
        <Card className="mb-12 level-recommendation">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <p className="card-eyebrow mb-2">Recommended for you</p>
              <h2 className="text-h2 mb-2">{recommended.meta.title}</h2>
              <p className="text-small text-ink-soft mb-5">{recommended.meta.description}</p>
              <ProgressBar
                value={recommended.progressPercentage}
                label={`${recommended.progress.completedCount} of ${recommended.progress.totalCount} learning steps complete`}
              />
            </div>
            <Link href={`/tests/${recommended.meta.slug}`}>
              <Button variant="primary">Continue this level</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="card-eyebrow mb-2">Not sure where to begin?</p>
              <p className="text-h3 mb-1">Find your starting level in about 15 minutes.</p>
              <p className="text-small text-ink-soft">
                The Placement Test measures six skills and recommends a level.
              </p>
            </div>
            <Link href="/level-test">
              <Button variant="primary">Take the Placement Test</Button>
            </Link>
          </div>
        </Card>
      )}

      <section>
        <div className="mb-6">
          <p className="card-eyebrow mb-2">All levels</p>
          <h2 className="text-h2 mb-2">Browse the curriculum</h2>
          <p className="text-small text-ink-soft">
            Nothing is locked. Unavailable skills are labelled honestly inside each level.
          </p>
        </div>

        <div className="grid gap-4 level-grid">
          {levels.map((level) => (
            <Card key={level.meta.slug} className="level-card flex flex-col">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="badge badge-neutral">{level.meta.shortLabel}</span>
                {level.meta.isBridge && <span className="badge badge-sage">Bridge</span>}
                {level.isRecommended && <span className="badge badge-pine">Recommended</span>}
              </div>
              <h2 className="text-h3 mb-2">{level.meta.title}</h2>
              <p className="text-small text-ink-soft mb-4">{level.meta.description}</p>
              <p className="text-caption normal-case mb-4">{availabilityLabel(level)}</p>
              <ProgressBar
                value={level.progressPercentage}
                label="Level progress"
                className="mb-5"
              />
              <div className="mt-auto">
                <Link href={`/tests/${level.meta.slug}`}>
                  <Button variant={level.isRecommended ? "primary" : "secondary"}>
                    Open level
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
