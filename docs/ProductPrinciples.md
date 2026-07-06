# CamPath — Product Principles

> These are the principles that have actually governed decisions across CamPath's development — each one is documented with the real decision(s) that came from it, not as abstract values.

---

### Progress over Points
No XP, no coins, no streak counters, no badges — anywhere. This was the founding manifesto decision and has been re-enforced every time a new feature was proposed with game-like framing (e.g., Study Path's "current lesson" highlighting uses color and typography weight, never a badge or star icon; Milestones display as a plain factual line — "Completed A1 Elementary" plus a date — never a graphic or animation).

### No Gamification
A stricter, narrower sibling of the above: no mechanics borrowed from games specifically (levels-as-game-levels framing, unlockable rewards, leaderboards). Every place a "reward" concept was tempting (finishing a lesson, completing a level) was deliberately replaced with a calm, factual confirmation instead.

### No Artificial Engagement
No push notifications, no re-engagement nudges, no "come back today" messaging, no manufactured urgency. Study Consistency is displayed as a calendar-style count of real active days — not a "streak" framed as something the learner can "lose."

### Calm Educational UX
Concretely: the Educational Confidence language rule — never "Wrong," "Failed," or "Incorrect." Always "Review this concept," "Needs Review," or similar. Applied consistently from the very first lesson template through the Results page's Question Review section.

### Minimal Cognitive Load
Concretely: progressive disclosure wherever a screen could otherwise overwhelm — Results' Question Review section is collapsed by default, Home's FAQ items are collapsed by default, and the Learning Journey section on Home was rebuilt from a wrapping grid into a strict vertical list specifically because a wrapping multi-column grid broke the reader's ability to follow an 8-step sequence in order.

### Authentic Cambridge-Style English
Concretely enforced during two separate reviews: the Phase 4 Learn Module review rejected a guided-practice question whose wrong answers ("I reckon...", "Dunno, maybe...") were so exaggeratedly informal that the question required no real understanding to answer; and the A2 Educational Quality Audit required every distractor to represent a real, plausible learner error (e.g., "goed" for the past tense of "go") rather than an arbitrary wrong option.

### Assessment Follows Teaching
The most recently and explicitly enforced principle: every Mixed Test and Progress Check item must trace back to a specific taught lesson objective. Violated once (A2's Vocabulary/Reading sections tested untaught content) and corrected by rewriting the assessment, not by loosening the rule.

### Reuse Before Creating
Concretely: `QuestionInput` was extracted from the Placement Test specifically so the new Tests Architecture wouldn't duplicate question-rendering logic; `StudyPath`/`StudyPathNode` render both the legacy Study Path preview and the new Level Curriculum's sequence view; `curriculumService.getLevelProgress()` was extracted as a single traversal shared by both the level page's visual sequence and My Journey's dashboard numbers, specifically to avoid two copies of "walk lessons then tests then progress check" existing at once.

### Data Before UI
The service layer (`services/*.ts`) for a given feature has consistently been designed — including its future-facing shape (`async` functions, typed returns) — before or alongside its page, never after. The Database & API Design document predates almost all page implementation.

### Architecture Before Features
Concretely demonstrated by this project's own sequencing: multiple sprints were spent explicitly on review and architecture-fixing (the Production Readiness Audit, the My Journey/Level Curriculum unification) with instructions to build no new content until the underlying structure was sound — most recently, A2 content development was paused for an Educational Quality Audit before being allowed to become "the template" for future levels.

### Truth Over Marketing
Concretely: every unbuilt feature is labeled "Coming Soon," never hidden or implied to exist. The Home page's Featured Lessons section shows only the 3 lessons that are actually real. The site-wide footer states plainly that CamPath is not affiliated with or endorsed by Cambridge University Press & Assessment. No fake testimonials, no invented user counts, anywhere.
