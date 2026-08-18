import * as fs from "node:fs";
import * as path from "node:path";
import Module from "node:module";
import * as ts from "typescript";

type Skill =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "reading"
  | "useOfEnglish"
  | "writing";

type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type ContentPurpose =
  | "lesson"
  | "legacy_lesson"
  | "practice"
  | "placement"
  | "mixed_test"
  | "progress_check";

type TaskType =
  | "multiple_choice"
  | "audio_multiple_choice"
  | "gap_fill"
  | "matching"
  | "sentence_ordering";

interface QuestionLike {
  id: string;
  skill: string;
  task_type: string;
  cefr_weight: string;
  prompt: string;
  options?: string[];
  correct_answer: unknown;
  left_items?: string[];
  right_options?: string[];
  shuffled_items?: string[];
  audio_src?: string;
  transcript?: string;
}

interface AudioMetadata {
  purpose: string;
  audioSrc: string;
  audioReady: boolean;
}

interface ContentRecord {
  id: string;
  source: string;
  owner: string;
  purpose: ContentPurpose;
  level: string;
  cefr: string;
  skill: string;
  taskType: string;
  prompt: string;
  explanation: string;
  correctAnswer: unknown;
  options?: string[];
  leftItems?: string[];
  rightOptions?: string[];
  shuffledItems?: string[];
  passage?: string;
  audio?: AudioMetadata;
  rawQuestion: QuestionLike;
}

interface Identity {
  id: string;
  source: string;
}

interface Diagnostic {
  rule: string;
  message: string;
}

interface ListeningItemLike {
  id: string;
  purpose: string;
  level: string;
  cefr_weight: string;
  prompt: string;
  options: string[];
  correct_answer: string;
  audio_src: string;
  transcript: string;
  reviewFeedback: string;
  audioReady: boolean;
}

const ROOT = process.cwd();
const PUBLIC_ROOT = path.join(ROOT, "public");

const ACCEPTED_CEFR = new Set<CefrLevel>(["A1", "A2", "B1", "B2", "C1", "C2"]);
const ACCEPTED_SKILLS = new Set<Skill>([
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "useOfEnglish",
  "writing",
]);
const ACCEPTED_PURPOSES = new Set<ContentPurpose>([
  "lesson",
  "legacy_lesson",
  "practice",
  "placement",
  "mixed_test",
  "progress_check",
]);
const ACCEPTED_LISTENING_PURPOSES = new Set([
  "practice",
  "mixed_test",
  "progress_check",
  "placement",
  "lesson",
]);
const ACCEPTED_TASK_TYPES = new Set<TaskType>([
  "multiple_choice",
  "audio_multiple_choice",
  "gap_fill",
  "matching",
  "sentence_ordering",
]);
const GENERIC_EXPLANATIONS = new Set([
  "this tests a key pattern for this skill at this level.",
  "review the keyed answer and the language pattern tested in this item.",
]);

const errors: Diagnostic[] = [];
const warnings: Diagnostic[] = [];
const records: ContentRecord[] = [];
const identities: Identity[] = [];

function addError(rule: string, message: string): void {
  errors.push({ rule, message });
}

function addWarning(rule: string, message: string): void {
  warnings.push({ rule, message });
}

function collapseWhitespace(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(value: string): string {
  return collapseWhitespace(value).toLowerCase();
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, stableValue(nested)])
    );
  }
  return typeof value === "string" ? normalizeText(value) : value;
}

function stableString(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

function extractPassage(prompt: string): string | undefined {
  const match = prompt.match(/^"([^"]{40,})"\s*(?:-|—)?\s*/);
  return match?.[1]?.trim();
}

function questionSignature(record: ContentRecord): string {
  const answerData =
    record.taskType === "matching"
      ? {
          left: [...(record.leftItems ?? [])].map(normalizeText).sort(),
          right: [...(record.rightOptions ?? [])].map(normalizeText).sort(),
          answer: stableValue(record.correctAnswer),
        }
      : record.taskType === "sentence_ordering"
        ? {
            shuffled: [...(record.shuffledItems ?? [])].map(normalizeText).sort(),
            answer: stableValue(record.correctAnswer),
          }
        : {
            options: [...(record.options ?? [])].map(normalizeText).sort(),
            answer: stableValue(record.correctAnswer),
          };

  return stableString({
    taskType: record.taskType,
    prompt: normalizeText(record.prompt),
    answerData,
  });
}

