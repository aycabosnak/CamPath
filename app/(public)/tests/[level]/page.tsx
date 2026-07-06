"use client";

/**
 * app/(public)/tests/[level]/page.tsx
 *
 * UX review follow-up (all High-severity fixes applied):
 * - The Stage bridge line ("Maps to: Foundation") only renders once
 *   the learner has an actual Placement Test result — otherwise it's
 *   unexplained internal jargon on a first-time visitor's first
 *   content page.
 * - Lessons + Mixed Tests + Progress Check now render as ONE
 *   sequence through the existing StudyPath/StudyPathNode components
 *   (reused, not reinvented) — the current step visually stands out,
 *   completed steps are quiet, nothing is locked.
 *
 * This remains the reference template: A2 through C1 render through
 * this exact same page once their content exists.
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTestLevelDetail, getRecommendedLevelSlug } from "@/services/testsService";
import { getLevelSequence, type LevelSequenceNode } from "@/services/curriculumService";
import type { TestLevelMeta } from "@/constants/testLevels";
import { Button } from "@/components/ui/Button";
import { StudyPath } from "@/components/study-path/StudyPath";
import type { StudyPathNodeData } from "@/components/study-path/StudyPath";

interface LevelData {
  meta: TestLevelMeta;
  sequence: LevelSequenceNode[];
  hasPlacementResult: boolean;
}

export default function TestLevelPage() {
  const params = useParams<{ level: string }>();
  const router = useRouter();
  const [data, setData] = useState<LevelData | null | undefined>(undefined);

  useEffect(() => {
    Promise.all([getTestLevelDetail(params.level), getLevelSequence(params.level)]).then(
      ([detail, sequence]) => {
        if (!detail) {
          setData(null);
          return;
        }
        setData({ meta: detail.meta, sequence, hasPlacementResult: getRecommendedLevelSlug() !== null });
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
        <Link href="/tests">
          <Button variant="primary">Back to Tests</Button>
        </Link>
      </main>
    );
  }

  const { meta, sequence, hasPlacementResult } = data;

  const hrefById = new Map(sequence.map((n) => [n.id, n.href]));
  const nodes: StudyPathNodeData[] = sequence.map(({ href, ...node }) => node);

  function goToNode(nodeId: string) {
    const href = hrefById.get(nodeId);
    if (href) router.push(href);
  }

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
      {/* Only shown once the learner has real Stage context — see
          file header. Prevents unexplained jargon on a first visit. */}
      {meta.bridge && hasPlacementResult && (
        <p className="text-small text-ink-soft mb-10">{meta.bridge}</p>
      )}
      {!(meta.bridge && hasPlacementResult) && <div className="mb-10" />}

      {/* --- The full learning sequence: Lessons -> Mixed Tests -> Progress Check --- */}
      {nodes.length > 0 && (
        <div className="mb-10">
          <p className="text-h3 mb-4">{meta.isBridge ? "Bridge Path" : "Learning Path"}</p>
          <StudyPath nodes={nodes} mode="guided" onSelectNode={goToNode} />
        </div>
      )}

      {/* --- Reserved sections: no content yet, architecture already exists --- */}
      {(["listening", "speaking"] as const).map((skill) => (
        <div key={skill} className="mb-6">
          <p className="card-eyebrow mb-3">{skill === "listening" ? "Listening" : "Speaking"}</p>
          <div className="card" style={{ opacity: 0.6 }}>
            <p className="text-small text-ink-soft">Coming Soon</p>
          </div>
        </div>
      ))}

      <div>
        <p className="card-eyebrow mb-3">Mock Exam</p>
        <div className="card" style={{ opacity: 0.6 }}>
          <p className="text-small text-ink-soft">Coming Soon</p>
        </div>
      </div>
    </main>
  );
}
