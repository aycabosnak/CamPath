"use client";

/**
 * /app/design-system/page.tsx
 *
 * Internal UI Kit / Component Preview — NOT a public marketing page.
 * Every reusable component from the CamPath component library is
 * rendered here in its full state matrix so we can visually and
 * accessibility-test it before any real page consumes it.
 *
 * Technical Reasoning: this page is a client component ("use client")
 * only because the Study Path mode toggle needs local state. Every
 * individual component it renders stays as close as possible to how
 * it will be used in real pages — no special "storybook-only" props.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, MetricCard, LearningCard, ClickableCard } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MasteryBarList } from "@/components/ui/MasteryBar";
import { ReadinessGauge } from "@/components/ui/ReadinessGauge";
import { StudyPath, type StudyPathNodeData } from "@/components/study-path/StudyPath";
import { MyJourneyMetricCard, type MyJourneyMetric } from "@/components/dashboard/MyJourneyMetricCard";
import { TextField, SelectField, TextareaField } from "@/components/ui/Form";
import { CefrBadge, StageBadge, SkillBadge, StatusBadge } from "@/components/ui/Badge";
import type { StudyPathMode } from "@/components/types";

/** Small internal helper — a section header + explanatory usage note. Preview-page-only, not part of the shipped component library. */
function Section({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="text-h2 mb-1">{title}</h2>
      <p className="text-small text-ink-soft mb-6 max-w-xl">{note}</p>
      {children}
    </section>
  );
}

const MASTERY_DATA = [
  { skill: "grammar" as const, percentage: 82 },
  { skill: "vocabulary" as const, percentage: 74 },
  { skill: "listening" as const, percentage: 58 },
  { skill: "reading" as const, percentage: 69 },
  { skill: "useOfEnglish" as const, percentage: 45 },
  { skill: "writing" as const, percentage: 38 },
];

const STUDY_PATH_NODES: StudyPathNodeData[] = [
  { id: "u1", order: 1, state: "completed", title: "Unit 1 · Introductions", subtitle: "Completed" },
  { id: "u2", order: 2, state: "mastered", title: "Unit 2 · Daily Routines", subtitle: "Mastered" },
  { id: "u3", order: 3, state: "inProgress", title: "Unit 3 · Future Plans", subtitle: "In progress" },
  { id: "u4", order: 4, state: "recommended", title: "Unit 4 · Talking About the Past", subtitle: "Recommended next" },
  { id: "u5", order: 5, state: "notStarted", title: "Unit 5 · Giving Opinions", subtitle: "Not started · available anytime" },
];

const JOURNEY_METRICS: MyJourneyMetric[] = [
  { type: "currentStage", stage: "Communicator", cefr: "B1" },
  { type: "overallProgress", percentage: 64, unitLabel: "Communicator · B1" },
  { type: "studyTime", hours: 3, minutes: 40, trendLabel: "↑ 45m vs last week" },
  { type: "studyConsistency", daysActive: 18, daysInPeriod: 30 },
  { type: "cambridgeReadiness", status: "approaching", examLabel: "B1 Preliminary" },
  { type: "completedUnits", completed: 4, total: 9 },
];

