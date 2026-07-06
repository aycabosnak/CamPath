"use client";

/**
 * app/(public)/tests/[level]/page.tsx
 *
 * Level detail — now the full curriculum home for a level, not just
 * a test list. Shows the approved learning sequence: Grammar ->
 * Vocabulary -> Reading -> Writing -> Mixed Tests -> Progress Check,
 * plus reserved (Coming Soon) Listening and Speaking sections so the
 * architecture is future-proof without pretending content exists yet.
 *
 * This is the reference template: A2 through C1 render through this
 * exact same page once their content is added to
 * lib/mock-data/curriculumLessons.ts / tests.ts / progressChecks.ts —
 * nothing here is A1-specific except the data it happens to find.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTestLevelDetail } from "@/services/testsService";
import { getLessonsGroupedBySkill, getProgressCheck } from "@/services/curriculumService";
import { isCurriculumLessonCompleted, getProgressCheckRecord } from "@/services/progressService";
import type { TestLevelMeta } from "@/constants/testLevels";
import type { TestSummary } from "@/lib/mock-data/tests";
import type { CurriculumLesson } from "@/lib/mock-data/curriculumLessons";
import type { ProgressCheckContent } from "@/lib/mock-data/progressChecks";
import type { Skill } from "@/components/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/Badge";

const SKILL_LABELS: Record<Skill, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  listening: "Listening",
  reading: "Reading",
  useOfEnglish: "Use of English",
  writing: "Writing",
};

interface LevelData {
  meta: TestLevelMeta;
  tests: TestSummary[];
  lessonGroups: Array<{ skill: Skill; lessons: CurriculumLesson[] }>;
  progressCheck: ProgressCheckContent | null;
}

export default function TestLevelPage() {
  const params = useParams<{ level: string }>();
  const [data, setData] = useState<LevelData | null | undefined>(undefined);

  useEffect(() => {
    Promise.all([
      getTestLevelDetail(params.level),
      getLessonsGroupedBySkill(params.level),
      getProgressCheck(params.level),
    ]).then(([detail, lessonGroups, progressCheck]) => {
      if (!detail) {
        setData(null);
        return;
      }
      setData({ meta: detail.meta, tests: detail.tests, lessonGroups, progressCheck });
    });
  }, [params.level]);

  if (data === undefined) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (data === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2 mb-4">Level not found.</p>
        <Link href="/tests">
          <Button variant="primary">Back to Tests</Button>
        </Link>
      </main>
    );
  }

  const { meta, tests, lessonGroups, progressCheck } = data;
  const progressCheckDone = getProgressCheckRecord(meta.slug);
  const checkLabel = meta.isBridge ? "Bridge Check" : "Progress Check";

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">
        <Link href="/tests" className="text-ink-soft">Tests</Link> / {meta.title}
      </p>
      <div className="flex items-center gap-2 mb-4">
        <span className="badge badge-neutral">{meta.shortLabel}</span>
        {meta.isBridge && <span className="badge badge-sage">Bridge</span>}
      </div>
      <h1 className="text-display-l mb-4">{meta.pageTitle}</h1>
      <p className="text-body-l text-ink-soft mb-2">{meta.description}</p>
      {meta.bridge && <p className="text-small text-ink-soft mb-10">{meta.bridge}</p>}

      {/* --- Lessons, grouped by skill, in the approved sequence order --- */}
      {lessonGroups.map((group) => (
        <div key={group.skill} className="mb-8">
          <div className="mb-3">
            <SkillBadge skill={group.skill} />
          </div>
          <div className="flex flex-col gap-2">
            {group.lessons.map((lesson) => {
              const done = isCurriculumLessonCompleted(lesson.id);
              return (
                <Link key={lesson.id} href={`/tests/${meta.slug}/lessons/${lesson.id}`}>
                  <div className="card flex items-center justify-between" style={{ cursor: "pointer" }}>
                    <p className="text-body font-semibold">{lesson.title}</p>
                    {done && <span className="text-small" style={{ color: "var(--color-pine)" }}>✓ Completed</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* --- Reserved sections: no content yet, architecture already exists --- */}
      {(["listening", "speaking"] as const).map((skill) => (
        <div key={skill} className="mb-8">
          <p className="card-eyebrow mb-3">{skill === "listening" ? "Listening" : "Speaking"}</p>
          <div className="card" style={{ opacity: 0.6 }}>
            <p className="text-small text-ink-soft">Coming Soon</p>
          </div>
        </div>
      ))}

      {/* --- Mixed Tests --- */}
      <div className="mb-8">
        <p className="card-eyebrow mb-3">Mixed Tests</p>
        <div className="flex flex-col gap-2">
          {tests.map((test) =>
            test.status === "available" ? (
              <Link key={test.id} href={`/tests/${meta.slug}/${test.id}`}>
                <div className="card" style={{ cursor: "pointer" }}>
                  <p className="text-h3 mb-1">{test.title}</p>
                  <p className="text-small text-ink-soft">Grammar · Vocabulary · Reading</p>
                </div>
              </Link>
            ) : (
              <div key={test.id} className="card" style={{ opacity: 0.6 }}>
                <p className="text-h3 mb-1">{test.title}</p>
                <p className="text-small text-ink-soft">Coming Soon</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* --- Progress Check / Bridge Check --- */}
      <div className="mb-8">
        <p className="card-eyebrow mb-3">{checkLabel}</p>
        {progressCheck ? (
          <Link href={`/tests/${meta.slug}/progress-check`}>
            <div className="card" style={{ cursor: "pointer" }}>
              <p className="text-h3 mb-1">{progressCheck.title}</p>
              <p className="text-small text-ink-soft">
                {progressCheckDone
                  ? `✓ Completed — ${progressCheckDone.correctCount}/${progressCheckDone.totalCount}`
                  : "A short, honest diagnostic — not a pass/fail gate."}
              </p>
            </div>
          </Link>
        ) : (
          <div className="card" style={{ opacity: 0.6 }}>
            <p className="text-small text-ink-soft">Coming Soon</p>
          </div>
        )}
      </div>

      {/* --- Mock Exam --- */}
      <div>
        <p className="card-eyebrow mb-3">Mock Exam</p>
        <div className="card" style={{ opacity: 0.6 }}>
          <p className="text-small text-ink-soft">Coming Soon</p>
        </div>
      </div>
    </main>
  );
}
