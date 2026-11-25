/**
 * services/speechService.ts
 *
 * Listening & Speaking resourcing decision (2026-11): audio is
 * produced in the browser with the Web Speech API — speechSynthesis
 * for Listening, SpeechRecognition for Speaking — instead of recorded
 * audio files. Trade-offs, accepted deliberately:
 *   + zero hosting/recording cost, every level ships audio on day one
 *   + scripts live as plain text next to the questions they serve
 *   - voices vary by browser/OS and can sound synthetic
 *   - SpeechRecognition is Chromium/Safari only (no Firefox) and
 *     needs a network connection in Chrome
 *
 * Every caller MUST handle the "unsupported" case honestly (show the
 * transcript / offer self-check) — never fake a result.
 *
 * This is the only file that touches window.speechSynthesis or
 * SpeechRecognition, so swapping to recorded audio later means
 * changing this file (and AudioLine), not every component.
 */

export interface AudioLine {
  /** Optional speaker label. Lines with different speakers are voiced
   *  with different voices (or pitch, if only one voice exists). */
  speaker?: string;
  text: string;
}

// ---------------------------------------------------------------
// Listening — speech synthesis
// ---------------------------------------------------------------

export function isSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

/** English voices, British first (CamPath prepares for Cambridge exams). */
function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (!isSynthesisSupported()) return [];
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
  const rank = (v: SpeechSynthesisVoice) => (v.lang === "en-GB" ? 0 : v.lang === "en-US" ? 1 : 2);
  return voices.sort((a, b) => rank(a) - rank(b));
}

/** Voices load asynchronously in Chrome — wait briefly for them. */
function voicesReady(): Promise<void> {
  if (!isSynthesisSupported() || window.speechSynthesis.getVoices().length > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
}

let stopRequested = false;

export interface PlayOptions {
  /** 1 = normal; 0.75 is offered as "Slower". */
  rate?: number;
  onLineStart?: (index: number) => void;
}

/**
 * Speaks the lines in order. Resolves when finished (or when stopped).
 * Different speakers get different voices so dialogues are followable.
 */
export async function playLines(lines: AudioLine[], options: PlayOptions = {}): Promise<void> {
  if (!isSynthesisSupported()) return;
  await voicesReady();
  window.speechSynthesis.cancel();
  stopRequested = false;

  const voices = getEnglishVoices();
  const speakers = Array.from(new Set(lines.map((l) => l.speaker ?? "")));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const speakerIndex = speakers.indexOf(line.speaker ?? "");
    // One utterance per sentence: Chrome can silently stop long
    // utterances (~15s) and never fire onend.
    const sentences = line.text.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) ?? [line.text];
    for (let k = 0; k < sentences.length; k++) {
      if (stopRequested) break;
      await new Promise<void>((resolve) => {
        const u = new SpeechSynthesisUtterance(sentences[k].trim());
        u.lang = "en-GB";
        u.rate = options.rate ?? 1;
        if (voices.length > 0) u.voice = voices[speakerIndex % voices.length];
        // Only one voice available: vary pitch so speakers stay distinct.
        if (voices.length <= 1 && speakerIndex > 0) u.pitch = 1.35;
        if (k === 0) u.onstart = () => options.onLineStart?.(i);
        u.onend = () => resolve();
        u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
      });
    }
    if (stopRequested) break;
  }
  stopRequested = false;
}

export function stopPlayback(): void {
  if (!isSynthesisSupported()) return;
  stopRequested = true;
  window.speechSynthesis.cancel();
}

// ---------------------------------------------------------------
// Speaking — speech recognition
// ---------------------------------------------------------------

/* Minimal typings: SpeechRecognition isn't in TypeScript's DOM lib. */
interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface RecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type RecognitionCtor = new () => RecognitionInstance;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export type RecognitionOutcome =
  | { ok: true; transcript: string }
  | { ok: false; reason: "unsupported" | "no-speech" | "not-allowed" | "network" | "other" };

let activeRecognition: RecognitionInstance | null = null;

