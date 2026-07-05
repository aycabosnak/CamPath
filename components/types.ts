/**
 * CamPath — Shared Component Types
 *
 * Central place for enums/unions reused across the component library.
 * Keeping these in one file prevents drift (e.g. one component typing
 * "inProgress" and another typing "in_progress").
 */

export type Skill =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "reading"
  | "useOfEnglish"
  | "writing";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type StageName =
  | "Foundation"
  | "Explorer"
  | "Communicator"
  | "Independent"
  | "Advanced"
  | "Master";

/**
 * Exam Readiness status. Intentionally three states only —
 * matches the Design System's single-arc gauge (Section 7.2).
 * Never render this as a raw number/percentage to the learner;
 * always resolve to one of these three honest states first.
 */
export type ReadinessStatus = "notReady" | "approaching" | "ready";

/**
 * Study Path node state. There is deliberately NO "locked" state —
 * see the approved v2.0 architecture decision: nothing in CamPath
 * is technically locked. "recommended" is the softest form of
 * guidance the system offers.
 */
export type StudyPathNodeState =
  | "notStarted"
  | "recommended"
  | "inProgress"
  | "completed"
  | "mastered";

export type StudyPathMode = "guided" | "free";