function createQuestionRecord(
  question: QuestionLike,
  context: Omit<
    ContentRecord,
    | "id"
    | "cefr"
    | "skill"
    | "taskType"
    | "prompt"
    | "correctAnswer"
    | "options"
    | "leftItems"
    | "rightOptions"
    | "shuffledItems"
    | "rawQuestion"
  > & { syntheticId?: string }
): ContentRecord {
  return {
    id: context.syntheticId ?? question.id,
    source: context.source,
    owner: context.owner,
    purpose: context.purpose,
    level: context.level,
    cefr: question.cefr_weight,
    skill: question.skill,
    taskType: question.task_type,
    prompt: question.prompt,
    explanation: context.explanation,
    correctAnswer: question.correct_answer,
    options: question.options,
    leftItems: question.left_items,
    rightOptions: question.right_options,
    shuffledItems: question.shuffled_items,
    passage: context.passage ?? extractPassage(question.prompt),
    audio: context.audio,
    rawQuestion: question,
  };
}

function installTypeScriptLoader(): void {
  type ModuleInternals = {
    _resolveFilename: (
      request: string,
      parent: NodeModule | undefined,
      isMain: boolean,
      options?: unknown
    ) => string;
    _extensions: Record<
      string,
      (module: NodeModule & { _compile(content: string, filename: string): void }, filename: string) => void
    >;
  };

  const internals = Module as unknown as ModuleInternals;
  const originalResolve = internals._resolveFilename;

  internals._resolveFilename = function resolveWorkspaceAlias(
    request,
    parent,
    isMain,
    options
  ): string {
    const resolvedRequest = request.startsWith("@/")
      ? path.join(ROOT, request.slice(2))
      : request;
    return originalResolve.call(this, resolvedRequest, parent, isMain, options);
  };

  internals._extensions[".ts"] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
      fileName: filename,
    }).outputText;
    module._compile(output, filename);
  };
}

function loadWorkspaceModule<T>(relativePath: string): T {
  return require(path.join(ROOT, relativePath)) as T;
}

function addIdentity(id: string, source: string): void {
  identities.push({ id, source });
}

function inferLegacySkill(title: string): Skill {
  if (title.startsWith("Grammar")) return "grammar";
  if (title.startsWith("Vocabulary")) return "vocabulary";
  return "writing";
}

