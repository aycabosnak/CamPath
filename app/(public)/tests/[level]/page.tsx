"use client";

/** Shared A1–C1 level overview. The route is historical; the page is
 * learner-facing curriculum discovery, not a Tests-only page. */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLevelSequence, type LevelSequenceNode } from "@/services/curriculumService";
import {
  getLearningLevelDetail,
  type LearningLevelOverview,
} from "@/services/learningDiscoveryService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkillBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StudyPath } from "@/components/study-path/StudyPath";
import type { StudyPathNodeData } from "@/components/study-path/StudyPath";

interface LevelData {
  overview: LearningLevelOverview;
  sequence: LevelSequenceNode[];
}

export default function TestLevelPage() {
  const params = useParams<{ level: string }>();
  const router = useRouter();
  const [data, setData] = useState<LevelData | null | undefined>(undefined);

  useEffect(() => {
    Promise.all([getLearningLevelDetail(params.level), getLevelSequence(params.level)]).then(
      ([overview, sequence]) => {
        if (!overview) {
          setData(null);
          return;
        }
        setData({ overview, sequence });
      }
    );
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
        <Link href="/learn">
          <Button variant="primary">Browse levels</Button>
        </Link>
      </main>
    );
  }

  const { overview, sequence } = data;
  const { meta, progress, progressPercentage, areas, tests, hasProgressCheck } = overview;
  const availableTests = tests.filter((test) => test.status === "available");
  const comingTests = tests.filter((test) => test.status === "coming_soon");

  const hrefById = new Map(sequence.map((n) => [n.id, n.href]));
  const nodes: StudyPathNodeData[] = sequence.map(({ href, ...node }) => node);

  function goToNode(nodeId: string) {
    const href = hrefById.get(nodeId);
    if (href) router.push(href);
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">
        <Link href="/learn" className="text-ink-soft">Learn</Link> / {meta.title}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <span className="badge badge-neutral">{meta.shortLabel}</span>
        {meta.isBridge && <span className="badge badge-sage">Bridge</span>}
        {overview.isRecommended && <span className="badge badge-pine">Your recommended level</span>}
      </div>
      <h1 className="text-display-l mb-4">{meta.pageTitle}</h1>
      <p className="text-body-l text-ink-soft mb-8 max-w-2xl">{meta.description}</p>

      <Card className="mb-12 level-progress-card">
        <div className="grid gap-6 level-progress-layout">
          <div>
            <p className="card-eyebrow mb-2">Your progress</p>
            <p className="text-h3 mb-4">
              {progress.completedCount} of {progress.totalCount} learning steps complete
            </p>
            <ProgressBar value={progressPercentage} label={`${meta.shortLabel} completion`} />
          </div>
          <div>
            <p className="card-eyebrow mb-2">Continue</p>
            {progress.nextItem ? (
              <>
                <p className="text-h3 mb-1">{progress.nextItem.title}</p>
                <p className="text-small text-ink-soft mb-4">
                  {progress.nextItem.type === "lesson"
                    ? "Teaching, examples, and guided practice."
                    : progress.nextItem.type === "test"
                    ? "A mixed assessment across the skills you have studied."
                    : "Your level-exit diagnostic and completion milestone."}
                </p>
                <Link href={progress.nextItem.href}>
                  <Button variant="primary">Continue learning</Button>
                </Link>
              </>
            ) : (
              <p className="text-small text-ink-soft">
                You have completed every currently available step in this level.
              </p>
            )}
          </div>
        </div>
      </Card>

      <section className="mb-14">
        <p className="card-eyebrow mb-2">Learn</p>
        <h2 className="text-h2 mb-2">Learning areas</h2>
        <p className="text-small text-ink-soft mb-6">
          Lessons teach the concept first. Focused practice lets you revisit one skill.
        </p>

        <div className="grid gap-4 learning-area-grid">
          {areas.map((area) => {
            const available = Boolean(area.lessonHref || area.practiceHref);
            return (
              <Card key={area.skill} className={!available ? "availability-card-unavailable" : undefined}>
                <div className="mb-3">
                  <SkillBadge skill={area.skill} />
                </div>
                <h3 className="text-h3 mb-1">{area.label}</h3>
                <p className="text-small text-ink-soft mb-4">{area.description}</p>
                <p className="text-caption normal-case mb-4">
                  {area.lessonCount
                    ? `${area.lessonCount} ${area.lessonCount === 1 ? "lesson" : "lessons"}`
                    : area.practiceHref
                    ? "Practice available"
                    : "Coming Soon"}
                </p>
                <div className="flex flex-wrap gap-3">
                  {area.lessonHref && (
                    <Link href={area.lessonHref}>
                      <Button variant="primary" size="sm">Learn</Button>
                    </Link>
                  )}
                  {area.practiceHref && (
                    <Link href={area.practiceHref}>
                      <Button variant="secondary" size="sm">Practice</Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="test-yourself" className="mb-14 scroll-mt-8">
        <p className="card-eyebrow mb-2">Test yourself</p>
        <h2 className="text-h2 mb-2">Assess what you know</h2>
        <p className="text-small text-ink-soft mb-6">
          Mixed Tests are rehearsal. The Progress Check is the level-exit diagnostic.
        </p>

        <div className="grid gap-4 assessment-grid">
          {availableTests.map((test) => {
            const item = progress.items.find((candidate) => candidate.type === "test" && candidate.id === test.id);
            return (
              <Card key={test.id}>
                <p className="card-eyebrow mb-2">Mixed Test</p>
                <h3 className="text-h3 mb-2">{test.title}</h3>
                <p className="text-small text-ink-soft mb-5">
                  {item?.completed ? "Attempted · Retake whenever useful." : "A scored rehearsal across available skills."}
                </p>
                <Link href={`/tests/${meta.slug}/${test.id}`}>
                  <Button variant="secondary">{item?.completed ? "Retake test" : "Start test"}</Button>
                </Link>
              </Card>
            );
          })}

          {hasProgressCheck && (
            <Card>
              <p className="card-eyebrow mb-2">Progress Check</p>
              <h3 className="text-h3 mb-2">{meta.shortLabel} level diagnostic</h3>
              <p className="text-small text-ink-soft mb-5">
                {progress.items.find((item) => item.type === "progressCheck")?.completed
                  ? "Completed · Your milestone and mastery are saved."
                  : "Complete this after the lessons and Mixed Test."}
              </p>
              <Link href={`/tests/${meta.slug}/progress-check`}>
                <Button variant="secondary">Open Progress Check</Button>
              </Link>
            </Card>
          )}

          {comingTests.map((test) => (
            <Card key={test.id} className="availability-card-unavailable">
              <p className="card-eyebrow mb-2">Future assessment</p>
              <h3 className="text-h3 mb-2">{test.title}</h3>
              <p className="text-small text-ink-soft">Coming Soon</p>
            </Card>
          ))}
        </div>
      </section>

      {nodes.length > 0 && (
        <section>
          <p className="card-eyebrow mb-2">Full level path</p>
          <h2 className="text-h2 mb-2">{meta.isBridge ? "Bridge progression" : "Learning progression"}</h2>
          <p className="text-small text-ink-soft mb-6">
            Lessons lead into the Mixed Test, then the Progress Check. Nothing is locked.
          </p>
          <Card>
            <StudyPath nodes={nodes} mode="guided" onSelectNode={goToNode} />
          </Card>
        </section>
      )}
    </main>
  );
}
