"use client";

/**
 * app/(public)/tests/[level]/page.tsx
 *
 * Level detail — shows available tests (clickable) and Coming Soon
 * tests (deliberately not clickable, no route exists for them).
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTestLevelDetail } from "@/services/testsService";
import type { TestLevelMeta } from "@/constants/testLevels";
import type { TestSummary } from "@/lib/mock-data/tests";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CefrBadge } from "@/components/ui/Badge";

export default function TestLevelPage() {
  const params = useParams<{ level: string }>();
  const [detail, setDetail] = useState<{ meta: TestLevelMeta; tests: TestSummary[] } | null | undefined>(undefined);

  useEffect(() => {
    getTestLevelDetail(params.level).then(setDetail);
  }, [params.level]);

  if (detail === undefined) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (detail === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-h2 mb-4">Level not found.</p>
        <Link href="/tests">
          <Button variant="primary">Back to Tests</Button>
        </Link>
      </main>
    );
  }

  const { meta, tests } = detail;

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">
        <Link href="/tests" className="text-ink-soft">Tests</Link> / {meta.title}
      </p>
      <div className="flex items-center gap-2 mb-4">
        {meta.cefr && <CefrBadge level={meta.cefr} />}
      </div>
      <h1 className="text-display-l mb-4">{meta.title}</h1>
      <p className="text-body-l text-ink-soft mb-2">{meta.description}</p>
      {meta.bridge && <p className="text-small text-ink-soft mb-10">{meta.bridge}</p>}

      <div className="flex flex-col gap-3">
        {tests.map((test) =>
          test.status === "available" ? (
            <Link key={test.id} href={`/tests/${meta.slug}/${test.id}`}>
              <div className="card" style={{ cursor: "pointer" }}>
                <p className="text-h3 mb-1">{test.title}</p>
                <p className="text-small text-ink-soft">
                  Grammar · Vocabulary · Reading · Use of English · Writing
                </p>
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
    </main>
  );
}
