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
import { useEffect, useState } from "react";
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

/**
 * Reflects the full, current feature set (Tests shipped in Step 2) —
 * the previous 3-step version predated Tests and no longer matched
 * what the platform actually does (found during the Home product
 * review). "Mock Exams" is explicitly marked Coming Soon since it
 * doesn't exist yet — this is an informational diagram, not a set of
 * links, so an unbuilt step can be named honestly without being a
 * broken link.
 */
const JOURNEY_STEPS = [
  { step: "1", title: "Take Placement Test", body: "A short, honest assessment across six skills." },
  { step: "2", title: "Discover Your Level", body: "A CEFR level and CamPath Stage, plainly explained." },
  { step: "3", title: "Personal Learning Journey", body: "My Journey shows what you've mastered and what's next." },
  { step: "4", title: "Lessons", body: "Sequenced for your level — nothing locked." },
  { step: "5", title: "Practice", body: "Short sessions targeting your weakest skills." },
  { step: "6", title: "Tests", body: "Complete, mixed Cambridge-style tests by level." },
  { step: "7", title: "Mock Exams", body: "Full exam simulations.", comingSoon: true },
  { step: "8", title: "Cambridge Exam Ready", body: "Prepared with a real, structured path." },
];

const FEATURED_LESSONS = [
  { unit: "unit-1", title: "First Conditional", description: "Talk about real future possibilities." },
  { unit: "unit-2", title: "Giving Opinions", description: "Phrases for formal speaking and writing." },
  { unit: "unit-3", title: "Future Plans", description: "Vocabulary for intentions and plans." },
];

const FAQ_ITEMS = [
  {
    q: "Who is CamPath for?",
    a: "Anyone preparing for Cambridge English exams or building structured, exam-style English skills — from teenagers to working professionals.",
  },
  {
    q: "How does the Placement Test work?",
    a: "A short, six-skill assessment (about 15 minutes) that gives you a CEFR level and a CamPath Stage — your personal starting point.",
  },
  {
    q: "Can I start from any level?",
    a: "Yes. Guided Mode recommends a starting point, but nothing is locked — you can explore any Lesson, Test, or level at any time.",
  },
  {
    q: "Do I need an account?",
    a: "No. The Placement Test and your progress work on this device without an account. Accounts are coming soon for cross-device access.",
  },
  {
    q: "Is CamPath affiliated with Cambridge Assessment?",
    a: "No. CamPath is an independent platform that follows a Cambridge-style structure and format — it is not affiliated with or endorsed by Cambridge University Press & Assessment.",
  },
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
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/level-test">
            <Button variant="primary" size="lg">Start Placement Test</Button>
          </Link>
          <Link href="/tests">
            <Button variant="secondary" size="lg">Browse Tests</Button>
          </Link>
        </div>
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
            <Button variant="primary">Begin the Test</Button>
          </Link>
        </Card>
      </section>

      {/* --- Learning Journey --- */}
      <section className="max-w-xl mx-auto px-6 py-16">
        <p className="text-h2 mb-10 text-center">How CamPath works</p>
        <div className="flex flex-col gap-6">
          {JOURNEY_STEPS.map((s) => (
            <div key={s.step} className="flex items-start gap-4">
              <p className="text-data flex-shrink-0" style={{ fontSize: "20px", width: "28px" }}>{s.step}</p>
              <div>
                <p className="text-h3 mb-1">
                  {s.title}
                  {s.comingSoon && <span className="text-caption normal-case"> · Coming Soon</span>}
                </p>
                <p className="text-small text-ink-soft">{s.body}</p>
              </div>
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

      {/* --- Cambridge Preparation --- */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-h2 mb-4">Cambridge Preparation</p>
        <p className="text-body text-ink-soft">
          CamPath follows a Cambridge-style learning structure — CEFR-aligned
          levels, mixed-skill tests, and exam-format practice — so what you
          study here reflects the real shape of a Cambridge exam.
        </p>
      </section>

      {/* --- FAQ --- */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2 mb-10 text-center">Frequently Asked Questions</p>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>
    </main>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center justify-between"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        aria-expanded={open}
      >
        <span className="text-h3">{question}</span>
        <span className="text-ink-soft" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="text-small text-ink-soft mt-3">{answer}</p>}
    </div>
  );
}
