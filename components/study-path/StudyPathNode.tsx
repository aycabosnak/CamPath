import React from "react";
import type { StudyPathNodeState } from "../types";
import { cn } from "../lib/cn";

export interface StudyPathNodeProps {
  /** Order number shown inside the badge when the node is not yet completed. */
  order: number;
  state: StudyPathNodeState;
  title: string;
  /** e.g. "In progress", "Recommended next", "Not started · available anytime". */
  subtitle: string;
  onSelect?: () => void;
  isLast?: boolean;
}

const STATE_CLASS: Record<StudyPathNodeState, string> = {
  notStarted: "",
  recommended: "node-badge-recommended",
  inProgress: "node-badge-progress",
  completed: "node-badge-done",
  mastered: "node-badge-done node-badge-mastered",
};

/**
 * StudyPathNode
 *
 * Product Reasoning: there is intentionally no "locked" state, no lock
 * icon, and no XP/reward copy anywhere in this component — this is a
 * direct implementation of the approved v2.0 decision that nothing in
 * CamPath is technically locked. "recommended" is the strongest form
 * of guidance the UI offers, and it's expressed as an outline, not a
 * restriction.
 *
 * UX Reasoning: the badge is a rounded square (`--radius-node`), never
 * a circle — circular "bubble" nodes read as a game map (Duolingo).
 * A completed node shows a checkmark; a mastered node adds only a thin
 * gold ring, never a star or trophy icon.
 *
 * Accessibility: rendered as a <button> when `onSelect` is provided,
 * so every node — including "not started" ones — is independently
 * reachable and activatable by keyboard, matching Free Mode's promise
 * that any topic can always be chosen.
 */
export function StudyPathNode({
  order,
  state,
  title,
  subtitle,
  onSelect,
  isLast = false,
}: StudyPathNodeProps) {
  const badgeContent = state === "completed" || state === "mastered" ? "✓" : order;

  const content = (
    <div className={cn("path-node", isLast && "!pb-0")}>
      <div className={cn("node-badge", STATE_CLASS[state])} aria-hidden="true">
        {badgeContent}
      </div>
      <div>
        <div className="text-small font-semibold">{title}</div>
        <div className="text-caption normal-case">{subtitle}</div>
      </div>
    </div>
  );

  if (!onSelect) {
    return content;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left bg-transparent border-0 p-0 cursor-pointer"
      aria-label={`${title} — ${subtitle}`}
    >
      {content}
    </button>
  );
}