function collectContent(): {
  isAnswerCorrect: (question: QuestionLike, answer: unknown) => boolean;
  levelCefr: Map<string, string>;
  listeningItems: ListeningItemLike[];
  placementQuestions: QuestionLike[];
} {
  installTypeScriptLoader();

  const curriculum = loadWorkspaceModule<{
    CURRICULUM_LESSONS: Record<
      string,
      Array<{
        id: string;
        level: string;
        skill: Skill;
        questions: Array<{
          prompt: string;
          options: string[];
          correctAnswer: string;
          reviewFeedback: string;
        }>;
        passage?: string;
      }>
    >;
    getCurriculumLesson(level: string, id: string): unknown;
  }>("lib/mock-data/curriculumLessons.ts");

  const practice = loadWorkspaceModule<{
    getPracticeQuestionItems(
      level: string,
      skill: Skill
    ): Array<{ question: QuestionLike; explanation: string }>;
  }>("lib/mock-data/practiceQuestions.ts");

  const listening = loadWorkspaceModule<{
    LISTENING_ITEMS: ListeningItemLike[];
  }>("lib/mock-data/listeningPractice.ts");

  const placement = loadWorkspaceModule<{
    PLACEMENT_QUESTIONS: QuestionLike[];
  }>("lib/mock-data/placementQuestions.ts");

  const tests = loadWorkspaceModule<{
    getTestsForLevel(level: string): Array<{
      id: string;
      title: string;
      status: "available" | "coming_soon";
    }>;
    getTestContent(
      level: string,
      id: string
    ): {
      id: string;
      status: string;
      hasListeningPlaceholder: boolean;
      sections: Array<{ skill: Skill; questions: QuestionLike[] }>;
    } | null;
  }>("lib/mock-data/tests.ts");

  const progress = loadWorkspaceModule<{
    getProgressCheck(level: string): {
      level: string;
      title: string;
      questions: QuestionLike[];
    } | null;
  }>("lib/mock-data/progressChecks.ts");

  const units = loadWorkspaceModule<{
    UNIT_LESSONS: Record<
      string,
      {
        unitSlug: string;
        title: string;
        question: {
          prompt: string;
          options: string[];
          correctAnswer: string;
          reviewFeedback: string;
        };
      }
    >;
  }>("lib/mock-data/unitLessons.ts");

  const levelMetadata = loadWorkspaceModule<{
    TEST_LEVELS: Array<{ slug: string; cefr: string | null }>;
  }>("constants/testLevels.ts");

  const assessmentExplanations = loadWorkspaceModule<{
    MIXED_TEST_EXPLANATIONS: Record<string, string>;
    PROGRESS_CHECK_EXPLANATIONS: Record<string, string>;
  }>("lib/mock-data/assessmentExplanations.ts");

  const placementService = loadWorkspaceModule<{
    isAnswerCorrect(question: QuestionLike, answer: unknown): boolean;
    computeResults(
      questions: QuestionLike[],
      answers: Record<string, unknown>
    ): { questionReview: Array<{ explanation: string }> };
  }>("services/placementTestService.ts");

  const levelCefr = new Map(
    levelMetadata.TEST_LEVELS.filter(
      (level): level is { slug: string; cefr: string } => level.cefr !== null
    ).map((level) => [level.slug, level.cefr])
  );

  for (const level of levelMetadata.TEST_LEVELS) {
    addIdentity(`level:${level.slug}`, "constants/testLevels.ts");
  }

  for (const [level, lessons] of Object.entries(curriculum.CURRICULUM_LESSONS)) {
    for (const lesson of lessons) {
      addIdentity(lesson.id, `curriculum lesson ${level}`);
      if (lesson.level !== level) {
        addError(
          "route-alignment",
          `${lesson.id} declares level '${lesson.level}' but is stored under '${level}'.`
        );
      }
      if (curriculum.getCurriculumLesson(level, lesson.id) !== lesson) {
        addError(
          "route-alignment",
          `${lesson.id} cannot be resolved through its level route '${level}'.`
        );
      }

      lesson.questions.forEach((question, index) => {
        const normalized: QuestionLike = {
          id: `${lesson.id}-q${index}`,
          skill: lesson.skill,
          task_type: "multiple_choice",
          cefr_weight: levelCefr.get(level) ?? "",
          prompt: question.prompt,
          options: question.options,
          correct_answer: question.correctAnswer,
        };
        records.push(
          createQuestionRecord(normalized, {
            source: `lib/mock-data/curriculumLessons.ts:${lesson.id}:q${index}`,
            owner: `lesson:${lesson.id}`,
            purpose: "lesson",
            level,
            explanation: question.reviewFeedback,
            passage: lesson.passage,
          })
        );
      });
    }
  }

  for (const [unitSlug, unit] of Object.entries(units.UNIT_LESSONS)) {
    addIdentity(`legacy-lesson:${unitSlug}`, `legacy lesson ${unitSlug}`);
    const staticRoute = path.join(
      ROOT,
      "app",
      "(public)",
      "learn",
      unitSlug,
      "page.tsx"
    );
    if (unit.unitSlug !== unitSlug || !fs.existsSync(staticRoute)) {
      addError(
        "route-alignment",
        `Legacy lesson '${unitSlug}' does not align with an existing static route.`
      );
    }
    const skill = inferLegacySkill(unit.title);
    const normalized: QuestionLike = {
      id: `legacy:${unitSlug}:q0`,
      skill,
      task_type: "multiple_choice",
      cefr_weight: "B1",
      prompt: unit.question.prompt,
      options: unit.question.options,
      correct_answer: unit.question.correctAnswer,
    };
    records.push(
      createQuestionRecord(normalized, {
        source: `lib/mock-data/unitLessons.ts:${unitSlug}`,
        owner: `legacy-lesson:${unitSlug}`,
        purpose: "legacy_lesson",
        level: "legacy",
        explanation: unit.question.reviewFeedback,
      })
    );
  }

  for (const [level] of levelCefr) {
    for (const skill of ACCEPTED_SKILLS) {
      for (const item of practice.getPracticeQuestionItems(level, skill)) {
        records.push(
          createQuestionRecord(item.question, {
            source: `lib/mock-data/practiceQuestions.ts:${level}:${skill}`,
            owner: `practice:${level}:${skill}`,
            purpose: "practice",
            level,
            explanation: item.explanation,
          })
        );
      }
    }
  }

  for (const item of listening.LISTENING_ITEMS) {
    const question: QuestionLike = {
      id: item.id,
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: item.cefr_weight,
      prompt: item.prompt,
      options: item.options,
      correct_answer: item.correct_answer,
      audio_src: item.audio_src,
      transcript: item.transcript,
    };
    records.push(
      createQuestionRecord(question, {
        source: `lib/mock-data/listeningPractice.ts:${item.id}`,
        owner: `listening:${item.purpose}:${item.level}`,
        purpose: item.purpose as ContentPurpose,
        level: item.level,
        explanation: item.reviewFeedback,
        audio: {
          purpose: item.purpose,
          audioSrc: item.audio_src,
          audioReady: item.audioReady,
        },
      })
    );
  }

  const goldenPlacementAnswers = Object.fromEntries(
    placement.PLACEMENT_QUESTIONS.map((question) => [
      question.id,
      question.correct_answer,
    ])
  );
  const placementReview = placementService.computeResults(
    placement.PLACEMENT_QUESTIONS,
    goldenPlacementAnswers
  ).questionReview;

  placement.PLACEMENT_QUESTIONS.forEach((question, index) => {
    if (question.task_type === "audio_multiple_choice") return;
    records.push(
      createQuestionRecord(question, {
        source: `lib/mock-data/placementQuestions.ts:${question.id}`,
        owner: "placement",
        purpose: "placement",
        level: "placement",
        explanation: placementReview[index]?.explanation ?? "",
      })
    );
  });

  for (const [level] of levelCefr) {
    for (const summary of tests.getTestsForLevel(level)) {
      addIdentity(
        `mixed-test:${level}:${summary.id}`,
        `Mixed Test route ${level}/${summary.id}`
      );
      const content = tests.getTestContent(level, summary.id);
      if (summary.status === "coming_soon") {
        if (content !== null) {
          addError(
            "route-alignment",
            `Coming Soon test '${level}/${summary.id}' resolves as available content.`
          );
        }
        continue;
      }
      if (!content) {
        addError(
          "route-alignment",
          `Available test '${level}/${summary.id}' has no route content.`
        );
        continue;
      }
      for (const section of content.sections) {
        for (const question of section.questions) {
          if (question.skill !== section.skill) {
            addError(
              "route-alignment",
              `${question.id} declares skill '${question.skill}' inside '${section.skill}' section.`
            );
          }
          records.push(
            createQuestionRecord(question, {
              source: `lib/mock-data/tests.ts:${level}:${summary.id}:${question.id}`,
              owner: `mixed-test:${level}:${summary.id}`,
              purpose: "mixed_test",
              level,
              explanation:
                assessmentExplanations.MIXED_TEST_EXPLANATIONS[question.id] ?? "",
            })
          );
        }
      }
    }

    const check = progress.getProgressCheck(level);
    addIdentity(`progress-check:${level}`, `Progress Check route ${level}`);
    if (!check || check.level !== level) {
      addError(
        "route-alignment",
        `Progress Check for '${level}' is missing or declares the wrong level.`
      );
    } else {
      for (const question of check.questions) {
        records.push(
          createQuestionRecord(question, {
            source: `lib/mock-data/progressChecks.ts:${level}:${question.id}`,
            owner: `progress-check:${level}`,
            purpose: "progress_check",
            level,
            explanation:
              assessmentExplanations.PROGRESS_CHECK_EXPLANATIONS[question.id] ??
              "",
          })
        );
      }
    }
  }

  return {
    isAnswerCorrect: placementService.isAnswerCorrect,
    levelCefr,
    listeningItems: listening.LISTENING_ITEMS,
    placementQuestions: placement.PLACEMENT_QUESTIONS,
  };
}

