import React from "react";
import type { ReadinessStatus } from "../types";
import { cn } from "../lib/cn";

export interface ReadinessGaugeProps {
  status: ReadinessStatus;
  /** e.g. "B2 First". Shown under the status label for context. */
  examLabel: string;
  className?: string;
}

const STATUS_META: Record<
  ReadinessStatus,
  { text: string; fraction: number; arcClass: string; textClass: string }
> = {
  notReady: {
    text: "Not Yet Ready",
    fraction: 0.25,
    arcClass: "gauge-arc-not-ready",
    textClass: "gauge-status-not-ready",
  },
  approaching: {
    text: "Approaching",
    fraction: 0.65,
    arcClass: "gauge-arc-approaching",
    textClass: "gauge-status-approaching",
  },
  ready: {
    text: "Ready",
    fraction: 1,
    arcClass: "gauge-arc-ready",
    textClass: "gauge-status-ready",
  },
};

// Length of the semicircular arc path below (radius 60 → arc length ≈ π × r).
const ARC_LENGTH = 188.5;

/**
 * ReadinessGauge
 *
 * Product Reasoning: deliberately a SINGLE arc, unlike multi-ring
 * fitness-app gauges — Exam Readiness answers one honest
 * question ("how ready are you for this exam?"), not a multi-goal
 * competition. See Design System Section 7.2.
 *
 * Accessibility: the status is never conveyed by color alone. The arc
 * color is a reinforcing cue only — the actual information is in the
 * visible text label AND in `aria-label` on the figure. A screen
 * reader user gets the full picture without seeing the SVG at all.
 *
 * Manifesto Check: reaching "Ready" renders with the same calm
 * transition as any other state — no celebratory animation, confetti,
 * or sound. Readiness is a fact to report, not a reward to trigger.
 */
export function ReadinessGauge({ status, examLabel, className }: ReadinessGaugeProps) {
  const meta = STATUS_META[status];
  const dashOffset = ARC_LENGTH * (1 - meta.fraction);

  return (
    <figure
      className={cn("text-center", className)}
      style={{ width: 150 }}
      role="img"
      aria-label={`Exam Readiness for ${examLabel}: ${meta.text}`}
    >
      <svg viewBox="0 0 150 90" width={150} height={90} aria-hidden="true">
        <path
          d="M15 85 A60 60 0 0 1 135 85"
          className="gauge-arc-track"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M15 85 A60 60 0 0 1 135 85"
          className={meta.arcClass}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset var(--duration-section) var(--ease-calm)" }}
        />
      </svg>
      <figcaption>
        <div className={cn("text-small", meta.textClass)}>{meta.text.toUpperCase()}</div>
        <div className="text-caption normal-case">{examLabel}</div>
      </figcaption>
    </figure>
  );
}
