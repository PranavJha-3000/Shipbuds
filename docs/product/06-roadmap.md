# Prioritisation and roadmap

Related: [strategy](./01-strategy.md), [PRD](./02-prd.md), [discovery plan](./03-discovery-plan.md), [metrics](./04-metrics.md), [AI evaluation](./05-ai-evaluation.md). The longer audit behind this is [`docs/blueprint.md`](../blueprint.md).

## How I prioritise

There are no users, no usage data and no revenue, so I will not produce RICE scores. Numbers for reach and impact would be invented. I use four plain judgements for each item.

Thesis value: does it help prove or disprove "who is doing what, and what needs me?" High, medium or low.

Confidence: how sure am I it helps, given what I know? Based on evidence in the repository or a stated reason, not on enthusiasm.

Effort: small (a day or two), medium (about a week), large (weeks or a new system).

Risk: what could go wrong, including damaging trust.

Rules that break ties. Evidence about the riskiest assumption comes first. Anything that makes the prototype misleading comes before anything that makes it bigger. Honest behaviour beats impressive behaviour.

## Where the product stands

Shipped so far, all simulated except where noted. Phase 0: rename to Shipbuds, honest import copy, store tests. Phase 1: clarify card, richer task model, Team strip, Needs-you decision, technical-detail toggle (commit `26c10a2`). Visual redesign in five phases: tone-separated surfaces, narrower-screen sidebar, grouped tools, collapsed resolved cards, GitHub and Deploy merged into Ship, Preview as a bottom sheet on narrow screens (commits `bb658cd` to `5684332`).

Gaps found in the audit, checked against the code:
- The tutor marketplace example shows the habit tracker preview (`pickTemplate` in `src/store/store.ts`). Plan and result disagree.
- Build failure is unreachable. No code sets a build to the error state.
- A reload during a build leaves it stuck.
- Two tabs overwrite each other.
- Code is read-only and Guard findings are canned.
- Nothing measures anything. There is no event log.
- No research has been done.

## Prioritised list

1. Run the first round of usability sessions on the prototype. Thesis value high, confidence high that it teaches something, effort medium, risk low. It tests the riskiest assumption and costs no engineering.
2. Add a local event log. Thesis value medium (it makes item 1 produce data), confidence high, effort small, risk low. See [metrics](./04-metrics.md#first-step).
3. Fix the marketplace preview mismatch. Thesis value medium, confidence high, effort small, risk low. It removes a distraction that would dominate item 1 and shows the plan-versus-result check in action.
4. Make build failure reachable, with a plain-language message and retry. Thesis value high, confidence high, effort small to medium, risk low. How a product fails is where people decide to trust it, and today the path cannot be seen.
5. Survive a reload mid-build. Value medium, confidence high, effort medium, risk medium (persisting timers touches the store). Stops a demo from breaking.
6. Tasks tab beside Preview. Value medium, confidence medium, effort medium, risk low. It is the expanded form of the build card. I would wait for item 1 to show whether people want more detail.
7. Code editing with diffs and Advisory or Blocking Guard. Value medium for Dev, confidence medium, effort medium to large, risk medium. Only worth it if Dev is the first real user.
8. Canvas changes create a task. Value medium, confidence low, effort medium. Serves the secondary persona.
9. Extract an `AgentRuntime` seam. Value high for the future, confidence high, effort medium, risk low. It lets the interface survive a backend. I would do it just before any real agent work, not before.
10. One real specialist in a sandbox. Value very high, confidence unknown, effort large, risk high. This is the first moment the product can be evaluated for quality. It comes after the decision points below.

The interface items from the redesign are done: account menu in the sidebar footer, quiet build narration, Plan and Approach joined, a Ship progress stepper, and written interface rules in [`docs/design-system.md`](../design-system.md). Vibing was not changed. These are craft items, ordered after the evidence items above.

## Now, Next, Later

Now: items 1 to 4. Goal: learn whether the framing works, and make sure the prototype is honest enough to show.

Next: items 5 to 9, chosen by what the sessions show. If creators dominate, favour 6 and a better clarify step. If developers dominate, favour 7 and 9.

Later: item 10, real GitHub and Deploy once real files exist, multi-user projects, a proper evaluation pipeline following [05-ai-evaluation.md](./05-ai-evaluation.md), and cost management.

## Dependencies and decision points

Decision 1, after the first sessions: is the first real user Maya or Dev? It sets the order of Next.

Decision 2: is real runtime work in scope for this project, or does Shipbuds stay a high-fidelity prototype with strong documentation? If it stays a prototype, items 9 and 10 are dropped and items 1 to 4 are the finish line.

Decision 3: before item 10, pick a sandbox provider and decide whether specialists are separate agents or one agent presented as a team. Run the single-agent baseline in the evaluation first.

Item 10 depends on 9. Real GitHub and Deploy depend on 10. Item 7 depends on real files for its full value.

## What I would deliberately not build yet

Real GitHub and Deploy integrations. They would run on simulated files.

An agent marketplace or custom agents. It adds surface before the core claim is proven.

Sprint, backlog or analytics dashboards inside the product. They would turn Shipbuds into the project management tool it is trying not to be.

More approaches or more specialists. Three approaches and five specialists are already more than has been tested.

Team accounts and sharing. Nobody has used it alone yet.

Native mobile apps.

## Assumptions behind this order

I assume the riskiest question is whether the framing helps people, and that a prototype can answer it. I assume sessions with five to eight people per group will show repeated problems. I assume a local event log is enough for the first round. If any of these is wrong, the order changes, and the [decision log](./07-decision-log.md) should record why.