function validateIdentities(): void {
  for (const record of records) {
    identities.push({ id: record.id, source: record.source });
  }

  const byId = new Map<string, Identity[]>();
  for (const identity of identities) {
    const id = identity.id.trim();
    if (!id) {
      addError("id-uniqueness", `Missing ID at ${identity.source}.`);
      continue;
    }
    const entries = byId.get(id) ?? [];
    entries.push(identity);
    byId.set(id, entries);
  }

  for (const [id, entries] of byId) {
    if (entries.length > 1) {
      addError(
        "id-uniqueness",
        `Duplicate global/synthetic ID '${id}': ${entries
          .map((entry) => entry.source)
          .join(" | ")}.`
      );
    }
  }
}

function validateRequiredFields(): void {
  for (const record of records) {
    if (!record.prompt?.trim()) {
      addError("required-content", `${record.id} is missing a prompt.`);
    }
    if (!record.explanation?.trim()) {
      addError("required-content", `${record.id} is missing an explanation.`);
    } else if (GENERIC_EXPLANATIONS.has(normalizeText(record.explanation))) {
      addError(
        "required-content",
        `${record.id} uses a generic fallback instead of an authored explanation.`
      );
    }
  }
}

function validateEnums(levelCefr: Map<string, string>): void {
  for (const record of records) {
    if (!ACCEPTED_PURPOSES.has(record.purpose)) {
      addError(
        "accepted-values",
        `${record.id} has unsupported purpose '${record.purpose}'.`
      );
    }
    if (!ACCEPTED_SKILLS.has(record.skill as Skill)) {
      addError(
        "accepted-values",
        `${record.id} has unsupported skill '${record.skill}'.`
      );
    }
    if (!ACCEPTED_CEFR.has(record.cefr as CefrLevel)) {
      addError(
        "accepted-values",
        `${record.id} has unsupported CEFR level '${record.cefr}'.`
      );
    }
    if (!ACCEPTED_TASK_TYPES.has(record.taskType as TaskType)) {
      addError(
        "accepted-values",
        `${record.id} has unsupported task type '${record.taskType}'.`
      );
    }

    if (record.purpose === "placement") {
      if (record.level !== "placement") {
        addError(
          "route-alignment",
          `${record.id} is Placement content but declares level '${record.level}'.`
        );
      }
      continue;
    }
    if (record.purpose === "legacy_lesson") continue;

    const expectedCefr = levelCefr.get(record.level);
    if (!expectedCefr) {
      addError(
        "route-alignment",
        `${record.id} points to unknown learner level route '${record.level}'.`
      );
    } else if (record.cefr !== expectedCefr) {
      addError(
        "route-alignment",
        `${record.id} is under '${record.level}' (${expectedCefr}) but declares CEFR '${record.cefr}'.`
      );
    }
  }
}

