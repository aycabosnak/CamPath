import React from "react";
import { cn } from "../lib/cn";
import type { CefrLevel, StageName, Skill, ReadinessStatus, StudyPathNodeState } from "../types";

export type BadgeTone = "neutral" | "pine" | "gold" | "sage" | "brick";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/**
 * Badge (base)
 *
 * Technical Reasoning: kept deliberately dumb (just a tone + children)
 * so the four typed helpers below can each encode their own domain
 * logic (which tone a given CEFR level or status maps to) without
 * duplicating the visual shell.
 */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return <span className={cn("badge", `badge-${tone}`, className)}>{children}</span>;
}

/* ------------------------------------------------------------------ */

/** CEFR level chip, e.g. "B1". Always neutral — CEFR is a fact, not a status to color-code. */
export function CefrBadge({ level }: { level: CefrLevel }) {
  return <Badge tone="neutral">{level}</Badge>;
}

/** Stage chip, e.g. "Communicator". Uses the brand accent — this is CamPath's own naming layer. */
export function StageBadge({ stage }: { stage: StageName }) {
  return <Badge tone="pine">{stage}</Badge>;
}

const SKILL_LABEL: Record<Skill, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  listening: "Listening",
  reading: "Reading",
  useOfEnglish: "Use of English",
  writing: "Writing",
  speaking: "Speaking",
};

/** Skill chip, e.g. "Use of English". Neutral tone — skill identity, not a state. */
export function SkillBadge({ skill }: { skill: Skill }) {
  return <Badge tone="neutral">{SKILL_LABEL[skill]}</Badge>;
}

/**
 * StatusBadge
 *
 * Accessibility: text is always the actual status word (never an icon
 * alone), and tone is a reinforcing cue only — matches the same
 * "never color-only" rule used in ReadinessGauge and Study Path nodes.
 */
const READINESS_LABEL: Record<ReadinessStatus, string> = {
  notReady: "Not Yet Ready",
  approaching: "Approaching",
  ready: "Ready",
};
const READINESS_TONE: Record<ReadinessStatus, BadgeTone> = {
  notReady: "sage",
  approaching: "pine",
  ready: "gold",
};

const NODE_STATE_LABEL: Record<StudyPathNodeState, string> = {
  notStarted: "Not Started",
  recommended: "Recommended",
  inProgress: "In Progress",
  completed: "Completed",
  mastered: "Mastered",
};
const NODE_STATE_TONE: Record<StudyPathNodeState, BadgeTone> = {
  notStarted: "neutral",
  recommended: "pine",
  inProgress: "pine",
  completed: "pine",
  mastered: "gold",
};

export type StatusBadgeValue =
  | { kind: "readiness"; value: ReadinessStatus }
  | { kind: "pathNode"; value: StudyPathNodeState }
  | { kind: "needsAttention" };

export function StatusBadge({ status }: { status: StatusBadgeValue }) {
  if (status.kind === "readiness") {
    return <Badge tone={READINESS_TONE[status.value]}>{READINESS_LABEL[status.value]}</Badge>;
  }
  if (status.kind === "pathNode") {
    return <Badge tone={NODE_STATE_TONE[status.value]}>{NODE_STATE_LABEL[status.value]}</Badge>;
  }
  // Teacher-dashboard-only usage — the one legitimate use of Brick outside of form errors.
  return <Badge tone="brick">Needs Attention</Badge>;
}
