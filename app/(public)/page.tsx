"use client";

/**
 * app/(public)/page.tsx — Homepage
 *
 * Expanded per the Home/Navigation/Tests brief, Step 1 only.
 *
 * Scope notes (both are deliberate, not oversights):
 * - "Browse Tests" shows the 7 level names as a preview, but none of
 *   them are clickable — /tests doesn't exist until Step 2. Making
 *   them look interactive-but-dead would be the exact "broken
 *   promise" pattern fixed in the last production-readiness pass.
 * - "Featured Lessons" shows only the 3 lessons that actually exist
 *   (Unit 1–3) — no fabricated cards for content that isn't written.
 */
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, LearningCard } from "@/components/ui/Card";
import { SkillBadge } from "@/components/ui/Badge";
import { trackEvent } from "@/services/analyticsService";
import { TEST_LEVELS } from "@/constants/testLevels";
import type { Skill } from "@/components/types";

const SKILLS_MEASURED: Skill[] = ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing"];

const WHY_CAMPATH = [
  {
    title: "Structured, not random.",
    body: "Every lesson follows a real curriculum sequence — not a random grab-bag of exercises.",
  },
  {
    title: "Cambridge-style, not gamified.",
    body: "Real exam-format practice and honest feedback, without points, streaks, or badges.",
  },
  {
    title: "Built around your level.",
    body: "A short Placement Test finds your starting point before you study a single lesson.",
  },
];

const JOURNEY_STEPS = [
  { step: "1", title: "Take your Placement Test", body: "A short, honest assessment across six skills." },
  { step: "2", title: "Follow your path", body: "Lessons sequenced for your CEFR level — nothing locked." },
  { step: "3", title: "Track real progress", body: "My Journey shows what you've mastered, plainly." },
];

const FEATURED_LESSONS = [
  { unit: "unit-1", title: "First Conditional", description: "Talk about real future possibilities." },
  { unit: "unit-2", title: "Giving Opinions", description: "Phrases for formal speaking and writing." },
  { unit: "unit-3", title: "Future Plans", description: "Vocabulary for intentions and plans." },
];

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    trackEvent("home_viewed");
  }, []);

  return (
    <main>
      {/* --- Hero --- */}
      <section className="max-w-2xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-caption mb-3">CamPath</p>
        <h1 className="text-display-l mb-4">Your path to Cambridge-style fluency.</h1>
        <p className="text-body-l text-ink-soft mb-10">
          Take a short placement test to find your starting point — no
          account required.
        </p>
        <Link href="/level-test">
          <Button variant="primary" size="lg">Start Placement Test</Button>
        </Link>
      </section>

      {/* --- Why CamPath --- */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {WHY_CAMPATH.map((item) => (
            <div key={item.title}>
              <p className="text-h3 mb-2">{item.title}</p>
              <p className="text-small text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Placement Test --- */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <Card>
          <p className="card-eyebrow mb-2">Placement Test</p>
          <p className="text-h3 mb-4">Six skills, fifteen minutes, one honest starting point.</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {SKILLS_MEASURED.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
          <Link href="/level-test">
            <Button variant="primary">Start Placement Test</Button>
          </Link>
        </Card>
      </section>

      {/* --- Learning Journey --- */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-h2 mb-10 text-center">How CamPath works</p>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {JOURNEY_STEPS.map((s) => (
            <div key={s.step}>
              <p className="text-data mb-2" style={{ fontSize: "24px" }}>{s.step}</p>
              <p className="text-h3 mb-2">{s.title}</p>
              <p className="text-small text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Browse Tests (now real — /tests shipped in Step 2) --- */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-h2 mb-2 text-center">Browse Tests</p>
        <p className="text-small text-ink-soft mb-10 text-center">
          Complete, mixed Cambridge-style tests for every level.
        </p>
        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          {TEST_LEVELS.map((level) => (
            <Link key={level.slug} href={`/tests/${level.slug}`}>
              <div className="card text-center" style={{ cursor: "pointer" }}>
                <p className="text-small font-semibold">{level.title}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link href="/tests">
            <Button variant="secondary">View All Tests</Button>
          </Link>
        </div>
      </section>

      {/* --- Featured Lessons (only real lessons) --- */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-h2 mb-10 text-center">Featured Lessons</p>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {FEATURED_LESSONS.map((lesson) => (
            <LearningCard
              key={lesson.unit}
              title={lesson.title}
              description={lesson.description}
              actionLabel="Open Lesson"
              onAction={() => router.push(`/learn/${lesson.unit}`)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