/** Listens for one utterance and resolves with what was heard. */
export function recognizeOnce(): Promise<RecognitionOutcome> {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return Promise.resolve({ ok: false, reason: "unsupported" });

  return new Promise((resolve) => {
    const rec = new Ctor();
    activeRecognition = rec;
    rec.lang = "en-GB";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    let settled = false;
    const settle = (o: RecognitionOutcome) => {
      if (settled) return;
      settled = true;
      activeRecognition = null;
      resolve(o);
    };
    rec.onresult = (e) => settle({ ok: true, transcript: e.results[0]?.[0]?.transcript ?? "" });
    rec.onerror = (e) => {
      const reason =
        e.error === "no-speech" ? "no-speech" : e.error === "not-allowed" || e.error === "service-not-allowed" ? "not-allowed" : e.error === "network" ? "network" : "other";
      settle({ ok: false, reason });
    };
    rec.onend = () => settle({ ok: false, reason: "no-speech" });
    try {
      rec.start();
    } catch {
      settle({ ok: false, reason: "other" });
    }
  });
}

export function stopRecognition(): void {
  activeRecognition?.stop();
}

// ---------------------------------------------------------------
// Scoring — pure functions, no browser APIs (unit-testable)
// ---------------------------------------------------------------

const CONTRACTIONS: Record<string, string> = {
  "i'm": "i am", "you're": "you are", "we're": "we are", "they're": "they are", "he's": "he is",
  "she's": "she is", "it's": "it is", "that's": "that is", "there's": "there is",
  "i've": "i have", "you've": "you have", "we've": "we have", "they've": "they have",
  "i'll": "i will", "you'll": "you will", "we'll": "we will", "they'll": "they will",
  "i'd": "i would", "don't": "do not", "doesn't": "does not", "didn't": "did not",
  "can't": "cannot", "won't": "will not", "isn't": "is not", "aren't": "are not",
  "wasn't": "was not", "haven't": "have not", "hasn't": "has not",
  gonna: "going to", wanna: "want to", gotta: "got to",
};

const NUMBERS: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six",
  "7": "seven", "8": "eight", "9": "nine", "10": "ten", "11": "eleven", "12": "twelve",
};

/** Lower-case words, punctuation removed, contractions and small
 *  numbers expanded — so "I've got 3" and "I have got three" match. */
export function normaliseWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)
    .flatMap((w) => (CONTRACTIONS[w] ?? NUMBERS[w] ?? w.replace(/'/g, "")).split(" "));
}

export interface SpeechMatch {
  /** 0–100: share of target words said, in order. */
  score: number;
  /** Target words (display form) with whether each was matched. */
  words: Array<{ word: string; matched: boolean }>;
}

/**
 * Longest-common-subsequence match between the target sentence and
 * the transcript. Order matters (so a scrambled sentence scores low)
 * but extra filler words ("um") don't cost anything.
 */
export function matchSpeech(target: string, transcript: string): SpeechMatch {
  const displayWords = target.split(/\s+/).filter(Boolean);
  // Map each display word to its normalised parts, tracking ownership.
  const owner: number[] = [];
  const t: string[] = [];
  displayWords.forEach((dw, i) => {
    for (const part of normaliseWords(dw)) {
      t.push(part);
      owner.push(i);
    }
  });
  const s = normaliseWords(transcript);

  const dp: number[][] = Array.from({ length: t.length + 1 }, () => new Array(s.length + 1).fill(0));
  for (let i = t.length - 1; i >= 0; i--) {
    for (let j = s.length - 1; j >= 0; j--) {
      dp[i][j] = t[i] === s[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const matchedParts = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < t.length && j < s.length) {
    if (t[i] === s[j]) {
      matchedParts.add(i);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }

  const words = displayWords.map((word, idx) => {
    const parts = owner.map((o, k) => (o === idx ? k : -1)).filter((k) => k >= 0);
    return { word, matched: parts.length > 0 && parts.every((k) => matchedParts.has(k)) };
  });
  const score = t.length === 0 ? 0 : Math.round((matchedParts.size / t.length) * 100);
  return { score, words };
}

/** At or above this score, an attempt counts as a good match. */
export const SPEECH_MATCH_THRESHOLD = 80;
