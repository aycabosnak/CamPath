"use client";

/**
 * app/(auth)/learn-preview/page.tsx
 *
 * Scope for this sprint: ONE guided path preview from My Journey —
 * one Unit, one Lesson entry point. Not the full Learn module
 * (Browse All Topics, 4 lesson templates, etc.) — that work is
 * explicitly paused per the Design Review Report.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getLearnPreviewUnit, type LearnPreviewUnit } from "@/services/learnPreviewService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StageBadge } from "@/components/ui/Badge";
import { trackEvent } from "@/services/analyticsService";

export default function LearnPreviewPage() {
  const [unit, setUnit] = useState<LearnPreviewUnit | null>(null);

  useEffect(() => {
    getLearnPreviewUnit().then((data) => {
      setUnit(data);
      trackEvent("learn_preview_opened", { stage: data.stage });
    });
  }, []);

  if (!unit) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Learn</p>
      <div className="mb-6">
        <StageBadge stage={unit.stage} />
      </div>

      <Card>
        <p className="card-eyebrow mb-1">{unit.unitTitle}</p>
        <p className="text-h3 mb-2">{unit.lesson.skillLabel} · {unit.lesson.title}</p>
        <p className="text-small text-ink-soft mb-6">
          A short lesson: one explanation, a few examples, and one guided question.
        </p>
        <Link href="/learn-preview/lesson">
          <Button variant="primary" size="lg">
            Start Lesson
          </Button>
        </Link>
      </Card>
    </main>
  );
}
