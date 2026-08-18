"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkillBadge } from "@/components/ui/Badge";
import { TEST_LEVELS } from "@/constants/testLevels";
import { trackEvent } from "@/services/analyticsService";
import type { Skill } from "@/components/types";

const SKILLS: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];
const LEVELS = TEST_LEVELS.filter((level) => level.cefr !== null);

const PRODUCT_PILLARS = [
  {
    eyebrow: "Find my level",
    title: "Start from evidence.",
    body: "A short six-skill Placement Test estimates your CEFR level and gives you a practical starting point.",
    href: "/level-test",
    action: "Take the Placement Test",
  },
  {
    eyebrow: "Learn by level",
    title: "Follow a clear curriculum.",
    body: "Study concise lessons, examples, and guided practice from A1 through C1. Missing content is labelled honestly.",
    href: "/learn",
    action: "Browse levels",
  },
  {
    eyebrow: "Track my progress",
    title: "Know what comes next.",
    body: "My Journey connects completed learning, skill mastery, milestones, and your next recommended action.",
    href: "/my-journey",
    action: "View My Journey",
  },
];

export default function HomePage() {
  useEffect(() => {
    trackEvent("home_viewed");
  }, []);

  return (
    <main>
      <section className="home-hero">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-caption mb-3">English learning · Cambridge exam preparation</p>
          <h1 className="text-display-xl mb-5 max-w-3xl">
            A clearer path from your current English to your next level.
          </h1>
          <p className="text-body-l text-ink-soft mb-8 max-w-2xl">
            CamPath combines CEFR-aligned lessons, focused practice, honest
            assessments, and progress tracking—without points, streaks, or guesswork.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/level-test">
              <Button variant="primary" size="lg">Take the Placement Test</Button>
            </Link>
            <Link href="/learn">
              <Button variant="secondary" size="lg">Browse Levels</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid gap-4 product-pillar-grid">
          {PRODUCT_PILLARS.map((pillar) => (
            <Card key={pillar.eyebrow} className="flex flex-col">
              <p className="card-eyebrow mb-3">{pillar.eyebrow}</p>
              <h2 className="text-h2 mb-3">{pillar.title}</h2>
              <p className="text-small text-ink-soft mb-6">{pillar.body}</p>
              <Link href={pillar.href} className="mt-auto">
                <Button variant="tertiary">{pillar.action} →</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="home-levels">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
            <div>
              <p className="card-eyebrow mb-2">Learn by level</p>
              <h2 className="text-h1 mb-2">From foundations to advanced English.</h2>
              <p className="text-small text-ink-soft max-w-xl">
                Open any level freely. A Placement Test recommendation helps when you are unsure where to begin.
              </p>
            </div>
            <Link href="/learn">
              <Button variant="secondary">Explore the curriculum</Button>
            </Link>
          </div>

          <div className="level-strip" aria-label="Available CEFR levels">
            {LEVELS.map((level) => (
              <Link key={level.slug} href={`/tests/${level.slug}`} className="level-strip-item">
                <span className="text-data">{level.shortLabel}</span>
                <span className="text-small">{level.title.replace(`${level.shortLabel} `, "")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid gap-8 placement-summary">
          <div>
            <p className="card-eyebrow mb-2">Placement Test</p>
            <h2 className="text-h1 mb-3">One starting point, six measured skills.</h2>
            <p className="text-body text-ink-soft mb-6">
              About 15 minutes. No account required. Your result stays on this
              device and immediately shapes My Journey and Practice.
            </p>
            <Link href="/level-test">
              <Button variant="primary">Find my level</Button>
            </Link>
          </div>
          <Card>
            <p className="text-h3 mb-4">What CamPath measures</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {SKILLS.map((skill) => <SkillBadge key={skill} skill={skill} />)}
            </div>
            <p className="text-small text-ink-soft">
              Listening uses unique Placement audio and a two-play limit. Results
              show mastery by skill, correct answers, explanations, and review transcripts.
            </p>
          </Card>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="card-eyebrow mb-2">Progress over points</p>
        <h2 className="text-h1 mb-4">Study with direction, not pressure.</h2>
        <p className="text-body text-ink-soft mb-8">
          Learn a concept, practise one skill, test your understanding, and use
          your progress to choose the next step.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/learn"><Button variant="primary">Start learning</Button></Link>
          <Link href="/tests"><Button variant="secondary">View tests</Button></Link>
        </div>
      </section>
    </main>
  );
}
