import type { QuestionReviewItem } from "@/services/placementTestService";
import { Badge, SkillBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

function splitPrompt(prompt: string): {
  passage: string | null;
  questionText: string;
} {
  const separator = prompt.indexOf("\n\n");
  if (separator === -1) return { passage: null, questionText: prompt };
  return {
    passage: prompt.slice(0, separator),
    questionText: prompt.slice(separator + 2),
  };
}

function ReviewItem({ item }: { item: QuestionReviewItem }) {
  const { passage, questionText } = splitPrompt(item.questionText);

  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${
          item.isCorrect ? "var(--color-pine)" : "var(--color-sage)"
        }`,
      }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-caption">Question {item.number}</span>
        <SkillBadge skill={item.skill} />
        <Badge tone={item.isCorrect ? "pine" : "sage"} className="ml-auto">
          {item.isCorrect ? "Correct" : "Needs Review"}
        </Badge>
      </div>

      {passage && (
        <p className="text-small text-ink-soft mb-3">{passage}</p>
      )}
      <p className="text-body mb-4 break-words min-w-0">{questionText}</p>

      <div className="flex flex-col gap-1 mb-4">
        <p className="text-small">
          <span className="text-ink-soft">Your answer: </span>
          {item.userAnswerText}
        </p>
        <p className="text-small">
          <span className="text-ink-soft">Correct answer: </span>
          {item.correctAnswerText}
        </p>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--color-line)",
          paddingTop: "12px",
        }}
      >
        <p className="card-eyebrow mb-1">Why</p>
        <p className="text-small text-ink-soft">{item.explanation}</p>
      </div>

      {item.transcript && (
        <div
          style={{
            borderTop: "1px solid var(--color-line)",
            paddingTop: "12px",
            marginTop: "12px",
          }}
        >
          <p className="card-eyebrow mb-1">Transcript</p>
          <p className="text-small text-ink-soft">{item.transcript}</p>
        </div>
      )}
    </div>
  );
}

export function AssessmentReview({
  items,
  title = "Question review",
}: {
  items: QuestionReviewItem[];
  title?: string;
}) {
  const correctCount = items.filter((item) => item.isCorrect).length;
  const needsReview = items.length - correctCount;

  return (
    <Card className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="card-eyebrow mb-1">Feedback</p>
          <h2 className="text-h2">{title}</h2>
        </div>
        <p className="text-small text-ink-soft">
          {correctCount} correct · {needsReview} to review
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <ReviewItem key={item.number} item={item} />
        ))}
      </div>
    </Card>
  );
}
