# Shipbuds — Proposed Production Architecture

**Status: FUTURE. None of this exists.** The current implementation is described in [`architecture.md`](./architecture.md). This document is a design proposal with reasoning, not a description of running systems.

## System overview

```
Browser (React app — existing UI)
  │  HTTPS (REST for commands) + SSE (event stream) + WS (terminal only)
  ▼
Edge / API gateway ── auth (session cookie / JWT), rate limits, tenant resolution
  │
  ├─ App API (TypeScript, Fastify/Hono)
  │    users · orgs · projects · threads · messages · tasks · integrations · billing
  │    └─ Postgres (system of record) · Redis (pub/sub, rate limits, presence)
  │
  ├─ Orchestrator (durable workflows: Temporal or Inngest)
  │    Manager workflow → specialist activities → approval waits → retries
  │    └─ Model gateway ── Claude / GPT / Gemini / OSS adapters
  │
  ├─ Sandbox service ── managed microVMs (E2B / Daytona) per project
  │    repo checkout · dev server · tests · git
  │    └─ Preview proxy ── <project>.preview.shipbuds.app → sandbox port
  │
  ├─ Git service ── GitHub App (installations, webhooks)
  └─ Deploy service ── Vercel / Netlify / Fly adapters
```

## Frontend changes

Minimal. The store gains one seam: `AgentRuntime` with `send(projectId, threadId, text)` and an event subscription. `ScriptedRuntime` wraps today's `scripts.ts` + timers; `RemoteRuntime` posts commands and applies SSE events (`message.created`, `task.updated`, `preview.ready`, `approval.requested`, `deploy.log`) to the same store shape. Server becomes the source of truth; `localStorage` becomes a cache.

## Data model (Postgres)

`orgs`, `users`, `memberships(role)`, `managers`, `projects(org_id, framework, model_policy)`, `threads(project_id, kind, agent)`, `messages(thread_id, author, kind, card jsonb)`, `tasks(project_id, owner, status, depends_on[], why, output jsonb, reviewer)`, `approvals(task_id, question, options, decided_by)`, `runs(task_id, model, tokens_in/out, cost, latency)`, `sandboxes(project_id, provider_id, state)`, `repos`, `commits`, `deployments(env, status, url, source_commit)`, `usage_ledger`.

Every row carries `org_id`; row-level security enforces tenant isolation as a second line behind the API.

## Agent harness

- **Manager workflow** (one per user request): clarify → plan (structured JSON validated against a schema) → wait for approval → create tasks → schedule specialists respecting `depends_on` → review outputs → summarise.
- **Specialist activity**: loop of model call → tool calls (read/write file, run command, query preview) → validate (typecheck/tests/lint in sandbox) → report `done | needs_review | blocked`.
- **Context management**: per-project memory = repo index (file tree + embeddings of key files) + plan + task history summaries. Each specialist gets only its slice plus the plan; Manager gets summaries, not transcripts.
- **File ownership**: a specialist writes only within its declared paths; anything else becomes a handoff request through the Manager.
- **Error recovery**: activity retries with backoff for transient failures; a validation failure feeds the error back for up to N self-repair attempts; then escalate.
- **Human approval**: a durable `await approval` step — the workflow can wait hours without holding compute. This is why a durable engine beats a plain job queue.
- **Long-running tasks**: heartbeated activities; UI shows progress from events, not polling.

**Honest caveat:** six concurrent specialists is a UX metaphor. Cost and coherence likely favour fewer real model loops (e.g. one coding agent switching roles) behind the same accountable surface. Decide from measured cost-per-successful-build, not ideology.

## Sandboxes — comparison

| Option | Isolation | Cold start | Persistence | Ops burden | Fit |
| --- | --- | --- | --- | --- | --- |
| **E2B** (Firecracker, managed) | microVM | ~sub-second to seconds | Pause/resume snapshots | Low | **Start here** — built for AI code exec |
| **Daytona** (managed/self-host) | container/VM | seconds | Persistent workspaces | Low–Med | Strong alternative; good for long-lived dev envs |
| Self-hosted Firecracker | microVM | fast once tuned | DIY snapshots | High | Only when sandbox spend dominates |
| Kubernetes pods (gVisor/Kata) | container + sandboxed runtime | seconds | PVCs | Med–High | If already running K8s at scale |
| Plain Docker | container (weak for untrusted code) | fast | volumes | Med | Not acceptable for untrusted generated code |

Networking: default-deny egress with allow-list (package registries, GitHub, deploy APIs). Secrets injected as env at runtime, never placed in model context or logs. Idle sandboxes pause after N minutes; resume on project open.

## Model gateway

- Provider adapters normalise messages, tool schemas and tool-call responses into one internal format, so swapping models never changes task state or tool execution.
- Routing policy per task type (e.g. planning → strongest reasoning model; bulk edits → cheaper model); user override for technical persona.
- Retry on 429/5xx with provider fallback; idempotency keys on tool side-effects so a retry can't double-apply.
- Token + cost metering into `runs`; per-project and per-org budgets with soft (warn) and hard (pause + ask) limits.
- Prompt caching where supported for repo context.

Build vs buy: start with a thin in-house adapter (few providers, full control of tool-call fidelity); a hosted router (e.g. OpenRouter/LiteLLM) is fine for OSS breadth but adds a hop and a failure domain.

## Communication & preview routing

- Commands: REST, authenticated by session cookie (httpOnly, SameSite) — CSRF token on mutations.
- Events: SSE per project (simple, proxy-friendly, auto-reconnect with `Last-Event-ID`); WebSocket only for interactive terminal.
- Preview: wildcard subdomain per project, proxied to the sandbox dev server, gated by a short-lived signed token; served on a separate registrable domain from the app so generated code can't read app cookies. Iframe keeps `sandbox` attributes.

## GitHub & deployment

- **GitHub App** (not OAuth App): per-repo installation, least-privilege (contents, pull requests, checks), webhooks for push/PR events to detect upstream changes.
- Git runs in the sandbox. Shipbuds works on a `shipbuds/<task>` branch; merges via PR or explicit user action. Never force-pushes the default branch. Conflicts surface as a Needs-you card with a diff.
- Deploy adapters (Vercel first — best preview-per-branch story; Netlify, Fly for backends). Rollback = re-promote a previous deployment, recorded as a new history entry (matches current UI behaviour).

## Scale & reliability (thousands of concurrent users)

- **Multi-tenancy**: shared API/DB with `org_id` + RLS; per-tenant rate limits and concurrency caps.
- **Queueing / workers**: durable workflow engine with separate task queues for model calls, sandbox ops and deploys, so a provider outage doesn't stall git or deploy.
- **Sandbox scheduling**: managed provider handles placement; we enforce per-org concurrent-sandbox limits and pause idle ones — idle sandboxes are the dominant cost risk.
- **Autoscaling**: stateless API and workers scale horizontally on queue depth; Postgres via managed service with read replicas; Redis for fan-out of SSE events across API nodes.
- **Observability**: OpenTelemetry traces spanning request → workflow → model call → tool → sandbox; per-task cost/latency; error budgets on first-build success and preview-ready latency.
- **Cost controls**: budgets in the gateway, cheaper-model routing, context trimming, sandbox auto-pause.
- **Failure recovery**: workflows resume from last completed step; sandboxes reconstructable from git + snapshot; deploys idempotent per commit.

## Limitations of this proposal

No load testing, pricing analysis or vendor evaluation has been done. Cold-start and cost figures above are directional, from vendor positioning, and must be verified before commitment.
