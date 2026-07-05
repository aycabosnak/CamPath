/**
 * types/entities.ts
 *
 * Domain types that mirror the approved Database Schema
 * (campath-database-api-design.md) one-to-one. These are distinct
 * from `components/types.ts`, which holds UI-facing prop unions —
 * a `ReadinessStatus` here is "notReady" | "approaching" | "ready"
 * derived FROM a MockExamSession.overall_result, not the same file,
 * so a schema change and a component prop change are never silently
 * conflated.
 *
 * Field names use snake_case to match API JSON responses directly
 * (see Database & API Design doc, Section 4/5) — no camelCase
 * conversion layer exists yet; add one in lib/api-client if the
 * backend's serializer naming convention differs later.
 */

export type Role = "student" | "teacher" | "parent" | "admin";

export interface User {
  id: string; // UUID
  email: string;
  role: Role;
  display_name: string;
  current_level_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  slug: "grammar" | "vocabulary" | "listening" | "reading" | "useOfEnglish" | "writing";
  name: string;
}

export interface Level {
  id: string;
  slug: "foundation" | "explorer" | "communicator" | "independent" | "advanced" | "master";
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  stage_name: string;
  order: number;
}

export interface Unit {
  id: string;
  level_id: string;
  title: string;
  theme: string;
  order: number;
}

export interface Lesson {
  id: string;
  unit_id: string;
  skill_id: string;
  /** Derived/reference field — see Database & API Design doc Section 2.
   *  MUST stay synchronized with the parent Unit.level_id; never edit
   *  directly without also updating the Unit relation. */
  level_id: string;
  lesson_type: "explanation" | "skill_practice" | "unit_check";
  title: string;
  content_body: unknown; // rich text / JSON block, shape TBD with content team
  order: number;
}

export interface Exercise {
  id: string;
  lesson_id: string | null;
  skill_id: string;
  level_id: string;
  exam_type_id: string | null;
  task_type:
    | "multiple_choice"
    | "gap_fill"
    | "key_word_transformation"
    | "word_formation"
    | "matching"
    | "true_false_not_given"
    | "sentence_ordering"
    | "free_writing"
    | "audio_multiple_choice"
    | "drag_drop_categorization";
  content: unknown;
  correct_answer: unknown;
  timed: boolean;
}

export interface ExamType {
  id: string;
  name: string; // e.g. "B2 First"
  cefr_level_id: string;
  sections: Array<{ id: string; name: string; duration_minutes: number }>;
}

export type ProgressStatus = "not_started" | "in_progress" | "completed" | "mastered";

export interface UserProgress {
  id: number;
  user_id: string;
  lesson_id: string;
  status: ProgressStatus;
  score: number | null;
  updated_at: string;
}

export interface UserExerciseAttempt {
  id: number;
  user_id: string;
  exercise_id: string;
  answer_given: unknown;
  is_correct: boolean;
  attempted_at: string;
}

export interface LevelTestSession {
  id: string;
  user_id: string | null;
  guest_token: string | null;
  started_at: string;
  completed_at: string | null;
  result_level_id: string | null;
  skill_breakdown: Record<Skill["slug"], number> | null;
}

export type ReadinessResult = "not_ready" | "approaching" | "ready";

export interface MockExamSession {
  id: string;
  user_id: string;
  exam_type_id: string;
  started_at: string;
  completed_at: string | null;
  section_scores: Record<string, number>;
  overall_result: ReadinessResult | null;
}

export interface Class {
  id: string;
  teacher_id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface ClassMembership {
  id: number;
  class_id: string;
  student_id: string;
}

export type AssignmentTargetType = "unit" | "exam_type";

export interface Assignment {
  id: string;
  class_id: string;
  assigned_by: string;
  target_type: AssignmentTargetType;
  target_id: string;
  due_date: string;
  created_at: string;
  /** Computed at read-time from UserProgress/MockExamSession — never
   *  stored. See Database & API Design doc Section 2. */
  completion?: { completed: number; total: number };
  is_overdue?: boolean;
}

export type WritingSubmissionStatus = "pending" | "reviewed";

export interface WritingSubmission {
  id: string;
  user_id: string;
  exercise_id: string | null;
  content: string;
  submitted_at: string;
  status: WritingSubmissionStatus;
}

export interface RubricScore {
  id: number;
  writing_submission_id: string;
  reviewer_id: string;
  task_achievement: 1 | 2 | 3 | 4 | 5;
  grammar_range: 1 | 2 | 3 | 4 | 5;
  vocabulary_range: 1 | 2 | 3 | 4 | 5;
  coherence: 1 | 2 | 3 | 4 | 5;
  exam_style: 1 | 2 | 3 | 4 | 5;
  comment: string;
  reviewed_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  level_id: string;
  issued_at: string;
  pdf_url: string;
}

/** Phase 2 — present for type-completeness, not yet used by any UI. */
export interface ParentChildLink {
  id: number;
  parent_id: string;
  child_id: string;
  status: "pending" | "active";
  created_at: string;
}