function validateAnswerData(
  isAnswerCorrect: (question: QuestionLike, answer: unknown) => boolean
): void {
  for (const record of records) {
    const prefix = `${record.id} (${record.source})`;

    if (record.correctAnswer === undefined || record.correctAnswer === null) {
      addError("answer-validity", `${prefix} is missing correct answer data.`);
      continue;
    }

    if (
      record.taskType === "multiple_choice" ||
      record.taskType === "audio_multiple_choice"
    ) {
      const options = record.options ?? [];
      if (options.length < 2 || options.some((option) => !option.trim())) {
        addError(
          "answer-validity",
          `${prefix} must have at least two non-empty options.`
        );
      }
      // Preserve case: A1 writing items validly contrast "turkey" vs "Turkey".
      if (new Set(options.map(collapseWhitespace)).size !== options.length) {
        addError("answer-validity", `${prefix} contains duplicate options.`);
      }
      if (
        typeof record.correctAnswer !== "string" ||
        !options.includes(record.correctAnswer)
      ) {
        addError(
          "answer-validity",
          `${prefix} has a correct answer that is not one of its options.`
        );
      }
    } else if (record.taskType === "gap_fill") {
      if (
        typeof record.correctAnswer !== "string" ||
        !record.correctAnswer.trim()
      ) {
        addError(
          "answer-validity",
          `${prefix} must have a non-empty string gap-fill answer.`
        );
      }
    } else if (record.taskType === "matching") {
      const left = record.leftItems ?? [];
      const right = record.rightOptions ?? [];
      const answer =
        record.correctAnswer && typeof record.correctAnswer === "object"
          ? (record.correctAnswer as Record<string, string>)
          : null;
      if (!left.length || !right.length || !answer) {
        addError(
          "answer-validity",
          `${prefix} has incomplete matching data.`
        );
      } else {
        const answerKeys = Object.keys(answer);
        if (
          stableString([...answerKeys].sort()) !==
          stableString([...left].sort())
        ) {
          addError(
            "answer-validity",
            `${prefix} matching keys do not exactly match its left items.`
          );
        }
        if (
          Object.values(answer).some((value) => !right.includes(value))
        ) {
          addError(
            "answer-validity",
            `${prefix} maps to a value outside its right-side options.`
          );
        }
      }
    } else if (record.taskType === "sentence_ordering") {
      const shuffled = record.shuffledItems ?? [];
      const answer = Array.isArray(record.correctAnswer)
        ? record.correctAnswer
        : [];
      if (
        !shuffled.length ||
        stableString([...shuffled].sort()) !==
          stableString([...answer].sort())
      ) {
        addError(
          "answer-validity",
          `${prefix} ordering answer is not an exact permutation of its items.`
        );
      }
    }

    if (!isAnswerCorrect(record.rawQuestion, record.correctAnswer)) {
      addError(
        "golden-answer",
        `${prefix} rejects its own golden answer through the shared scorer.`
      );
    }

    if (
      record.taskType === "multiple_choice" ||
      record.taskType === "audio_multiple_choice"
    ) {
      for (const distractor of (record.options ?? []).filter(
        (option) => option !== record.correctAnswer
      )) {
        if (isAnswerCorrect(record.rawQuestion, distractor)) {
          addError(
            "golden-answer",
            `${prefix} incorrectly accepts distractor '${distractor}'.`
          );
        }
      }
    } else if (
      record.taskType === "gap_fill" &&
      isAnswerCorrect(record.rawQuestion, "__campath_intentionally_wrong__")
    ) {
      addError(
        "golden-answer",
        `${prefix} incorrectly accepts a known-wrong gap-fill answer.`
      );
    } else if (record.taskType === "matching") {
      const answer = record.correctAnswer as Record<string, string>;
      const firstKey = Object.keys(answer)[0];
      const wrongValue = (record.rightOptions ?? []).find(
        (value) => value !== answer[firstKey]
      );
      if (
        firstKey &&
        wrongValue &&
        isAnswerCorrect(record.rawQuestion, {
          ...answer,
          [firstKey]: wrongValue,
        })
      ) {
        addError(
          "golden-answer",
          `${prefix} incorrectly accepts a corrupted matching answer.`
        );
      }
    } else if (record.taskType === "sentence_ordering") {
      const answer = record.correctAnswer as string[];
      if (
        answer.length > 1 &&
        isAnswerCorrect(record.rawQuestion, [answer[1], answer[0], ...answer.slice(2)])
      ) {
        addError(
          "golden-answer",
          `${prefix} incorrectly accepts a known-wrong sentence order.`
        );
      }
    }
  }
}

