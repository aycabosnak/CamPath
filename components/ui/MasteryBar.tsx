import React from "react";
import type { Skill } from "../types";

export interface MasteryBarProps {
  skill: Skill;
  /** Display label, e.g. "Use of English". Falls back to a title-cased skill id. */
  label?: string;
  /** Mastery percentage, 0–100. */
  percentage: number;
}

const DEFAULT_LABELS: Record<Skill, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  listening: "Listening",
  reading: "Reading",
  useOfEnglish: "Use of English",
  writing: "Writing",
};

/**
 * MasteryBar
 *
 * UX Reasoning: this is the approved PRIMARY representation of
 * "Mastery by Skill" (Design System Section 7.3) — a radar/spider
 * chart may be offered later as a secondary, desktop-only view, but
 * every place in the product that needs to show mastery must be able
 * to fall back to this accessible bar form.
 *
 * Accessibility: each skill's bar is its own progressbar with its own
 * accessible name (`aria-label`), so a screen reader user gets
 * "Grammar, 82 percent" rather than one ambiguous combined chart.
 */
export function MasteryBar({ skill, label, percentage }: MasteryBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const displayLabel = label ?? DEFAULT_LABELS[skill];

  return (
    <div className="mastery-row">
      <span className="text-small font-semibold">{displayLabel}</span>
      <div
        className="mastery-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={displayLabel}
      >
        <div className="mastery-fill" style={{ width: `${clamped}%` }} />
      </div>
      <span className="text-data text-small text-right">{clamped}%</span>
    </div>
  );
}

export interface MasteryBarListProps {
  items: Array<{ skill: Skill; label?: string; percentage: number }>;
  className?: string;
}

/** Convenience wrapper for rendering all six skills together. */
export function MasteryBarList({ items, className }: MasteryBarListProps) {
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {items.map((item) => (
        <MasteryBar key={item.skill} {...item} />
      ))}
    </div>
  );
}
