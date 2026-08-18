/**
 * Learner-facing discovery model for Learn and level overview pages.
 *
 * This composes existing curriculum, assessment, progress, and
 * purpose-scoped Listening data. It does not create a second curriculum
 * or write progress.
 */
import { TEST_LEVELS, getTestLevelBySlug, type TestLevelMeta } from "@/constants/testLevels";
import type { Skill } from "@/components/types";
import { getListeningItems } from "@/lib/mock-data/listeningPractice";
import { getPracticeQuestionCount } from "@/lib/mock-data/practiceQuestions";
import { getTestsForLevel, type TestSummary } from "@/lib/mock-data/tests";
import {
  getLessonsForLevel,
  getLevelProgress,
  getProgressCheck,
  type LevelProgress,
} from "@/services/curriculumService";
import { getRecommendedLevelSlug } from "@/services/testsService";

export const LEARNING_AREAS: Array<{
  skill: Skill;
  label: string;
  description: string;
}> = [
  { skill: "grammar", label: "Grammar", description: "Build accurate, flexible sentence patterns." },
  { skill: "vocabulary", label: "Vocabulary", description: "Learn useful words and natural combinations in context." },
  { skill: "listening", label: "Listening", description: "Understand key details in short, level-appropriate audio." },
  { skill: "reading", label: "Reading", description: "Read for detail, inference, attitude, and argument." },
  { skill: "useOfEnglish", label: "Use of English", description: "Apply grammar and vocabulary in exam-style contexts." },
  { skill: "writing", label: "Writing", description: "Develop clear, appropriate written English." },
];

export interface LearningAreaAvailability {
  skill: Skill;
  label: string;
  description: string;
  lessonCount: number;
  guidedQuestionCount: number;
  practiceItemCount: number;
  lessonHref: string | null;
  practiceHref: string | null;
}

export interface LearningLevelOverview {
  meta: TestLevelMeta;
  isRecommended: boolean;
  progress: LevelProgress;
  progressPercentage: number;
  areas: LearningAreaAvailability[];
  tests: TestSummary[];
  hasProgressCheck: boolean;
}

const DISCOVERABLE_LEVELS = TEST_LEVELS.filter((level) => level.cefr !== null);

export async function getLearningLevelDetail(slug: string): Promise<LearningLevelOverview | null> {
  const meta = getTestLevelBySlug(slug);
  if (!meta || meta.cefr === null) return null;

  const [lessons, progress, progressCheck] = await Promise.all([
    getLessonsForLevel(slug),
    getLevelProgress(slug),
    getProgressCheck(slug),
  ]);

  const areas = LEARNING_AREAS.map((area): LearningAreaAvailability => {
    const skillLessons = lessons.filter((lesson) => lesson.skill === area.skill);
    const guidedQuestionCount = skillLessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);
    const listeningItems =
      area.skill === "listening"
        ? getListeningItems({ purpose: "practice", level: slug, playableOnly: true })
        : [];
    const practiceItemCount =
      area.skill === "listening"
        ? listeningItems.length
        : getPracticeQuestionCount(slug, area.skill);
    const practiceAvailable = area.skill === "listening" ? practiceItemCount >= 2 : practiceItemCount >= 3;

    return {
      ...area,
      lessonCount: skillLessons.length,
      guidedQuestionCount,
      practiceItemCount,
      lessonHref: skillLessons[0]
        ? `/tests/${slug}/lessons/${skillLessons[0].id}`
        : null,
      practiceHref: practiceAvailable
        ? `/practice/weakest-skill?skill=${area.skill}&level=${slug}`
        : null,
    };
  });

  return {
    meta,
    isRecommended: getRecommendedLevelSlug() === slug,
    progress,
    progressPercentage: progress.totalCount
      ? Math.round((progress.completedCount / progress.totalCount) * 100)
      : 0,
    areas,
    tests: getTestsForLevel(slug),
    hasProgressCheck: Boolean(progressCheck),
  };
}

export async function getLearningLevels(): Promise<LearningLevelOverview[]> {
  const levels = await Promise.all(DISCOVERABLE_LEVELS.map((level) => getLearningLevelDetail(level.slug)));
  return levels.filter((level): level is LearningLevelOverview => level !== null);
}
