"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getLearningLevels,
  type LearningLevelOverview,
} from "@/services/learningDiscoveryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/Badge";

export default function PracticePage() {
  const [levels, setLevels] = useState<LearningLevelOverview[] | null>(null);

  useEffect(() => {
    getLearningLevels().then(setLevels);
  }, []);

  if (!levels) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Checking available practice…</p>
      </main>
    );
  }

  const recommended = levels.find((level) => level.isRecommended);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <section className="mb-12">
        <p className="text-caption mb-2">Practice</p>
        <h1 className="text-display-l mb-4">Focus on one skill.</h1>
        <p className="text-body-l text-ink-soft max-w-2xl">
          Choose a level and skill for a short scored session, or let CamPath
          recommend practice from your current mastery.
        </p>
      </section>

      {recommended ? (
        <Card className="mb-12 level-recommendation">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="card-eyebrow mb-2">Based on your progress</p>
              <h2 className="text-h2 mb-1">Practice your weakest skills</h2>
              <p className="text-small text-ink-soft">
                CamPath uses your {recommended.meta.title} mastery to recommend where to focus.
              </p>
            </div>
            <Link href="/practice/weakest-skill">
              <Button variant="primary">View recommendations</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="card-eyebrow mb-2">Personalised practice</p>
              <h2 className="text-h3 mb-1">Not sure where to focus?</h2>
              <p className="text-small text-ink-soft">
                Take the Placement Test for recommendations and mastery tracking,
                or choose a level and skill below.
              </p>
            </div>
            <Link href="/level-test">
              <Button variant="primary">Take the Placement Test</Button>
            </Link>
          </div>
        </Card>
      )}

      <section>
        <p className="card-eyebrow mb-2">Browse practice</p>
        <h2 className="text-h2 mb-2">Choose a level and skill</h2>
        <p className="text-small text-ink-soft mb-6">
          Only skills with enough real questions are available. Listening uses
          its own Practice-only audio bank.
        </p>

        <div className="flex flex-col gap-4">
          {levels.map((level) => {
            const available = level.areas.filter((area) => area.practiceHref);
            return (
              <Card key={level.meta.slug}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-neutral">{level.meta.shortLabel}</span>
                      {level.isRecommended && <span className="badge badge-pine">Your level</span>}
                    </div>
                    <h3 className="text-h3 mb-1">{level.meta.title}</h3>
                    <p className="text-small text-ink-soft">
                      {available.length
                        ? `${available.length} focused practice ${available.length === 1 ? "area" : "areas"} available.`
                        : "Focused practice is coming soon for this level."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2" aria-label={`${level.meta.title} practice`}>
                    {available.length ? (
                      available.map((area) => (
                        <Link key={area.skill} href={area.practiceHref!}>
                          <span className="skill-action">
                            <SkillBadge skill={area.skill} />
                          </span>
                        </Link>
                      ))
                    ) : (
                      <span className="text-caption normal-case">Coming Soon</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
