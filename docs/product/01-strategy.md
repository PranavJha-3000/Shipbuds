# Product strategy and brief

This document says what problem Shipbuds is aimed at, who it is for, and what I still do not know. Everything marked "Known" can be checked in the repository. Everything marked "Hypothesis" is a belief I have not tested. Shipbuds has no users, no telemetry and no interviews so far, so most of the interesting claims are hypotheses.

Related: [PRD](./02-prd.md), [discovery plan](./03-discovery-plan.md), [decision log](./07-decision-log.md).

## The problem

Most AI coding tools give you one chat box. You type, text streams back, and files change. This works when you can read the result. It breaks down in two ways.

A person without an engineering background cannot tell whether the output is good. They also cannot tell what the AI decided on their behalf. A developer can read the code, but on a large change a single thread loses context and they cannot tell which decision caused which bug.

Hypothesis: the shared cause is that the work has no visible structure. Nobody is accountable for a piece of it, so there is nothing to ask about, approve or push back on.

Shipbuds tries to add that structure in a form people already understand. A Manager talks to you. Specialists own parts of the work. You can see who is doing what and what is waiting on you.

## Who it is for

These are working personas from [`docs/blueprint.md`](../blueprint.md). They are assumptions, not research findings.

Maya is a non-technical founder with an idea such as a tutoring marketplace. She needs someone to turn the idea into requirements, a plan she can say yes to, and a preview she can judge by looking at it. She does not want to see file paths or logs.

Dev is a full-stack engineer who already has a repository. He wants to ship faster without losing control. He needs to see which specialist did what and why, review changes before they land, and keep git as the source of truth.

Sam is a design-minded builder who thinks in screens. This is a secondary persona, served by Canvas.

The product has to serve Maya and Dev with the same screens at two levels of detail. The "Show technical detail" setting in the account menu is the current answer to that (`src/components/shell/AccountMenu.tsx`).

## Jobs to be done

For Maya: when I have an idea and no engineering team, help me turn it into something I can show people, so I can decide whether it is worth continuing.

For Dev: when an AI changes my project, show me who changed what and why, so I can trust it or correct it quickly.

The pain points behind these jobs are stated in the problem section. They are hypotheses until the interviews in the [discovery plan](./03-discovery-plan.md) happen.

## Promise and positioning

Promise: vibe coding feels like a group chat. You talk to a Manager, the Manager coordinates specialists, and you can always answer one question in a few seconds: who is doing what, and what needs me?

That last question is the test for the whole product. If a first-time viewer cannot answer it from a mid-build screen, the group-chat framing is only decoration. The Team strip and the Needs-you card exist to pass this test.

## Alternatives

I have not benchmarked named products, so this comparison is by category and is a hypothesis about where Shipbuds could differ.

Single-agent app builders are fast and approachable, but the work is one stream of text. IDE agents give developers control, but they are hard for a non-technical person to use. Hiring a freelancer gives accountability, but costs money and takes days. Shipbuds is aiming for the speed of the first, the control of the second and the accountability of the third.

The weak point is obvious. If specialists are only a label on top of one model call, the structure is cosmetic and a single strong agent would be faster and cheaper. The evaluation framework in [05-ai-evaluation.md](./05-ai-evaluation.md) is partly there to answer that.

## Why this is worth pursuing

Known: the interaction model already exists in the prototype. Manager, channels, private DMs, the Team strip and a pausing Needs-you decision are built and covered by a small test suite (`src/store/store.test.ts`).

Hypothesis: accountability is what people lack with current tools, more than raw capability. This is the claim most worth testing, and it can be tested cheaply with the prototype before any real agent runtime is built.

## Principles

These come from [`docs/platform.md`](../platform.md) and I still hold them.

1. Manager first, Preview second. Other tools support those two.
2. A team, not a crowd. Specialists appear only when the Manager brings them in.
3. Interrupt rarely, explain always. Only decisions about scope, cost or data should reach the user.
4. Every task has an owner, a reason and an output.
5. Never overwrite silently. Discover, explain, diff, then apply.
6. One product, two densities.
7. Be honest about what is real. Simulated behaviour is labelled in the product and the docs.
8. Building is primary. Vibing and other extras stay secondary.

## Non-goals

No sprints, story points, backlogs or Gantt charts. Shipbuds should not become a project management dashboard.

No agent marketplace or custom agent authoring.

No native mobile apps.

No self-hosted sandbox infrastructure until managed providers are outgrown.

No real GitHub or Deploy integration before real generated files exist. Building them earlier would sit on simulated data.

## What is real today

Known, from the repository: a React and TypeScript single-page app with no backend. Every Manager reply, plan, build step, GitHub action and deployment is scripted in the browser (`src/store/scripts.ts`, `src/store/store.ts`). State is stored in `localStorage`. The README section "What is mocked" lists each simulation.

This matters for strategy. The prototype can test whether the structure helps people understand and control the work. It cannot test whether the generated software is any good, because nothing is generated.

## Assumptions that still need validation

Ordered by how much damage they would do if wrong.

1. People care about seeing who is doing what, enough to prefer it to a single chat. If not, the thesis fails.
2. Maya will answer two or three clarifying questions rather than find them annoying. The clarify card ships with defaults and a skip, so this is partly hedged.
3. Specialists add value over one strong agent once real models are involved. Unknown until there is a runtime to compare.
4. One interaction model can serve both Maya and Dev. They may need different products.
5. A pausing decision card is welcome rather than an interruption. The prototype has exactly one scripted example.
6. Non-technical users can judge a preview well enough to approve it.

How each gets tested is in the [discovery plan](./03-discovery-plan.md). How success is measured is in the [metrics plan](./04-metrics.md).