function validateSignatures(): void {
  const bySignature = new Map<string, ContentRecord[]>();
  const byPrompt = new Map<string, ContentRecord[]>();

  for (const record of records) {
    const signature = questionSignature(record);
    const signatureEntries = bySignature.get(signature) ?? [];
    signatureEntries.push(record);
    bySignature.set(signature, signatureEntries);

    const prompt = normalizeText(record.prompt);
    const promptEntries = byPrompt.get(prompt) ?? [];
    promptEntries.push(record);
    byPrompt.set(prompt, promptEntries);
  }

  for (const entries of bySignature.values()) {
    if (entries.length < 2) continue;
    const purposes = new Set(entries.map((entry) => entry.purpose));
    const scope =
      purposes.size > 1 ? "across purposes" : `within '${entries[0].purpose}'`;
    addError(
      "exact-signature",
      `Exact question reuse ${scope}: ${entries
        .map((entry) => `${entry.id} [${entry.purpose}]`)
        .join(" | ")}.`
    );
  }

  for (const [prompt, entries] of byPrompt) {
    if (entries.length < 2) continue;
    const uniqueSignatures = new Set(entries.map(questionSignature));
    if (uniqueSignatures.size < 2) continue;
    addWarning(
      "generic-prompt",
      `Prompt-only repetition '${prompt}': ${entries
        .map((entry) => `${entry.id} [${entry.purpose}]`)
        .join(" | ")}.`
    );
  }
}

function validateConstructOverlap(): void {
  const byConstruct = new Map<string, ContentRecord[]>();
  for (const record of records) {
    const fingerprint = stableString({
      skill: record.skill,
      answer: record.correctAnswer,
    });
    const entries = byConstruct.get(fingerprint) ?? [];
    entries.push(record);
    byConstruct.set(fingerprint, entries);
  }

  for (const entries of byConstruct.values()) {
    const purposes = new Set(entries.map((entry) => entry.purpose));
    if (entries.length < 2 || purposes.size < 2) continue;
    addWarning(
      "construct-overlap",
      `Possible construct overlap for ${entries[0].skill} answer ${stableString(
        entries[0].correctAnswer
      )}: ${entries
        .map((entry) => `${entry.id} [${entry.purpose}]`)
        .join(" | ")}.`
    );
  }
}

function validatePassageReuse(): void {
  const ownershipByPassage = new Map<
    string,
    Map<string, { purpose: ContentPurpose; ids: string[] }>
  >();

  for (const record of records) {
    if (record.skill !== "reading") continue;
    const passage = record.passage?.trim();
    if (!passage || passage.length < 40) continue;
    const key = normalizeText(passage);
    const owners = ownershipByPassage.get(key) ?? new Map();
    const existing = owners.get(record.owner) ?? {
      purpose: record.purpose,
      ids: [],
    };
    existing.ids.push(record.id);
    owners.set(record.owner, existing);
    ownershipByPassage.set(key, owners);
  }

  for (const owners of ownershipByPassage.values()) {
    if (owners.size < 2) continue;
    addWarning(
      "reading-passage-reuse",
      `Reading passage reused by distinct owners: ${[...owners.entries()]
        .map(
          ([owner, value]) =>
            `${owner} [${value.purpose}: ${value.ids.join(", ")}]`
        )
        .join(" | ")}.`
    );
  }
}

