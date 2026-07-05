"use client";

/**
 * app/(public)/page.tsx — Homepage
 *
 * Deliberately minimal for this sprint: this is the entry point of
 * the one flow we're user-testing this week (Home -> Level Test ->
 * Results -> My Journey -> Learn Preview -> Lesson -> Practice). No
 * marketing sections, no skill/level ladders — those are Phase 2+
 * scope per the Design Review Report's call to stop speculative work.
 */
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/services/analyticsService";

export default function HomePage() {
  useEffect(() => {
    trackEvent("home_viewed");
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-caption mb-3">CamPath</p>
      <h1 className="text-display-l mb-4">Your path to Cambridge-style fluency.</h1>
      <p className="text-body-l text-ink-soft mb-10">
        Take a short placement test to find your starting point — no
        account required.
      </p>
      <Link href="/level-test">
        <Button variant="primary" size="lg">
          Start Placement Test
        </Button>
      </Link>
    </main>
  );
}
