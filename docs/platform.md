# Shipbuds — Platform

**Vibe coding feels like a group chat.**

Building software should feel as natural as talking to a team. Shipbuds gives you a Manager who coordinates specialised AI collaborators — each with a defined job, visible progress and clear accountability — while a live Preview shows the product taking shape.

> Honesty note: Shipbuds today is a **frontend prototype**. Every AI reply, build, GitHub operation and deployment is simulated in the browser. See [Current capabilities](#current-capabilities). The audit behind this page is [`blueprint.md`](./blueprint.md).

## Product thesis

Single-chatbot coding tools hide *who decided what*. Shipbuds makes the work **collaborative** (a team, not a bot), **conversational** (messaging, not configuration), **observable** (who is doing what, what is blocked, what needs you) and **accessible** (plain language by default, technical depth on demand).

Thesis test: at any moment a user can answer *"who is doing what, and what needs me?"* in under five seconds.

## Personas (assumptions — not yet researched)

| Persona | Wants | Shipbuds gives |
| --- | --- | --- |
| **Maya**, non-technical founder | Turn an idea into a working product without learning to code | Manager that clarifies, plain-language plan, Preview, rare well-explained interruptions |
| **Dev**, full-stack engineer | Ship faster without losing control or traceability | Specialist channels, DMs, task ownership with rationale, code/diffs, git, model/framework control |
| **Sam**, design-minded builder | Shape screens visually | Canvas → Preview loop |

## Lifecycle

**Idea → Clarify → Plan → Team → Build → Preview → Review → GitHub → Deploy**

## Feature map

| Area | Purpose | Status |
| --- | --- | --- |
| Auth & onboarding | Low-friction entry, Manager setup | Simulated sign-in |
| Managers & projects | Many projects per Manager, isolated context | Implemented (local) |
| Manager conversation | Primary interface: intent, plans, approvals | Implemented UI, scripted replies |
| Clarify card | Ask ≤3 questions with defaults | Implemented UI, scripted questions |
| Plan + Approach cards | Reviewable plan, Lean/Balanced/Enterprise | Implemented UI, regex plan |
| Specialist channels & DMs | Segmented, accountable work | Implemented UI, scripted replies |
| Team strip | Who is doing what, who needs you | Implemented |
| Task model | Owner, reason, dependencies, needs-review state | Implemented data, timer-driven progress |
| Needs-you decisions | The one interruption: QA asks, build pauses | Simulated (one scripted question per reviewed build) |
| Technical-detail toggle | Plain by default; full task list on demand | Implemented |
| Tasks tab | Full task board beside Preview | Future (Phase 2) |
| Preview | Live view of the product | Implemented iframe, canned content |
| Canvas | Visual creation/refinement | Property editing implemented; image→UI simulated |
| Code + Guard | Inspect files, advisory checks | Read-only, canned |
| GitHub | Connect, commit, push, conflicts | Simulated |
| Import | Bring an existing repo | Simulated |
| Deploy | Preview/prod, logs, QR, rollback | Simulated |
| Vibing | Secondary break experience | Implemented |
| Agent faces | BoopFace avatars for Managers and specialists, with state expressions | Implemented |
| Model / framework choice | Defaults for Maya, control for Dev | Future |

## Current capabilities

**IMPLEMENTED:** routing and guards; Manager/project CRUD with pin/archive/search; thread model (Manager, channels, DMs) with grouping, unread, typing; plan/strategy/build/clarify/decision cards; task model with owners, reasons and dependencies; Team strip; "Show technical detail" toggle; sandboxed Preview with viewports and states; Canvas element selection and property editing; file tree and highlighted code; Vibing chooser, external-tab lifecycle and music player; design system; `localStorage` persistence.

**SIMULATED:** sign-in (incl. Google chooser); integration connections; all Manager and specialist replies (regex + scripts), including the clarifying questions and the QA decision; build progress (timers); Preview content (templates); screenshot/sketch-to-UI; Guard findings; GitHub; import analysis; deployment (production always fails to show the error path).

**FUTURE:** everything in the production architecture — real auth, database, LLM agents, sandboxes, git, deploy providers, model gateway.

## Roadmap

| Phase | Goal | Key items |
| --- | --- | --- |
| 0 ✓ | Credibility | Rename to Shipbuds; honest import copy; store tests (done 2026-11-04) |
| 1 ✓ | Prove the thesis | Clarify card; richer task model; Team strip; Needs-you escalations; technical-detail toggle (done 2026-11-04) |
| 2 | Technical depth | Tasks tab; code editing + diffs; Advisory/Blocking Guard; Canvas → task; Import discovery |
| 3 (V2) | Real execution | Runtime seam; backend + DB + auth; one real agent in a sandbox; model gateway |
| V3 | Collaboration | Multi-user, roles, agent evals, cost management |

Long-term: the place where individuals and teams work with AI software specialists to create, improve and ship software.

## Product principles

1. **Manager first, Preview second.** Every other tool supports those two.
2. **A team, not a crowd.** Specialists appear only when needed.
3. **Interrupt rarely, explain always.** Escalate only scope/cost/data decisions or repeated failure.
4. **Accountable by default.** Every task has an owner, a reason and an output.
5. **Never overwrite silently.** Discover, explain, diff, then apply.
6. **One product, two densities.** Plain language by default; technical detail on demand.
7. **Honest about what's real.** Simulations are labelled in docs and product.
8. **Building is primary.** Vibing and everything else stay secondary.
