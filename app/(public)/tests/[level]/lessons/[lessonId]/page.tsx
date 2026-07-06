"use client";

/**
 * app/(public)/tests/[level]/lessons/[lessonId]/page.tsx
 *
 * A real dynamic route (not a static folder per lesson, unlike the
 * earlier unit-1/2/3 pattern) — this is the reference template
 * specifically built to scale to A2 through C1 without creating new
 * files per level or per lesson.
 */
import { useParams } from "next/navigation";
import { CurriculumLessonView } from "@/components/curriculum/CurriculumLessonView";

export default function CurriculumLessonPage() {
  const params = useParams<{ level: string; lessonId: string }>();
  return <CurriculumLessonView levelSlug={params.level} lessonId={params.lessonId} />;
}
