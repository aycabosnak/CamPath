/**
 * constants/routes.ts
 *
 * Central path constants so route strings never get hand-typed (and
 * silently drift) across nav components, redirects, and middleware.
 * Mirrors the folder scaffold exactly — if a route here doesn't
 * match an actual file under app/, that's a bug to fix immediately.
 */
export const ROUTES = {
  home: "/",
  levelTest: "/level-test",
  levelTestTake: "/level-test/take",
  levelTestResults: "/level-test/results",
  learn: "/learn",
  practice: "/practice",
  practiceExams: "/practice/exams",
  exams: "/exams",
  resources: "/resources",
  myJourney: "/my-journey",
  studyPath: (level: string) => `/my-journey/study-path/${level}`,
  certificates: "/my-journey/certificates",
  writingSubmit: "/writing/submit",
  login: "/login",
  teacherDashboard: "/teacher/dashboard",
  teacherClasses: "/teacher/classes",
  teacherAssignments: "/teacher/assignments",
  teacherWritingQueue: "/teacher/writing-submissions",
  teacherReports: "/teacher/reports",
  designSystem: "/design-system", // internal only — blocked in production by middleware.ts
} as const;
