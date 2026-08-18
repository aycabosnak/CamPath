import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import {
  isAnswerCorrect,
  type PlacementAnswerMap,
  type QuestionReviewItem,
} from "@/services/placementTestService";

function formatAnswer(question: PlacementQuestion, answer: unknown): string {
  if (answer === undefined || answer === null || answer === "") {
    return "No answer given";
  }

  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
    case "gap_fill":
      return String(answer);
    case "matching": {
      const given = answer as Record<string, string>;
      return question.left_items
        .map((left) => `${left} → ${given[left] ?? "—"}`)
        .join(", ");
    }
    case "sentence_ordering":
      return Array.isArray(answer) ? answer.join(" → ") : String(answer);
  }
}

function formatCorrectAnswer(question: PlacementQuestion): string {
  switch (question.task_type) {
    case "multiple_choice":
    case "audio_multiple_choice":
    case "gap_fill":
      return question.correct_answer;
    case "matching":
      return question.left_items
        .map((left) => `${left} → ${question.correct_answer[left]}`)
        .join(", ");
    case "sentence_ordering":
      return question.correct_answer.join(" → ");
  }
}

export function buildAssessmentReview(
  questions: PlacementQuestion[],
  answers: PlacementAnswerMap,
  explanations: Record<string, string>
): QuestionReviewItem[] {
  return questions.map((question, index) => ({
    number: index + 1,
    skill: question.skill,
    questionText: question.prompt,
    userAnswerText: formatAnswer(question, answers[question.id]),
    correctAnswerText: formatCorrectAnswer(question),
    isCorrect: isAnswerCorrect(question, answers[question.id]),
    explanation:
      explanations[question.id] ??
      "Review the keyed answer and the language pattern tested in this item.",
    transcript: question.transcript,
  }));
}
