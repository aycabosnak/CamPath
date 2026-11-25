"use client";

/**
 * components/audio/SpeakingPractice.tsx
 *
 * Listen & Repeat speaking practice — the first two steps of the
 * Listen / Repeat / Shadow / Record framework from early planning.
 * For each prompt the learner:
 *   1. hears a model sentence (speech synthesis),
 *   2. says it (speech recognition),
 *   3. sees which words were recognised and a match score.
 *
 * What this does and does NOT measure, stated plainly: it checks
 * whether the browser recognised the right words in the right order.
 * That's a useful signal for clarity and accuracy, but it is NOT a
 * pronunciation or fluency grade — recognisers forgive accents and
 * can mishear clear speech. That's why Speaking never feeds Mastery
 * by Skill and never appears in Mixed Tests or Progress Checks.
 *
 * If recognition isn't available (Firefox, blocked microphone), the
 * learner says the sentence aloud and marks it done themselves —
 * honest self-check, never a fake score.
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ListenPlayer } from "@/components/audio/ListenPlayer";
import {
  isRecognitionSupported,
  recognizeOnce,
  stopRecognition,
  matchSpeech,
  SPEECH_MATCH_THRESHOLD,
  type SpeechMatch,
} from "@/services/speechService";

export interface SpeakingPrompt {
  text: string;
  /** Short coaching note shown with the prompt (stress, linking...). */
  tip?: string;
}

type Attempt =
  | { kind: "result"; transcript: string; match: SpeechMatch }
  | { kind: "error"; message: string }
  | { kind: "selfCheck" };

const ERROR_MESSAGES: Record<string, string> = {
  "no-speech": "We didn't hear anything. Check your microphone and try again.",
  "not-allowed": "Microphone access is blocked. Allow it in your browser, or say the sentence aloud and mark it yourself.",
  network: "Speech recognition needs an internet connection. Try again, or mark it yourself.",
  other: "Something went wrong with speech recognition. Try again, or mark it yourself.",
};

export function SpeakingPractice({
  prompts,
  onComplete,
}: {
  prompts: SpeakingPrompt[];
  /** allGood = every prompt reached the match threshold on its first
   *  recognised attempt (self-checked prompts don't count as "good"). */
  onComplete: (allGood: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [firstTryGood, setFirstTryGood] = useState<boolean[]>([]);

  useEffect(() => {
    setRecognitionSupported(isRecognitionSupported());
    return () => stopRecognition();
  }, []);

  const prompt = prompts[index];
  const total = prompts.length;
  const done =
    attempt?.kind === "selfCheck" || (attempt?.kind === "result" && attempt.match.score >= SPEECH_MATCH_THRESHOLD);

  async function record() {
    setListening(true);
    setAttempt(null);
    const outcome = await recognizeOnce();
    setListening(false);
    if (!outcome.ok) {
      if (outcome.reason === "unsupported") setRecognitionSupported(false);
      setAttempt({ kind: "error", message: ERROR_MESSAGES[outcome.reason] ?? ERROR_MESSAGES.other });
      return;
    }
    const match = matchSpeech(prompt.text, outcome.transcript);
    setAttempt({ kind: "result", transcript: outcome.transcript, match });
    setFirstTryGood((prev) => {
      if (prev[index] !== undefined) return prev; // only the first recognised attempt counts
      const next = [...prev];
      next[index] = match.score >= SPEECH_MATCH_THRESHOLD;
      return next;
    });
  }

  function selfCheck() {
    setAttempt({ kind: "selfCheck" });
    setFirstTryGood((prev) => {
      if (prev[index] !== undefined) return prev;
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }

  function next() {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setAttempt(null);
    } else {
      onComplete(prompts.every((_, i) => firstTryGood[i] === true));
    }
  }

  return (
    <div>
      <ProgressBar
        value={Math.round((index / total) * 100)}
        label={`Speaking Practice — Sentence ${index + 1} of ${total}`}
      />

      <div className="mt-6 mb-6">
        <p className="card-eyebrow mb-2">Say this sentence</p>
        <p className="text-h3 mb-2">{prompt.text}</p>
        {prompt.tip && <p className="text-small text-ink-soft mb-4">Tip: {prompt.tip}</p>}

        <ListenPlayer lines={[{ text: prompt.text }]} label="1 · Listen to the model" allowTranscript={false} />

        <div className="card mb-6">
          <p className="card-eyebrow mb-3">🎙️ 2 · Your turn</p>
          {recognitionSupported === false ? (
            <>
              <p className="text-small text-ink-soft mb-3">
                Your browser can&apos;t check speech automatically. Say the sentence aloud — ideally twice —
                then mark it as done.
              </p>
              <Button variant="secondary" onClick={selfCheck} disabled={attempt?.kind === "selfCheck"}>
                ✓ I said it aloud
              </Button>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {!listening ? (
                <Button variant="primary" onClick={record} disabled={done}>
                  {attempt ? "🎙️ Try again" : "🎙️ Start speaking"}
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => stopRecognition()}>
                  ■ Listening… tap to stop
                </Button>
              )}
              {attempt?.kind === "error" && (
                <Button variant="tertiary" onClick={selfCheck}>
                  Mark it myself
                </Button>
              )}
            </div>
          )}
        </div>

        {attempt?.kind === "error" && (
          <Card className="mb-6">
            <p className="text-body">{attempt.message}</p>
          </Card>
        )}

        {attempt?.kind === "result" && (
          <Card className="mb-6">
            <p className="card-eyebrow mb-2">We heard</p>
            <p className="text-body mb-3" style={{ fontStyle: "italic" }}>
              &ldquo;{attempt.transcript || "…"}&rdquo;
            </p>
            <p className="text-body mb-3" aria-label="Word-by-word match">
              {attempt.match.words.map((w, i) => (
                <span
                  key={i}
                  style={{
                    marginRight: "6px",
                    color: w.matched ? "var(--color-pine)" : "var(--color-brick)",
                    textDecoration: w.matched ? "none" : "underline",
                  }}
                >
                  {w.word}
                </span>
              ))}
            </p>
            <p className="text-body">
              {attempt.match.score >= SPEECH_MATCH_THRESHOLD
                ? `✓ Clear match (${attempt.match.score}%). Well done.`
                : `${attempt.match.score}% match — the underlined words weren't recognised. Listen again and have another go.`}
            </p>
          </Card>
        )}

        {attempt?.kind === "selfCheck" && (
          <Card className="mb-6">
            <p className="text-body">Marked as practised. Saying it aloud is what counts.</p>
          </Card>
        )}
      </div>

      <Button variant="primary" size="lg" disabled={!done && attempt?.kind !== "result"} onClick={next}>
        {index < total - 1 ? "Next Sentence" : "Complete Lesson"}
      </Button>
      {attempt?.kind === "result" && !done && (
        <p className="text-caption mt-2">You can move on anyway — nothing is locked.</p>
      )}
    </div>
  );
}
