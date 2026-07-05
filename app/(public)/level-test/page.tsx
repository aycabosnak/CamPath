/**
 * app/(public)/level-test/page.tsx
 *
 * Experience Blueprint 1.1 — Placement Test intro. No account
 * required to start; see services/placementTestService.ts and the
 * Guest → Account Claim flow (Database & API Design doc, 5.2) for
 * why signup is deferred to the results screen, not required here.
 */
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/Badge";
import type { Skill } from "@/components/types";

const SKILLS_MEASURED: Skill[] = [
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "useOfEnglish",
  "writing",
];

export default function LevelTestIntroPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Placement Test</p>
      <h1 className="text-display-l mb-4">Find your starting point.</h1>
      <p className="text-body-l text-ink-soft mb-10">
        A short, honest assessment across six skills. It takes about 15
        minutes and tells us exactly where to start your CamPath —
        nothing more, nothing less.
      </p>

      <Card className="mb-10">
        <p className="text-h3 mb-4">What we'll measure</p>
        <div className="flex flex-wrap gap-2">
          {SKILLS_MEASURED.map((skill) => (
            <SkillBadge key={skill} skill={skill} />
          ))}
        </div>
        <p className="text-small text-ink-soft mt-4">
          Your result gives you a CEFR level, a CamPath Stage, and a
          breakdown of where each skill currently stands — the same
          view you'll see throughout My Journey.
        </p>
      </Card>

      <Link href="/level-test/take">
        <Button variant="primary" size="lg">
          Start Placement Test
        </Button>
      </Link>
    </main>
  );
}
