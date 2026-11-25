"use client";

/**
 * components/audio/ListenPlayer.tsx
 *
 * Plays a Listening script through services/speechService (browser
 * text-to-speech). Used by Listening lessons, Mixed Tests, Progress
 * Checks and the Placement Test — one player, one behaviour.
 *
 * Honesty rules (same spirit as the old "never fake audio" rule):
 * - If the browser can't speak, say so and show the transcript
 *   instead, so the learner can still do the task as reading.
 * - The transcript is otherwise hidden until `allowTranscript` is
 *   true (e.g. after an answer is checked) — showing it earlier would
 *   turn a listening task into a reading task.
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { isSynthesisSupported, playLines, stopPlayback, type AudioLine } from "@/services/speechService";

export function ListenPlayer({
  lines,
  allowTranscript = false,
  label = "Listen",
}: {
  lines: AudioLine[];
  allowTranscript?: boolean;
  label?: string;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [plays, setPlays] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    setSupported(isSynthesisSupported());
    return () => stopPlayback();
  }, []);

  // A new script (next question) resets the player.
  const scriptKey = lines.map((l) => l.text).join("|");
  useEffect(() => {
    stopPlayback();
    setPlaying(false);
    setPlays(0);
    setShowTranscript(false);
  }, [scriptKey]);

  async function play() {
    setPlaying(true);
    setPlays((n) => n + 1);
    await playLines(lines, { rate: slow ? 0.75 : 1 });
    setPlaying(false);
  }

  function stop() {
    stopPlayback();
    setPlaying(false);
  }

  const transcriptVisible = supported === false || (allowTranscript && showTranscript);
  const hasSpeakers = lines.some((l) => l.speaker);

  return (
    <div className="card mb-6">
      <p className="card-eyebrow mb-3">🎧 {label}</p>

      {supported === false && (
        <p className="text-small text-ink-soft mb-3">
          Your browser can&apos;t play spoken audio, so the transcript is shown instead. For real listening
          practice, try Chrome, Edge or Safari.
        </p>
      )}

      {supported && (
        <div className="flex flex-wrap items-center gap-3 mb-1">
          {!playing ? (
            <Button variant="primary" onClick={play} aria-label={plays === 0 ? "Play audio" : "Play audio again"}>
              {plays === 0 ? "▶ Play" : "↻ Play again"}
            </Button>
          ) : (
            <Button variant="secondary" onClick={stop} aria-label="Stop audio">
              ■ Stop
            </Button>
          )}
          <label className="text-small text-ink-soft flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} disabled={playing} />
            Slower
          </label>
          {plays > 0 && <span className="text-caption">Played {plays}×</span>}
        </div>
      )}

      {supported && allowTranscript && (
        <button
          type="button"
          className="text-small text-ink-soft underline mt-3"
          onClick={() => setShowTranscript((v) => !v)}
        >
          {showTranscript ? "Hide transcript" : "Show transcript"}
        </button>
      )}

      {transcriptVisible && (
        <div className="mt-3" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {lines.map((line, i) => (
            <p key={i} className="text-body" style={{ fontStyle: "italic" }}>
              {hasSpeakers && line.speaker ? <strong style={{ fontStyle: "normal" }}>{line.speaker}: </strong> : null}
              {line.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