function validateAudio(
  listeningItems: ListeningItemLike[],
  placementQuestions: QuestionLike[]
): void {
  const bySource = new Map<string, ContentRecord[]>();
  const byId = new Map(listeningItems.map((item) => [item.id, item]));
  const audioRecords = records.filter(
    (record): record is ContentRecord & { audio: AudioMetadata } =>
      record.audio !== undefined
  );

  for (const record of audioRecords) {
    const item = record.audio;
    if (!ACCEPTED_LISTENING_PURPOSES.has(item.purpose)) {
      addError(
        "audio-ownership",
        `${record.id} has invalid Listening purpose '${item.purpose}'.`
      );
    }
    if (item.purpose !== record.purpose) {
      addError(
        "audio-ownership",
        `${record.id} audio purpose '${item.purpose}' does not match content purpose '${record.purpose}'.`
      );
    }
    if (item.purpose === "placement" && record.level !== "placement") {
      addError(
        "audio-ownership",
        `${record.id} is Placement audio but declares level '${record.level}'.`
      );
    }
    if (item.purpose !== "placement" && record.level === "placement") {
      addError(
        "audio-ownership",
        `${record.id} uses the Placement level outside the Placement purpose.`
      );
    }
    if (!item.audioSrc?.startsWith("/")) {
      addError(
        "audio-path",
        `${record.id} audio source must be a public-root path beginning with '/'.`
      );
      continue;
    }

    const sourceEntries = bySource.get(item.audioSrc) ?? [];
    sourceEntries.push(record);
    bySource.set(item.audioSrc, sourceEntries);

    const relativeAudioPath = item.audioSrc.replace(/^\/+/, "");
    const filesystemPath = path.resolve(PUBLIC_ROOT, relativeAudioPath);
    const insidePublic =
      filesystemPath === PUBLIC_ROOT ||
      filesystemPath.startsWith(`${PUBLIC_ROOT}${path.sep}`);
    if (!insidePublic) {
      addError(
        "audio-path",
        `${record.id} audio path escapes the public directory: '${item.audioSrc}'.`
      );
      continue;
    }
    const exists =
      fs.existsSync(filesystemPath) && fs.statSync(filesystemPath).isFile();
    if (item.audioReady && !exists) {
      addError(
        "audio-path",
        `${record.id} is audioReady but '${item.audioSrc}' does not exist in public/.`
      );
    } else if (!item.audioReady && exists) {
      addWarning(
        "audio-path",
        `${record.id} has an existing audio file but audioReady is false.`
      );
    }
  }

  for (const [source, entries] of bySource) {
    if (entries.length > 1) {
      addError(
        "audio-ownership",
        `Audio source '${source}' is owned by multiple items: ${entries
          .map((record) => `${record.id} [${record.purpose}]`)
          .join(" | ")}.`
      );
    }
  }

  const placementAudio = placementQuestions.filter(
    (question) => question.task_type === "audio_multiple_choice"
  );
  for (const question of placementAudio) {
    const owner = byId.get(question.id);
    if (!owner || owner.purpose !== "placement") {
      addError(
        "audio-ownership",
        `Placement audio question '${question.id}' has no canonical purpose-owned Listening item.`
      );
      continue;
    }
    const fieldsMatch =
      question.prompt === owner.prompt &&
      stableString(question.options) === stableString(owner.options) &&
      question.correct_answer === owner.correct_answer &&
      question.audio_src === (owner.audioReady ? owner.audio_src : undefined) &&
      question.cefr_weight === owner.cefr_weight;
    if (!fieldsMatch) {
      addError(
        "audio-ownership",
        `Placement audio alias '${question.id}' has drifted from its canonical Listening item.`
      );
    }
  }

  const placementOwnerIds = new Set(
    listeningItems
      .filter((item) => item.purpose === "placement")
      .map((item) => item.id)
  );
  const placementQuestionIds = new Set(
    placementAudio.map((question) => question.id)
  );
  if (
    stableString([...placementOwnerIds].sort()) !==
    stableString([...placementQuestionIds].sort())
  ) {
    addError(
      "audio-ownership",
      "Canonical Placement Listening IDs do not exactly match audio questions in the Placement test."
    );
  }
}

