import React from "react";
import { cn } from "../lib/cn";

export interface ProgressBarProps {
  /** Current value, 0–100. */
  value: number;
  /** Visible label, e.g. "Unit 4 · Talking About the Past". */
  label?: string;
  /** Show the numeric percentage next to the label. Default true. */
  showValue?: boolean;
  className?: string;
}

/**
 * ProgressBar
 *
 * Accessibility: implements the native `progressbar` role manually
 * (rather than <progress>, whose styling is very hard to control
 * cross-browser) with the three required ARIA value attributes.
 * `aria-label` falls back to a generic string if no visible label is
 * given, so the bar is never announced as unlabeled.
 *
 * Manifesto Check: the fill only transitions when `value` changes
 * (see `.progress-fill` transition in globals.css) — no idle pulse or
 * looping animation, so the bar never demands attention on its own.
 */
export function ProgressBar({
  value,
  label,
  showValue = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between gap-2 flex-wrap text-small text-ink-soft mb-2">
          {label && <span className="min-w-0">{label}</span>}
          {showValue && <span className="text-data text-small">{clamped}%</span>}
        </div>
      )}
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
