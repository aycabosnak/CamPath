# CamPath

English learning platform for Cambridge-style exam preparation: placement test, A1–C1 curriculum (grammar, vocabulary, reading, listening, writing, speaking), mixed tests, progress checks — plus optional accounts with cross-device progress sync.

- **Frontend:** Next.js 14 · React 18 · TypeScript · Tailwind (this folder)
- **Backend:** ASP.NET Core 8 · EF Core · SQLite · JWT · xUnit (`backend/`, see `backend/README.md`)

## Run locally

```bash
# 1. API (http://localhost:5080, Swagger at /swagger)
cd backend && dotnet run --project src/CamPath.Api

# 2. Web app (http://localhost:3000) — in another terminal
npm install && npm run dev
```

The web app works without the API too (everything is saved in the browser); the API adds sign-in and sync.

---

# Original scaffold notes

> Historical — written before any content, accounts or backend existed. For the current state see `docs/PROJECT_STATUS.md`.

This is the Next.js App Router scaffold produced after the Product
Manifesto → IA/UX Blueprint → Design System → Component Library →
Internal UI Kit → Experience Blueprint → Database & API Design chain.
Every folder here traces back to a decision made in one of those
documents — see inline comments in each placeholder file for the
specific reference.

## Structure

```
app/
  (public)/       — no auth. Homepage, Level Test, Learn, Practice, Exams, Resources.
  (auth)/         — requires a logged-in student. My Journey, Study Path, Certificates, Writing.
  (teacher)/      — requires role === "teacher". Dashboard, Classes, Assignments, Writing Queue, Reports.
  (internal)/     — design-system preview only. Blocked in production by middleware.ts.
  layout.tsx      — root layout (html/body, global font/meta)
  globals.css     — Design System tokens + component classes

components/
  ui/             — Button, Card, ProgressBar, MasteryBar, ReadinessGauge, Form, Badge
  study-path/     — StudyPathNode, StudyPath
  dashboard/      — MyJourneyMetricCard
  types.ts        — UI-facing prop unions (NOT the same as types/entities.ts)
  lib/cn.ts       — classnames helper

lib/
  api-client/     — one module per API domain; the ONLY place that calls fetch()
  mock-data/      — local fixtures for building UI before the backend exists

services/         — pure logic (readinessCalculator, progressionEngine) kept
                    separate from api-client so "real API" vs "computed
                    client-side" logic is never ambiguous

types/
  entities.ts     — domain types mirroring the approved database schema exactly

constants/        — routes.ts, cefr.ts, examTypes.ts — no magic strings elsewhere

middleware.ts     — auth/role gating placeholder (see comments for TODOs)
tailwind.config.js, tsconfig.json
```

## What's NOT here yet (intentionally)

- No real authentication — `middleware.ts` has the decision points
  but `getAccessToken()` in `lib/api-client/index.ts` returns `null`.
- No real backend — every api-client function is typed and shaped
  correctly but points at `/api/...` paths that don't resolve yet.
- No page content — every `page.tsx` is a labeled placeholder.

## Recommended first implementation step

Wire up the **Level Test flow** end-to-end against `lib/mock-data`
first (before any backend exists): `/level-test` → `/level-test/take`
→ `/level-test/results`. It's the shortest path that touches routing,
component composition, and the guest-session concept all at once —
everything after it (My Journey, Learn, Practice) builds on the same
patterns.
