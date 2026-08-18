"use client";

/**
 * components/audio/AudioPlayer.tsx
 *
 * Shared HTML5 audio player for Listening items — Practice, lessons,
 * Mixed Tests, Progress Checks, and Placement. No third-party library.
 * Callers pass a public `src`; this component never invents or fakes
 * playback. Missing/unreadable files surface as an honest error state.
 *
 * Autoplay is intentionally not used.
 *
 * Optional `maxPlays` is a generic playback allowance — Placement is
 * the only caller that sets it. Practice and other surfaces omit it
 * and remain unlimited.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type AudioStatus = "loading" | "ready" | "error";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  label = "Listening clip",
  maxPlays,
  playsUsed = 0,
  onPlayAttempt,
}: {
  src: string;
  label?: string;
  /** When set, starting a new listen from the beginning counts toward this cap. */
  maxPlays?: number;
  playsUsed?: number;
  onPlayAttempt?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const positionId = useId();
  const playbackCountedRef = useRef(false);
  const attemptLockRef = useRef(false);
  const [status, setStatus] = useState<AudioStatus>(src ? "loading" : "error");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState(
    src ? null : "No audio file is linked to this question."
  );

  const limited = maxPlays !== undefined;
  const canStartNewPlay = !limited || playsUsed < maxPlays;
  const limitReached = limited && playsUsed >= maxPlays;

  useEffect(() => {
    const audio = audioRef.current;
    playbackCountedRef.current = false;
    attemptLockRef.current = false;

    if (!src || !audio) {
      setStatus("error");
      setErrorMessage("No audio file is linked to this question.");
      return;
    }

    const el: HTMLAudioElement = audio;

    setStatus("loading");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setErrorMessage(null);

    function onLoadedMetadata() {
      if (!Number.isFinite(el.duration) || el.duration === Infinity) return;
      setDuration(el.duration);
      setStatus("ready");
    }

    function onCanPlay() {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
        setStatus("ready");
      }
    }

    function onTimeUpdate() {
      setCurrentTime(el.currentTime);
    }

    function onEnded() {
      setIsPlaying(false);
      playbackCountedRef.current = false;
    }

    function onError() {
      setStatus("error");
      setIsPlaying(false);
      setErrorMessage("This clip could not be loaded. The audio file may be missing.");
    }

    function onPlay() {
      setIsPlaying(true);
    }

    function onPause() {
      setIsPlaying(false);
    }

    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.load();

    return () => {
      el.pause();
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [src]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio || status !== "ready") return;
    if (isPlaying) {
      audio.pause();
      return;
    }

    const needsNewAttempt = limited && !playbackCountedRef.current;
    if (needsNewAttempt && !canStartNewPlay) return;
    if (needsNewAttempt) {
      if (attemptLockRef.current) return;
      attemptLockRef.current = true;
    }

    try {
      await audio.play();
      if (needsNewAttempt) {
        playbackCountedRef.current = true;
        onPlayAttempt?.();
      }
    } catch {
      setStatus("error");
      setErrorMessage("The browser could not play this clip.");
    } finally {
      attemptLockRef.current = false;
    }
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio || status !== "ready") return;

    if (isPlaying) {
      if (limited && !canStartNewPlay) return;
      if (limited) {
        if (attemptLockRef.current) return;
        attemptLockRef.current = true;
        audio.currentTime = 0;
        setCurrentTime(0);
        playbackCountedRef.current = true;
        onPlayAttempt?.();
        attemptLockRef.current = false;
        return;
      }
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    audio.currentTime = 0;
    setCurrentTime(0);
    if (limited) playbackCountedRef.current = false;
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || status !== "ready") return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  const playDisabled = Boolean(limited && !isPlaying && !playbackCountedRef.current && !canStartNewPlay);
  const restartDisabled = Boolean(limited && !canStartNewPlay);

  return (
    <div className="audio-player card" role="group" aria-label={label}>
      <audio ref={audioRef} src={src || undefined} preload="metadata" hidden />

      {status === "loading" && (
        <p className="text-small text-ink-soft" aria-live="polite">
          Loading audio…
        </p>
      )}

      {status === "error" && (
        <p className="text-small" style={{ color: "var(--color-brick)" }} role="alert">
          {errorMessage}
        </p>
      )}

      {status === "ready" && (
        <>
          {limited && (
            <p className="text-caption mb-3" aria-live="polite">
              Plays: {playsUsed} / {maxPlays}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button
              variant="primary"
              size="sm"
              onClick={togglePlay}
              disabled={playDisabled}
              aria-label={isPlaying ? "Pause audio" : playDisabled ? "Play audio, listening limit reached" : "Play audio"}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={restart}
              disabled={restartDisabled}
              aria-label={restartDisabled ? "Restart audio, listening limit reached" : "Restart audio from the beginning"}
            >
              Restart
            </Button>
            <span className="text-data text-small audio-player-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <label className="sr-only" htmlFor={positionId}>
            Playback position
          </label>
          <input
            id={positionId}
            className="audio-player-seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            onChange={(e) => seek(Number(e.target.value))}
          />

          {limitReached && (
            <p className="text-small text-ink-soft mt-3" role="status">
              Listening limit reached — you have used both plays.
            </p>
          )}
        </>
      )}
    </div>
  );
}
