/**
 * services/learnPreviewService.ts
 *
 * Deliberately thin — this sprint is one guided Unit/Lesson preview,
 * not the full Learn module (Design Review Report: stop expanding
 * architecture). Reads the learner's stage from the same placement
 * result My Journey already uses, so the prototype feels connected
 * rather than generic.
 */
import { getLessonContentForStage, type LessonPrototype } from "@/lib/mock-data/lessonPrototype";
import type { StageName } from "@/components/types";

const RESULTS_STORAGE_KEY = "campath_level_test_result";

export interface LearnPreviewUnit {
  stage: StageName;
  unitTitle: string;
  lesson: LessonPrototype;
}

function readStage(): StageName {
  if (typeof window === "undefined") return "Communicator";
  const raw = window.localStorage.getItem(RESULTS_STORAGE_KEY);
  if (!raw) return "Communicator";
  try {
    return (JSON.parse(raw).stage as StageName) ?? "Communicator";
  } catch {
    return "Communicator";
  }
}

export async function getLearnPreviewUnit(): Promise<LearnPreviewUnit> {
  const stage = readStage();
  const lesson = getLessonContentForStage(stage);
  return {
    stage,
    unitTitle: `Unit 1 · ${lesson.title}`,
    lesson,
  };
}
