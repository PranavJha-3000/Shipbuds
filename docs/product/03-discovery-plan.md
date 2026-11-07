# Discovery and validation plan

This is a proposed plan. No interviews, usability sessions or surveys have been run. Nothing below is a finding.

Related: [strategy assumptions](./01-strategy.md#assumptions-that-still-need-validation), [PRD](./02-prd.md), [metrics](./04-metrics.md).

## What the prototype can and cannot test

The current app is scripted. Every reply and build is canned. That limits what a session can prove.

It can test: whether people understand the structure (Manager, specialists, Team strip, Needs-you), whether the clarify step feels helpful, whether the plan is something they would approve, and whether they feel in control.

It cannot test: whether generated software is good, whether the speed is acceptable, or whether people trust real output. Those need a real runtime. I would say this to every participant at the start, and I would not report any result as evidence about output quality.

## Hypotheses

H1. People understand who is doing what from the Team strip and Build card without explanation.
H2. Non-technical creators will answer two or three clarifying questions, and the defaults let them skip without regret.
H3. A single pausing decision (Needs-you) is read as helpful, not as an interruption.
H4. Developers want per-specialist channels and task reasons, and will look at them unprompted.
H5. Non-technical users feel able to approve a plan and judge a preview.
H6. The group-chat framing is clearer to people than "an AI agent".

## Riskiest assumptions

In order of damage if wrong:

1. H1 and H6: the framing itself. If people see noise, not structure, the thesis fails.
2. Whether specialists add value over one agent. This cannot be tested without a runtime, so the prototype session should at least test whether people expect specialists to matter.
3. H5: judging a preview. If creators cannot tell good from bad, the preview gives false confidence.
4. Whether one product can serve both groups.

## Research questions

1. What do people do today when they have an app idea and want a working version?
2. Where do they get stuck or lose trust when using an AI coding tool?
3. What do they want to know while an AI works, and what do they not care about?
4. What decisions do they want to make themselves, and what should the system decide?
5. How do they judge whether the result is right?
6. What would make them come back to the same project tomorrow?

## Participants

Target five to eight per group for the first round. This is a pragmatic number for spotting repeated problems, not a statistical sample.

Group A, creators: people with an app or business idea and no engineering background. Mix those who have tried an AI builder and those who have not.

Group B, developers: people who ship software and have used an AI coding assistant on a real project in the last month. Include a few who maintain an existing repository.

Exclude people who know the project or me personally where possible, and anyone who works on a competing product.

## Interview guide

Thirty minutes, before showing anything. Ask about past behaviour, not opinions about Shipbuds.

1. Tell me about the last time you wanted to build something with software. What happened?
2. What did you try? What tools or people did you use?
3. Walk me through the moment it was hardest. What did you do next?
4. If you used an AI tool: what did it do that you did not expect? How did you find out?
5. How did you decide whether to trust the result?
6. Who, if anyone, did you ask for help? What did you ask?
7. What did you wish you had been asked before it started?
8. When did you last stop using a tool, and why?

Developers, additionally:
9. When an AI changes several files, how do you review it?
10. Describe a time you could not tell why a change was made.

Probes: "What do you mean by that?", "What happened next?", "Can you show me?" Avoid asking if they would use Shipbuds.

## Prototype usability tasks

Fifteen to twenty minutes, after the interview. Use the app as it is, and tell the participant it is a demo with scripted replies. Ask them to think aloud.

Task 1, creators: "You want a site where tutors list themselves and students book demo classes. Start it here." Observe: do they answer or skip the questions? What do they expect from the Manager?

Task 2: "Tell me what you think will happen next." Observe whether they can describe the plan without help. Ask them to approve or change it.

Task 3: "While it builds, tell me who is doing what and whether anything needs you." Success: they answer within five seconds and name the pending decision. This is the thesis test.

Task 4: when the Needs-you card appears, ask them to decide and say why. Observe whether the wording is clear and whether it feels like an interruption.

Task 5: "Imagine you want to change something. What would you do?" Observe whether they use the Manager or look for a menu.

Task 6, developers: "Find out why the backend made its choice." Observe whether they find the technical detail toggle and the channels.

Note for task 1: a tutor marketplace shows the habit tracker preview today (see R5 in the [PRD](./02-prd.md)). Say so before the session, or fix it first, because it will dominate the feedback.

## Recording findings

One row per observation, in a shared file kept next to the recordings:

- Participant code and group.
- Task or question.
- What happened, in plain words.
- A short quote, if there is one.
- Hypothesis it relates to.
- Strength: seen once, seen by several people, or seen by most.
- Type: confusion, delight, workaround, request, or silence.

After each round, group observations by hypothesis and write one paragraph per hypothesis. Keep what people did apart from what they said. Mark any claim that rests on one person.

## What would change the direction

Evidence that supports the thesis: most participants name who is doing what within five seconds, describe the Needs-you decision correctly, and describe the structure in their own words as a team.

Evidence that weakens it: people say it is "just a chat", ignore the Team strip, or prefer a simple progress bar. Developers ignore channels and use only the Manager.

Evidence that would change the plan:
- If creators skip every question and the plan is still approved, the clarify step may be cost without value. Reduce it.
- If most participants find the pause annoying, move decisions into the summary instead of blocking.
- If creators and developers want different things, split the product or choose one for the next stage.
- If almost nobody can judge a preview, the product needs a way to check the work for them.

These are proposed thresholds. I would agree them before running sessions, so I cannot move them afterwards.

## What happens next

Run one pilot with two people and fix anything that blocks the session. Run the first round. Write up findings in a separate file, `docs/product/research/`, named by round, and update the [strategy assumptions](./01-strategy.md#assumptions-that-still-need-validation) and the [roadmap](./06-roadmap.md) in the same change.