export default function DesignSystemPreview() {
  const [pathMode, setPathMode] = useState<StudyPathMode>("guided");

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-caption mb-2">Internal · Not for public routing</p>
      <h1 className="text-display-l mb-2">CamPath Design System</h1>
      <p className="text-body-l text-ink-soft mb-16 max-w-2xl">
        Every reusable component, in every state it can appear in. Use this
        page to check visual consistency, keyboard focus order, and
        accessibility before wiring components into real routes.
      </p>

      {/* 1. BUTTONS ------------------------------------------------ */}
      <Section
        title="Buttons"
        note="Three variants only — primary, secondary, tertiary. Tab through this row to confirm every button shows a visible focus ring, including disabled ones being correctly skipped."
      >
        <div className="flex flex-wrap gap-3 mb-4">
          <Button variant="primary" size="sm">Primary · sm</Button>
          <Button variant="primary" size="md">Primary · md</Button>
          <Button variant="primary" size="lg">Primary · lg</Button>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button variant="secondary" size="sm">Secondary · sm</Button>
          <Button variant="secondary" size="md">Secondary · md</Button>
          <Button variant="secondary" size="lg">Secondary · lg</Button>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button variant="tertiary">Tertiary link</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" disabled>Primary · disabled</Button>
          <Button variant="secondary" disabled>Secondary · disabled</Button>
        </div>
      </Section>

      {/* 2. CARDS ---------------------------------------------------- */}
      <Section
        title="Cards"
        note="ClickableCard is a real <button> — check that it's keyboard-reachable and that hover/focus only changes the border color, never scale or shadow."
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Card>
            <p className="text-small">Base Card — plain container, no semantics assumed.</p>
          </Card>
          <ClickableCard onClick={() => alert("ClickableCard activated")}>
            <p className="text-small font-semibold">Clickable Card</p>
            <p className="text-caption normal-case">Try Tab + Enter</p>
          </ClickableCard>
          <MetricCard eyebrow="Study Time" value="3h 40m" trend="↑ 45m vs last week" />
          <LearningCard
            title="Unit 4 · Talking About the Past"
            description="Grammar, vocabulary, and a short reading text on narrative tenses."
            badge={<StageBadge stage="Communicator" />}
            actionLabel="Continue"
            onAction={() => alert("Open lesson")}
          />
        </div>
      </Section>

      {/* 3. PROGRESS -------------------------------------------------- */}
      <Section
        title="Progress Components"
        note="ProgressBar and MasteryBar both expose role=progressbar with live aria-valuenow — confirm with a screen reader that each bar announces its own label, not a combined total."
      >
        <div className="flex flex-col gap-4 max-w-md mb-10">
          <ProgressBar value={0} label="Unit 1 · Not started" />
          <ProgressBar value={35} label="Unit 2 · In progress" />
          <ProgressBar value={65} label="Unit 3 · In progress" />
          <ProgressBar value={100} label="Unit 4 · Completed" />
        </div>

        <p className="text-small font-semibold mb-3">Mastery by Skill (bar-first view)</p>
        <MasteryBarList items={MASTERY_DATA} className="max-w-md mb-10" />

        <p className="text-small font-semibold mb-3">Cambridge Readiness Gauge — all three states</p>
        <div className="flex flex-wrap gap-12">
          <ReadinessGauge status="notReady" examLabel="B2 First" />
          <ReadinessGauge status="approaching" examLabel="B2 First" />
          <ReadinessGauge status="ready" examLabel="B2 First" />
        </div>
      </Section>

      {/* 4. STUDY PATH -------------------------------------------------- */}
      <Section
        title="Study Path"
        note="All five states below, in one list, with no locked state anywhere in the data or the code. Toggle Guided/Free — the node list and interactivity must stay identical in both modes."
      >
        <div className="max-w-md">
          <StudyPath
            nodes={STUDY_PATH_NODES}
            mode={pathMode}
            onModeChange={setPathMode}
            onSelectNode={(id) => alert(`Selected node: ${id}`)}
          />
        </div>
      </Section>

      {/* 5. MY JOURNEY METRIC CARDS -------------------------------------- */}
      <Section
        title="My Journey Metric Cards"
        note="Six distinct data shapes, not one generic stat card — check that Cambridge Readiness never renders as a raw percentage here."
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {JOURNEY_METRICS.map((metric, i) => (
            <MyJourneyMetricCard key={i} metric={metric} />
          ))}
        </div>
      </Section>

      {/* 6. FORM COMPONENTS -------------------------------------------- */}
      <Section
        title="Form Components"
        note="Focus each field and confirm the error message is announced (role=alert + aria-describedby), not just visually red."
      >
        <div className="max-w-sm">
          <TextField label="Email address" placeholder="you@example.com" />
          <TextField
            label="Weekly goal (units)"
            defaultValue="12"
            error="Enter a number between 1 and 7."
          />
          <SelectField
            label="Target exam"
            options={[
              { value: "a2key", label: "A2 Key" },
              { value: "b1prelim", label: "B1 Preliminary" },
              { value: "b2first", label: "B2 First" },
            ]}
          />
          <TextareaField
            label="Writing task response"
            placeholder="Write your response here…"
            error="Your response must be at least 140 words."
          />
        </div>
      </Section>

      {/* 7. BADGES / CHIPS -------------------------------------------- */}
      <Section
        title="Badges / Chips"
        note="Status badges must never rely on color alone — each one below always renders its status word as text."
      >
        <div className="flex flex-wrap gap-3 mb-4">
          <CefrBadge level="A1" />
          <CefrBadge level="B1" />
          <CefrBadge level="C2" />
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <StageBadge stage="Foundation" />
          <StageBadge stage="Communicator" />
          <StageBadge stage="Master" />
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <SkillBadge skill="grammar" />
          <SkillBadge skill="useOfEnglish" />
          <SkillBadge skill="writing" />
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status={{ kind: "readiness", value: "notReady" }} />
          <StatusBadge status={{ kind: "readiness", value: "approaching" }} />
          <StatusBadge status={{ kind: "readiness", value: "ready" }} />
          <StatusBadge status={{ kind: "pathNode", value: "recommended" }} />
          <StatusBadge status={{ kind: "pathNode", value: "mastered" }} />
          <StatusBadge status={{ kind: "needsAttention" }} />
        </div>
      </Section>
    </main>
  );
}
