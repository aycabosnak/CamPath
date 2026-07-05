import type { StudyPathNodeData } from "@/components/study-path/StudyPath";

export const MOCK_STUDY_PATH_NODES: StudyPathNodeData[] = [
  { id: "u1", order: 1, state: "completed", title: "Unit 1 · Introductions", subtitle: "Completed" },
  { id: "u2", order: 2, state: "mastered", title: "Unit 2 · Daily Routines", subtitle: "Mastered" },
  { id: "u3", order: 3, state: "inProgress", title: "Unit 3 · Future Plans", subtitle: "In progress" },
  { id: "u4", order: 4, state: "recommended", title: "Unit 4 · Talking About the Past", subtitle: "Recommended next" },
  { id: "u5", order: 5, state: "notStarted", title: "Unit 5 · Giving Opinions", subtitle: "Not started · available anytime" },
];
