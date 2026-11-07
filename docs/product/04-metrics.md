# Metrics and instrumentation plan

Existing instrumentation: none. The app has no analytics, no event log and no telemetry (a search of `src/` finds no tracking code). Every number below is a proposal. There are no measured results.

Related: [strategy](./01-strategy.md), [PRD goals](./02-prd.md#goals), [AI evaluation](./05-ai-evaluation.md), [roadmap](./06-roadmap.md).

## Generated is not the same as succeeded

An app being generated tells me the system ran. It does not tell me the user got what they wanted. A build can finish and still be wrong, unusable or abandoned. Most of this plan is about telling those two things apart.

In the current prototype the difference is invisible, because every build "succeeds" on a timer. These metrics become meaningful once a real runtime exists, though a few can be collected in usability sessions with the prototype.

## North Star

Proposed: weekly successful projects.

A successful project is one that reached a live preview and then met at least one of these within seven days: the user shared or deployed it, or came back and changed it, and did not report that it was wrong.

Why this one: it counts outcomes, not builds. It needs the user to do something after the build, which filters out curiosity and abandoned demos. It also rewards getting it right the first time over generating more output.

Weakness to watch: "came back and changed it" could mean it was wrong. That is why the user-reported "this is not what I asked for" signal below is part of the definition. I would revisit the definition after the first month of real data.

## Metric tree

Weekly successful projects depends on four things.

Activation: a new user gets to an approved plan.
- Time to first plan: first message to plan shown.
- Plan approval rate on the first plan.
- Clarify card answered, skipped, or ignored.

Build quality: the build works and matches the plan.
- First-build success rate: a build reaches a live preview with no retry.
- Plan match rate: share of plan features findable in the result (reviewed, see [evaluation](./05-ai-evaluation.md)).
- Retry rate and task failure rate.

User control: the person feels informed, not interrupted.
- Needs-you decisions per build. Zero may mean no accountability. Many may mean noise.
- Decision response time.
- Plan revision count before approval.

Return: the project matters to them.
- Seven-day project continuation.
- Changes requested after first preview.
- Deploy or share rate.

## Activation, engagement, retention, quality

Activation: first plan approved within the first session. Proposed target to calibrate: most new users, within five minutes. No benchmark exists yet.

Engagement: messages per project per week, channel or DM opens, technical-detail toggle use. The last two split Maya from Dev behaviour.

Retention: projects continued after seven days, users with a second project within thirty days.

Quality: first-build success, plan match, rollbacks per deployment.

## The idea-to-shipped funnel

1. Project created.
2. First idea message sent.
3. Clarify answered or skipped.
4. Plan shown.
5. Plan approved.
6. Build started.
7. Build reached live preview.
8. User requested a change.
9. Deployment started.
10. Deployment succeeded.
11. Project continued after seven days.

The step I care most about is between 7 and 11. Plenty of tools get a user to a generated app. The harder drop is between generated and used.

## Guardrails

These must not get worse while other metrics improve.
- Median time to first preview.
- Cost per successful project, from the first week of real runs.
- Share of builds flagged unsafe by the checks in [evaluation](./05-ai-evaluation.md).
- User-reported "not what I asked for" rate.
- Unrecoverable errors per hundred builds, meaning the user had no next step.
- Needs-you decisions per build staying under about four. This is a guess to calibrate.

## Proposed events

Not implemented. Names use `object_action`. Every event carries `project_id`, an anonymous `user_id`, `timestamp`, and `persona` (the "Show technical detail" setting).

| Event | Fires when | Properties |
| --- | --- | --- |
| `project_created` | A new project is created | `source` (new, import) |
| `idea_submitted` | First message is sent | `length`, `matched_domain` |
| `clarify_resolved` | Clarify card is answered or skipped | `how` (answered, skipped, typed_over), `answers` |
| `plan_shown` | Plan card appears | `revision`, `feature_count`, `team` |
| `plan_revised` | User requests a change to the plan | `revision` |
| `approach_selected` | An approach is chosen | `strategy` |
| `build_started` | Start building is pressed | `strategy`, `task_count` |
| `task_status_changed` | A task changes status | `task_id`, `owner`, `from`, `to` |
| `decision_requested` | Needs-you card appears | `from`, `task_id` |
| `decision_answered` | User answers it | `choice`, `seconds_to_answer` |
| `build_finished` | Build ends | `state` (live, failed), `seconds`, `retries` |
| `preview_viewed` | Preview is opened | `viewport` |
| `change_requested` | User asks for a change after first preview | `routed_to` |
| `feedback_given` | User marks result right or wrong | `value`, `reason` |
| `deploy_started` | Deploy begins | `env` |
| `deploy_finished` | Deploy ends | `env`, `state`, `rolled_back` |
| `technical_detail_toggled` | Setting changes | `on` |

Two events carry the most weight and do not exist in any form today: `feedback_given` and `change_requested`. Without them I can count builds but not success.

Data that already exists in the store and could back-fill a rough version: project `createdAt`, `lastOpenedAt` and `lastView`, and build `startedAt` (`src/store/types.ts`). They are timestamps on local state, not events, and give no history.

## How metrics inform decisions

First-build success below the level I set: stop adding features and work on the build quality items in the [roadmap](./06-roadmap.md).

Clarify skipped by nearly everyone with no change in plan approval: shorten or remove the step.

Decisions per build near zero: the Manager is deciding too much silently. Near or above the ceiling: the escalation rules are too eager.

Plan approved but "not what I asked for" reported often: the plan is not specific enough, or the build drifts from it. The [evaluation framework](./05-ai-evaluation.md) separates the two.

High deploy rate but low continuation: people ship once and leave. Look at the return reasons before building retention features.

Developers who open channels but never use the Manager, or the reverse: evidence for or against one product serving both groups.

## First step

Before any real runtime, add a local event log behind a single `track()` function and write events to `localStorage` during usability sessions. It costs little and makes the [discovery sessions](./03-discovery-plan.md) produce data instead of impressions. A hosted analytics tool can come later.
