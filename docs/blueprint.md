# Shipbuds — Audit & Transformation Blueprint

Status: **Phase 0 + 1 implemented (2026-11-04)** — see [Implementation log](#implementation-log). Later phases are still proposals.
Date: 2026-11-04. Companion docs: [`platform.md`](./platform.md) (product), [`architecture/architecture.md`](./architecture/architecture.md) (what exists), [`architecture/production-architecture.md`](./architecture/production-architecture.md) (what we would build).

Labels used throughout: **IMPLEMENTED** (works in this repo), **SIMULATED** (demonstrates intended behaviour with local state, timers, regex or canned data), **FUTURE** (not built). Any number in this document is a *proposed target* or *labelled sample*, never a measured result — Shipbuds has no users and no telemetry yet.

---

## 1. Current product assessment

### What the repository is

A single-page React 18 + TypeScript + Vite + Tailwind app, ~9k lines, one Zustand store persisted to `localStorage`, HashRouter, no backend, no network calls, no tests. 60 commits. The existing [`architecture.md`](./architecture/architecture.md) is unusually honest and accurate — I checked its claims against the source and found no overclaiming.

### What is genuinely strong (preserve)

| Asset | Why it matters |
| --- | --- |
| **Thread model**: Manager thread + `#channel` threads + private DMs (`ThreadKind = manager \| channel \| dm`) | This *is* the segmentation story for technical users. It already avoids the "fake single group chat" trap. |
| **Activity-line collapsing** (`chat/grouping.ts`) | Agent↔agent chatter becomes one line; only messages addressed to you are bubbles. This is the single best answer to "observable without reading raw logs". |
| **Specialists appear only when brought in** (empty channels until routed) | Directly implements "don't populate every project with agents". |
| **Structured cards in chat** (Plan, Strategy, Build) | Planning is already a reviewable object, not a wall of text. |
| **Project isolation in the store** (everything keyed by `projectId`) | The data shape a real backend needs. |
| **Preview in a sandboxed iframe** with viewports and states | Correct security posture even for canned content. |
| **Vibing** matches the approved spec almost exactly (one button, chooser as sole input, transcript in Manager thread, popup handling, never claims a video was watched) | Done. Leave it alone. |
| **Design system**: tokens in `tailwind.config.js` mirrored in CSS vars, matches the brief's palette, reduced-motion support, shared primitives | Mature enough to build on without a redesign. |
| **Honest in-product copy** in Deploy ("Production deploys always simulate a failure…") | Sets the tone the docs require. |

### What is weak (challenge)

| # | Problem | Evidence | Severity |
| --- | --- | --- | --- |
| W1 | **Three product names.** Package `architect-2`, landing/onboarding/UI copy "Architect 2.0", README "Shipmate", brief "Shipbuds". | `landingCopy.ts`, `Onboarding.tsx:41`, `VibingChooser.tsx:61`, `package.json` | High — breaks credibility instantly in any demo |
| W2 | **No clarification step.** Prompt → regex `planFor()` → plan card immediately. The thesis says the Manager "identifies missing information and asks". The tutor-marketplace example in the brief would fall to the generic `else` branch and get "Core create and list flow". | `store/scripts.ts` `planFor` | High — the Manager reads as a template, not a teammate |
| W3 | **Task ownership is shallow.** `BuildTask` has `agentId` + `status` but no dependencies, no `blocked`/`needs_review` state, no rationale, no output link. The technical persona's "who/what/why/blocked/needs review" questions have no data to answer from. | `types.ts:127` | High — this is the core technical differentiator |
| W4 | **No human-approval states beyond "Start building".** No review gates on specialist output, no "QA needs your call" escalations. | store actions | Medium |
| W5 | **Import copy overclaims inside the UI.** "Cloning repository…", "I've reviewed your repo — 42 files" for a URL that was never fetched; two canned detections. Docs are honest, the product surface is not. | `ImportWizard.tsx` | Medium — violates the brief's honesty rule in a demo |
| W6 | **Persona exists but is dead.** `User.persona` is hardcoded `'non-technical'` and read nowhere. The two-audience design has no switch. | `Auth.tsx:31` | Medium |
| W7 | **Code is read-only; Guard is unclear on advisory vs blocking.** Brief wants editing + diffs + explicit advisory/blocking distinction. | `code/CodeView.tsx` | Medium |
| W8 | **No model/framework selection surface** at all. | — | Low for V1 (defaults are fine), but the data model should carry it |
| W9 | **Store is a 1,019-line monolith** with scripted timers inside actions. Fine for a prototype; it is the main obstacle to swapping in a real backend. | `store/store.ts` | Medium (V2 blocker, not V1) |
| W10 | **Zero tests.** | — | Medium — every phase below needs a regression net |

### Verdict

The shell, chat model, design system and Vibing are V1-quality. The **Manager's brain and the task model are not** — and those are exactly what the thesis rests on. The next work should go into W1–W6, not into new surfaces.

---

## 2. Product vision and positioning

**Shipbuds — vibe coding feels like a group chat.**

Positioning against the field (assumption-based, not researched):

| | Single-agent vibe tools | IDE agents | **Shipbuds** |
| --- | --- | --- | --- |
| Mental model | One chatbot | Pair programmer | A team you manage |
| Visibility of work | Stream of text | Diffs | Who is doing what, why, and what's blocked |
| Non-technical fit | High | Low | High (Manager + Preview only) |
| Technical control | Low | High | High (channels, DMs, code, git) |

**The one thing to prove:** a user can answer *"who is doing what, and what needs me?"* in under five seconds, at any moment, without reading logs. If the product can't do that, the group-chat framing is just skin.

Positioning decision I'd push back on: the brief lists every lifecycle stage (Canvas, Code, GitHub, Deploy, Import, model choice) as V1. They are mostly *built* already as simulations, so the risk is not missing them — it's that polishing them dilutes the thesis. V1 should make the Manager + task layer convincing first.

## 3. Personas and core problems

Personas are **assumptions** (no user research has been done). Validate with 5–8 interviews per persona before V2.

**P1 — Maya, non-technical founder.** Has a tutoring-marketplace idea. Problems: can't translate idea → requirements; can't judge whether output is good; intimidated by setup. Needs: plain-language clarification, a plan she can say yes to, a Preview that grows, errors explained as consequences ("bookings won't save yet") not stack traces.

**P2 — Dev, full-stack engineer.** Has an existing Next.js repo. Problems: single-agent threads lose context on large changes; can't tell which AI decision caused a bug; distrusts silent overwrites. Needs: per-specialist channels, task ownership with rationale, diffs before apply, git as source of truth, model/framework control.

**P3 — Sam, design-minded builder** (secondary). Thinks in screens. Needs Canvas → Preview loop without touching code.

Shared problem: *AI coding today is a black box you prompt and hope.* Shipbuds' answer is accountability through roles.

## 4. Current vs future feature matrix

| Capability | IMPLEMENTED | SIMULATED | FUTURE |
| --- | --- | --- | --- |
| Auth (email / Google / guest) | Routing guards, session persistence | Google chooser, no credential check | Real OAuth (Google, GitHub), sessions |
| Onboarding + Manager setup | Steps, avatar upload, nickname | Integration "connections" | Real integration OAuth |
| Multiple Managers / projects | Full CRUD, pin, archive, search, isolation | — | Server persistence, sharing |
| Manager conversation | Composer, grouping, unread, typing | All replies (regex + scripts) | LLM-backed Manager |
| **Clarification** | — | — | **Not even simulated (W2)** |
| Plan card + Approach (Lean/Balanced/Enterprise) | Card UI, revision loop | Plan contents from regex | Model-generated structured plan |
| Specialist channels + DMs | Threads, empty states, routing UI | Specialist replies (scripted) | Real agents with tools |
| Task tracking | Per-agent tasks with status | Timer-driven progress | Dependency graph, blocked/review states, rationale (W3) |
| Human approval gates | "Start building" only | — | Review/escalation gates (W4) |
| Preview | Sandboxed iframe, viewports, states | Canned HTML templates revealed in sections | Live dev server from sandbox |
| Canvas | Element select + property edit | Screenshot/sketch-to-UI (file never read) | Vision model → components; apply to code |
| Code | File tree, highlighting | Files are canned; Guard checks canned | Real files, editing, diffs, build/test output |
| GitHub | Connect/commit/conflict UI | Everything (no API, no git) | OAuth app, real git ops, webhooks |
| Import | Wizard UI | Two canned detections (W5) | Clone + framework/dependency/env analysis |
| Deploy | Logs, URL, QR, history, rollback UI | Logs, URL; prod always fails | Vercel/Netlify/Fly adapters |
| Model / framework choice | — | — | Settings surface + model gateway |
| Vibing | Chooser, external tabs, return detection, music player UI, transcript | Music tracks are local | — (complete for its scope) |
| Persona-aware UI | Type exists | — | Dead code today (W6) |
| Tests | — | — | Needed now (W10) |

## 5. Revised information architecture

Keep the current shell. Changes are additive and small.

```
Manager rail (64px)            ← unchanged: Managers are identities
└─ Project drawer (overlay)    ← unchanged
   └─ Project workspace
      ├─ TopBar: identity · [Team strip NEW] · Canvas · Code · GitHub · Deploy
      ├─ Main column
      │   ├─ Manager thread  (default)
      │   ├─ #channel threads (one per active specialist)
      │   └─ DMs
      └─ Right workspace
          ├─ Preview (default)
          ├─ [Tasks tab NEW] — the board behind the Build card
          └─ Vibing button → chooser / music player
```

Two additions, both answering *"who is doing what"*:

1. **Team strip** in the TopBar — one avatar per *active* specialist with a status ring (working / blocked / needs you / idle). Click → that channel. This is the visible "group chat" roster; costs ~40px.
2. **Tasks tab** beside Preview — a compact list grouped by owner with status, dependency and a one-line "why". Not a Kanban, not a PM dashboard: it's the expanded form of the Build card that already exists in chat.

Explicit non-additions: no standalone dashboard page, no sprint/backlog concepts, no Gantt.

## 6. End-to-end user flows

### Flow A — Maya, new idea (non-technical)

1. Signs in as guest → onboarding (unchanged, ≤4 steps).
2. Types *"A platform where tutors create profiles and students book demo classes."*
3. **NEW Clarify card**: Manager asks ≤3 questions as tappable chips, each with a sensible default pre-selected — *Who pays? (free demo / paid)*, *Do tutors need approval?*, *Calendar or fixed slots?* — and a "Use your best judgement" button. Skipping is always allowed.
4. Plan card (features + team + trade-offs) → Approach card → **Start building**.
5. Team strip lights up Frontend, Backend, QA. Build card narrates; Preview grows section by section.
6. QA flags *"Double-booking is possible"* → **NEW Needs-you card** in Manager thread with two plain-language options. Maya picks; build continues.
7. "First pass is live." Maya asks for a change in plain words; Manager routes it and says who owns it.

### Flow B — Dev, existing repo (technical)

1. Import → GitHub URL. **Analysis is labelled as a demo** until V2 (fix W5).
2. Manager posts a **Discovery card**: framework, deps, missing env vars, existing build errors, proposed specialists — *"Nothing will be changed until you approve."*
3. Dev opens `#backend`, asks why it chose server actions over a REST route. Backend answers with rationale linked to the task.
4. Dev DMs Backend: "use tRPC instead." Task gets a revision; Manager thread shows one activity line: *"Backend revised API approach at Dev's request."*
5. Code tab shows the diff; Guard results labelled **Advisory** or **Blocking**. Commit → push → conflict → resolve. Deploy preview.

### Flow C — Refine visually (Sam)

Canvas → select element → edit → **Preview the change before apply** → Apply posts a UI/UX task in `#frontend`. (Today Canvas edits don't flow back into tasks — wire it.)

## 7. Manager / specialist operating model

**Roles.** Manager owns intent, plan, assignment, review and escalation; never writes code. Specialists own one domain each (Frontend, Backend, AI/ML, UI/UX, QA, DevOps). Recommendation: **add UI/UX as a specialist** (the brief lists it, the roster doesn't; it's the natural owner of Canvas output) but keep it off by default for Lean.

**Task lifecycle** (extends `TaskStatus`):

```
queued → running → (needs_review | blocked) → done
                 ↘ failed → (retry | escalate)
```

Each task carries: `owner`, `dependsOn[]`, `why` (one sentence), `output` (file paths / preview section / decision), `reviewer` (QA or user).

**Communication surfaces — keep them distinct:**

| Surface | Who talks | What appears |
| --- | --- | --- |
| Manager thread | User ↔ Manager | Intent, clarifications, plans, approvals, summaries, Needs-you cards |
| `#channel` | Manager ↔ specialist (user may join) | Task assignment, progress, rationale, handoffs |
| DM | User ↔ one specialist, private | Direct questions/requests; Manager sees a one-line activity note, not the content |
| Activity lines | System | Agent↔agent handoffs collapsed |

**Escalation rule.** A specialist escalates to the Manager when (a) confidence is low, (b) a decision changes scope/cost/data model, or (c) it would modify a file it doesn't own. The Manager escalates to the user only for (b) or repeated failure. This keeps Maya's interruptions rare.

**Persona switch (fix W6).** One setting, "Show technical detail", default off for guest/email signup. Off: hide file paths, model names, raw logs; show plain-language summaries. On: everything. Same product, two densities.

## 8. Technical architecture (current, summarised)

Fully documented in [`architecture.md`](./architecture/architecture.md). Key constraint for evolution: all "intelligence" lives in `store/scripts.ts` and `setTimeout` chains inside store actions. **Step one of V2 is an `AgentRuntime` interface** the store calls, with a `ScriptedRuntime` (today's behaviour, extracted) and later a `RemoteRuntime` (SSE from the backend). That one seam lets the whole UI survive the backend swap.

## 9. Production architecture recommendations

Full detail and comparisons in [`production-architecture.md`](./architecture/production-architecture.md). Headline choices:

- **Backend:** TypeScript service (Fastify or Hono) + Postgres + Redis; event stream to client over **SSE** (WebSocket only for terminal).
- **Agent harness:** Manager + specialist loop on a durable workflow engine (**Temporal** or Inngest) so long-running tasks survive restarts and human-approval waits are first-class.
- **Sandboxes:** start on **E2B or Daytona** (managed Firecracker / container) — buy, don't build; revisit self-hosted Firecracker only when sandbox spend dominates.
- **Model gateway:** thin internal adapter layer normalising messages + tool calls across Claude / GPT / Gemini / OSS; route per task type; per-project budgets.
- **Git:** GitHub App (not OAuth App) for fine-grained repo permissions and webhooks; git runs inside the sandbox; Shipbuds commits to a branch, never force-pushes the user's default branch.
- **Deploy:** adapter to Vercel / Netlify / Fly; preview per branch; rollback = re-promote a prior deployment.

## 10. Design-system recommendations

The system is sound. Targeted changes only:

1. **Rename pass** to Shipbuds everywhere (W1).
2. **Status colour semantics** for the Team strip / tasks. Today accents are reserved for decisions — keep that, and add exactly: working = blue `#007AFF`, needs-you = purple `#7C3AED`, blocked/failed = red `#FF453A`, done/idle = neutral. Never use colour alone (pair with icon + label).
3. **Two new card types** reusing `Cards.tsx` patterns: Clarify (chips with defaults) and Needs-you (question + 2–3 options). Same radius, surface and spacing as Plan card.
4. **Advisory vs Blocking** Guard badges: advisory = outline neutral, blocking = filled red + prevents commit.
5. **Density toggle** tied to "Show technical detail" rather than a separate compact mode.
6. Keep: system font stack, 8/12px radii, no gradients, reduced-motion.

## 11. Risk assessment

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Multi-agent adds latency/cost without better output vs one strong agent | High | High | Make specialists a *presentation + accountability* layer over a small number of real model calls in V2; measure cost per successful build; Lean approach = 1–2 agents |
| Group-chat metaphor becomes noise (too many messages) | Medium | High | Activity-line collapsing (exists), escalation rules, Needs-you as the only interrupt |
| Simulation mistaken for capability in demos | Medium | High | Fix W5; "Demo" badge on simulated flows; this doc's matrix |
| Sandbox security (untrusted generated code, secrets) | Medium (V2) | Critical | Managed microVM isolation, egress allow-lists, secrets injected at runtime never into model context |
| Silent overwrite of imported repos | Medium (V2) | Critical | Branch-only writes, diff-before-apply, Discovery card before first change |
| Store monolith blocks backend swap | High | Medium | `AgentRuntime` seam first (§8) |
| Scope sprawl (every competitor feature) | High | Medium | Non-goals below; thesis test in §2 |
| No tests → regressions during phases | High | Medium | Add Vitest + a few Playwright smoke flows in Phase 0 |

## 12. Prioritised implementation roadmap

Scoring: value to thesis (V), effort (E: S/M/L), risk (R), demo value (D).

### Phase 0 — Credibility fixes (S, do first)
- Rename to Shipbuds across UI, landing, package, docs (W1). V high · E S · D high
- Label simulated import analysis honestly (W5). V med · E S
- Add Vitest + Playwright smoke: sign in → prompt → plan → build → preview live. Protects every later phase (W10).

### Phase 1 — Prove the thesis (M) ← **recommended next**
1. **Clarify card** with defaults + skip (W2). Extend `planFor` to cover a few more domains incl. marketplaces/bookings.
2. **Task model upgrade**: `dependsOn`, `why`, `blocked` / `needs_review` states (W3).
3. **Team strip** in TopBar.
4. **Needs-you card** + one scripted escalation per build (QA finding) (W4).
5. **"Show technical detail"** setting wired to `persona` (W6).

Success test: a first-time viewer can say who is doing what and what needs them within 5 seconds of looking at a mid-build screen.

### Phase 2 — Technical depth (M)
- Tasks tab beside Preview.
- Code: editable buffer + diff view of "agent changes"; Guard Advisory/Blocking (W7).
- Canvas apply → creates a UI/UX task; preview-before-apply.
- Import Discovery card.
- UI/UX specialist in roster.

### Phase 3 — V2 foundation (L)
- Extract `AgentRuntime` seam (W9); `ScriptedRuntime` keeps the demo working.
- Backend + Postgres persistence, real auth.
- First real agent loop for one specialist (Frontend) in a managed sandbox; Preview from the sandbox dev server.
- Model gateway with two providers.

### Later (V3)
Multi-user projects, roles, agent evals, team observability, usage/cost management.

**Roadmap challenge:** the brief's V1 includes GitHub and Deploy. They already exist as simulations; I'd *not* spend V1 effort on them beyond the rename. Real GitHub/Deploy only make sense once real files exist (Phase 3), so building them earlier is building on sand.

### Non-goals (all phases until revisited)
- PM features (sprints, story points, backlogs, Gantt).
- A standalone analytics dashboard inside the product.
- Agent marketplace / custom agent authoring.
- Mobile-native apps.
- Self-hosted sandbox infrastructure before managed providers are outgrown.

## Proposed success metrics (none measured yet)

| Metric | Type | Proposed target (hypothesis) |
| --- | --- | --- |
| Time from first prompt to first Preview | Leading | < 3 min (V2, real build) |
| Clarify-card skip rate | Leading | Watch: > 70% means questions aren't useful |
| Plan approval rate (first plan) | Leading | > 60% |
| Human intervention rate per build | Leading | 1–2 Needs-you per build (0 = not accountable, > 4 = noisy) |
| First-build success rate | Lagging | > 70% (V2) |
| Agent task completion rate | Lagging | > 85% |
| Build retry rate | Lagging | < 20% |
| GitHub connection rate (technical persona) | Lagging | > 40% |
| 7-day project continuation | Lagging | > 30% |
| Cost per successful build | Lagging | Track from day one of V2; set target after 2 weeks of data |

## Open questions

| Question | Owner | Blocking? |
| --- | --- | --- |
| Is the target user for the portfolio demo Maya or Dev? Decides Phase 1 vs 2 order. | You | Yes, for sequencing |
| Is real backend work (Phase 3) in scope for this repo, or does Shipbuds stay a high-fidelity prototype + docs? | You | Yes, for V2 |
| Keep Lean/Balanced/Enterprise naming, or rename to team size ("Solo / Small team / Full team") for Maya? | Design | No |
| Should DMs be invisible to the Manager entirely, or summarised? (Proposed: one-line summary.) | Product | No |
| Write the product case study now, or after Phase 1 when there's something learned? (Proposed: after.) | You | No |

## Implementation log

### Phase 0 + 1 — 2026-11-04 (all SIMULATED unless noted)

| Item | Status | Where |
| --- | --- | --- |
| Rename to Shipbuds in all user-facing copy, `package.json`, `index.html` | IMPLEMENTED | landing, onboarding, auth, vibing, deploy URLs. Persist key `architect-store` kept so saved projects survive; internal identifiers (`WhyArchitect`, `onReturnToArchitect`) and "Architect Guard" unchanged |
| Honest import copy | IMPLEMENTED | `import/ImportWizard.tsx` says "Demo analysis — your repository was not fetched" |
| Clarify card (≤3 questions, defaults, skip, typing skips) | SIMULATED | `scripts.ts` `clarifyFor`; `ClarifyCard`; answers add plan features and survive revisions (`Project.clarified`) |
| Marketplace / booking plan domain | SIMULATED | `planFor` |
| Task model: `dependsOn`, `why`, `needs_review`; tasks chosen per approach | IMPLEMENTED (data) / SIMULATED (execution) | `types.ts`, `store.ts` `TASK_SEQUENCE`, `STRATEGY_TASKS` |
| Needs-you decision card that pauses the build | SIMULATED | `runBuild` / `answerDecision`; `DecisionCard` |
| Team strip with status (working / needs you / failed / done) | IMPLEMENTED | `shell/TeamStrip.tsx` |
| "Show technical detail" toggle → task list in Build card + task in strip tooltip | IMPLEMENTED | `AccountMenu`, `User.persona` |
| Tests | IMPLEMENTED | Vitest, `src/store/store.test.ts` (5 tests). Playwright smoke tests deferred; flow verified manually in the browser |

Behaviour change: Lean runs 3 tasks, Balanced 5 (incl. QA review), Enterprise 7. Previously Balanced always included AI / ML. The last task now ends `done` (it used to stay `running`).

Known gaps: Preview template for marketplace ideas still falls back to the habit-tracker template; a reload mid-build stops the build (timers aren't persisted — pre-existing).

### Interface redesign, phases 1 to 5, 2026-11-07

Tone-separated surfaces and removal of legacy tokens; sidebar closed by default below 1024px; header tools grouped, with GitHub and Deploy merged into one Ship tool (`/ship`, `/ship/deploy`; old URLs redirect); resolved Clarify and Decision cards collapse to one line and only the newest Build card shows; Preview becomes a bottom sheet below 900px; new messages rise in. Commits `bb658cd` to `5684332`. Follow-up the same day: account menu moved to the sidebar footer, older build narration shrinks to quiet lines, the separate "Three ways" bubble is gone so Plan and Approach read as one block (they are still two cards), resolved cards ease in. Left for later: a Ship timeline view, a merged Plan and Approach card, a shared spec for dialogs and empty states. Product docs: [`product/README.md`](./product/README.md).