function validatePhysicalRoutes(): void {
  const requiredRoutes = [
    path.join(
      ROOT,
      "app",
      "(public)",
      "tests",
      "[level]",
      "lessons",
      "[lessonId]",
      "page.tsx"
    ),
    path.join(
      ROOT,
      "app",
      "(public)",
      "tests",
      "[level]",
      "[testId]",
      "page.tsx"
    ),
    path.join(
      ROOT,
      "app",
      "(public)",
      "tests",
      "[level]",
      "progress-check",
      "page.tsx"
    ),
  ];
  for (const route of requiredRoutes) {
    if (!fs.existsSync(route)) {
      addError(
        "route-alignment",
        `Required content route is missing: ${path.relative(ROOT, route)}.`
      );
    }
  }
}

function injectIntentionalError(kind: string | undefined): void {
  if (!kind) return;
  if (kind === "duplicate-id") {
    const source = records[0];
    records.push({
      ...source,
      source: "intentional-error:duplicate-id",
    });
    return;
  }
  if (kind === "invalid-answer") {
    const rawQuestion: QuestionLike = {
      id: "__intentional_invalid_answer__",
      skill: "grammar",
      task_type: "multiple_choice",
      cefr_weight: "A1",
      prompt: "Intentional invalid answer fixture.",
      options: ["A", "B"],
      correct_answer: "C",
    };
    records.push(
      createQuestionRecord(rawQuestion, {
        source: "intentional-error:invalid-answer",
        owner: "intentional-error",
        purpose: "practice",
        level: "a1-elementary",
        explanation: "Intentional invalid answer fixture.",
      })
    );
    return;
  }
  if (kind === "invalid-audio") {
    const rawQuestion: QuestionLike = {
      id: "__intentional_invalid_audio__",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "A1",
      prompt: "Intentional invalid audio fixture.",
      options: ["A", "B"],
      correct_answer: "A",
      audio_src: "/audio/listening/does-not-exist.mp3",
    };
    records.push(
      createQuestionRecord(rawQuestion, {
        source: "intentional-error:invalid-audio",
        owner: "intentional-error",
        purpose: "practice",
        level: "a1-elementary",
        explanation: "Intentional invalid audio fixture.",
        audio: {
          purpose: "practice",
          audioSrc: rawQuestion.audio_src!,
          audioReady: true,
        },
      })
    );
    return;
  }
  addError(
    "intentional-error",
    `Unknown intentional error '${kind}'. Use duplicate-id, invalid-answer, or invalid-audio.`
  );
}

function printDiagnostics(): void {
  const sortedWarnings = [...warnings].sort((left, right) =>
    `${left.rule}:${left.message}`.localeCompare(`${right.rule}:${right.message}`)
  );
  const sortedErrors = [...errors].sort((left, right) =>
    `${left.rule}:${left.message}`.localeCompare(`${right.rule}:${right.message}`)
  );

  console.log(`\nWarnings (${sortedWarnings.length})`);
  if (!sortedWarnings.length) console.log("- none");
  for (const warning of sortedWarnings) {
    console.log(`- [${warning.rule}] ${warning.message}`);
  }

  console.log(`\nErrors (${sortedErrors.length})`);
  if (!sortedErrors.length) console.log("- none");
  for (const error of sortedErrors) {
    console.log(`- [${error.rule}] ${error.message}`);
  }
}

function main(): void {
  let collected:
    | ReturnType<typeof collectContent>
    | undefined;
  try {
    collected = collectContent();
  } catch (error) {
    addError(
      "content-load",
      error instanceof Error ? error.stack ?? error.message : String(error)
    );
  }

  const injection = process.argv
    .find((argument) => argument.startsWith("--inject-error="))
    ?.split("=")[1];
  injectIntentionalError(injection);

  if (collected) {
    validateIdentities();
    validateRequiredFields();
    validateEnums(collected.levelCefr);
    validateAnswerData(collected.isAnswerCorrect);
    validateSignatures();
    validateConstructOverlap();
    validatePassageReuse();
    validateAudio(collected.listeningItems, collected.placementQuestions);
    validatePhysicalRoutes();
  }

  printDiagnostics();
  console.log(
    `\nChecked ${records.length} questions across ${new Set(
      records.map((record) => record.purpose)
    ).size} purposes.`
  );

  if (errors.length) {
    console.error(`Content validation failed with ${errors.length} error(s).`);
    process.exitCode = 1;
  } else {
    console.log("Content validation passed.");
  }
}

main();
