# Shipbuds product documents

Shipbuds is a vibe-coding product built around one idea: it should feel like a group chat. You talk to a Manager, the Manager coordinates specialist AI teammates, and you can always tell who is doing what and what needs you. It is meant for non-technical creators and for developers, using the same screens at two levels of detail.

Today it is a working front-end prototype. Everything the AI does is scripted in the browser, so these documents are about product thinking, not measured results. There are no users, no telemetry and no research yet, and each document says what is known, what is assumed and what is not built.

## The documents

1. [Strategy and brief](./01-strategy.md). The problem, who it is for, the promise, alternatives, principles, non-goals and the assumptions most worth testing.
2. [PRD: idea to shipped application](./02-prd.md). Requirements, acceptance criteria and edge cases for the main journey, each marked built, partial or not built.
3. [Discovery and validation plan](./03-discovery-plan.md). Hypotheses, interview guide, usability tasks, and what evidence would change the direction. A plan, not results.
4. [Metrics and instrumentation](./04-metrics.md). A proposed North Star, a metric tree, guardrails and event definitions, built around the gap between a generated app and a successful one.
5. [AI quality and evaluation](./05-ai-evaluation.md). A rubric, scenarios, severity levels and a failure review process for judging an AI product beyond the demo.
6. [Prioritisation and roadmap](./06-roadmap.md). How items were ordered without invented scores, the Now, Next and Later view, and what is deliberately not being built.
7. [Decision log](./07-decision-log.md). Real decisions with evidence from the repository, separate from proposed ones.

## Suggested reading order

If you have ten minutes: the strategy, then the decision log.

If you want to see how I would evaluate the product: the AI evaluation, then the metrics.

If you want to see how I turn an idea into requirements: the PRD, then the roadmap.

If you want to see how I would check my own assumptions: the discovery plan.

## Where the rest lives

These documents summarise and link to the earlier engineering and product notes instead of repeating them.

- [`docs/platform.md`](../platform.md): the product thesis, feature map and what is implemented or simulated.
- [`docs/blueprint.md`](../blueprint.md): the audit, the full roadmap and the implementation log.
- [`docs/architecture/architecture.md`](../architecture/architecture.md): how the prototype is built.
- [`docs/architecture/production-architecture.md`](../architecture/production-architecture.md): what a real version would need.
