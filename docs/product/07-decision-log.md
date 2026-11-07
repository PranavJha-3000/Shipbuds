# Product decision log

Two parts. The first lists decisions already taken, with evidence from the repository. The second lists proposed decisions that have not been made. I have kept them apart so a proposal is never mistaken for history.

Where the original reasoning was not written down, I say so and give the reasoning I can reconstruct from the code and docs. That reasoning is my reading, not a record.

Related: [strategy](./01-strategy.md), [roadmap](./06-roadmap.md).

## Decisions taken

### D1. The Manager is the primary surface and the Preview is secondary

Context: tools like Canvas, Code, GitHub and Deploy compete for attention in a building product.
Options: a dashboard of equal tools; an editor with a chat panel; a chat with tools around it.
Decision: chat first. Everything else supports the conversation or the preview.
Reasoning: the product claim is about conversation and accountability. A dashboard would make it a project tool, which is a stated non-goal.
Trade-off: technical users may want an editor-first layout.
Consequence: the header carries the conversation, and tools sit in one control (`src/components/shell/TopBar.tsx`).
Revisit if: developers in the [sessions](./03-discovery-plan.md) mostly ignore the Manager and work in Code.
Evidence: README "Core loop"; [`docs/platform.md`](../platform.md) principle 1.

### D2. Specialists appear only when the Manager brings them in

Context: a project with six agents from the start is noisy and implies work that is not happening.
Options: show all specialists always; show those relevant to the plan; show none until asked.
Decision: channels are empty until routed, and the Team strip shows active specialists only.
Reasoning: the "team, not a crowd" principle. It also keeps the idea honest, since an idle specialist has nothing to account for.
Trade-off: users may not realise specialists exist.
Consequence: empty channel state reads "Nothing here yet" (README "Notes"); `project.team` lists introduced specialists.
Revisit if: users cannot find specialists or ask where the "team" is.

### D3. Agent-to-agent chatter collapses into one activity line

Context: if every handoff were a bubble, the thread would be unreadable.
Options: show everything; hide agent messages; collapse them.
Decision: only messages addressed to the user are bubbles. The rest collapse into one line naming who was involved (`isActivity` in `src/components/chat/grouping.ts`).
Reasoning: keeps the group-chat feel without a log dump, but still shows work is happening.
Trade-off: developers lose detail in the main thread. They can open the channel.
Revisit if: developers say they cannot reconstruct what happened.

### D4. Simulate everything in the browser and label it

Context: there is no budget or infrastructure for a real runtime, and the aim is to test the interaction model.
Options: build a real runtime first; simulate and say so; hide the simulation.
Decision: simulate, and label simulations in the README ("What is mocked"), the platform doc and in product copy where a user could be misled (for example the import analysis says it is a demo).
Reasoning: a prototype that claims capability it lacks wastes the time of anyone who evaluates it. Honesty is also principle 7.
Trade-off: the prototype cannot show output quality.
Consequence: every claim in this folder separates built, simulated and not built.
Revisit if: the prototype is used for anything that needs real output.

### D5. Ask a few clarifying questions, with defaults, and let the user skip

Context: before Phase 1 the Manager went straight from the first message to a plan, so it read as a template (finding W2 in [`docs/blueprint.md`](../blueprint.md)).
Options: no questions; free-form questions; up to three tappable questions with defaults.
Decision: up to three questions, a default chosen for each, "Let the Manager decide" to skip, and typing a message also skips (`clarifyFor`, `ClarifyCard`).
Reasoning: some clarification is what makes it a teammate, but forcing answers would punish people who just want to see a plan.
Trade-off: defaults can hide a bad assumption.
Consequence: answers become plan features and survive plan revisions. Commit `26c10a2`.
Revisit if: nearly everyone skips with no change in outcome, or defaults often produce a wrong plan. See [metrics](./04-metrics.md).

### D6. One scripted decision pauses the build, and Lean never pauses

Context: the interface needed a concrete example of "needs you" without turning every task into an approval.
Options: no pauses; pause on every task; pause on one real decision.
Decision: Balanced and Enterprise pause once, at QA review, with a plain-language question. Lean never pauses (`runBuild`, `answerDecision`; covered by tests).
Reasoning: interruptions should be rare and meaningful (principle 3). Lean exists for people who want speed.
Trade-off: the pause is scripted, so it proves the interface, not the judgement of when to interrupt.
Revisit if: sessions show people find pauses annoying, or never notice them.

### D7. Plain language by default, technical detail on request

Context: the product serves two audiences with one interface.
Options: two separate modes at sign-up; separate products; one interface with a detail setting.
Decision: a single "Show technical detail" setting. Off by default for new accounts (`User.persona` in `src/store/types.ts`, set in `src/pages/Auth.tsx`). When on, the build card lists every task with owner, reason and dependencies.
Reasoning: avoids asking a new user to classify themselves. Reveals depth without a second UI.
Trade-off: developers must discover the setting.
Revisit if: developers do not find it, or creators turn it on and get lost.

### D8. Vibing is a single secondary button

Context: a break experience is useful during long builds, but must not compete with building.
Decision: one compact button beneath the Preview opens a chooser. The product never claims the user watched anything, because it cannot know what happens in another tab. This follows the brief and is implemented in `src/components/vibing/`.
Revisit if: it distracts from the build in sessions.

### D9. Keep the saved-state key after renaming

Context: the product was renamed from Architect 2.0 to Shipmate (commit `966a1cb`) and then to Shipbuds, but saved projects live under the key `architect-store`.
Decision: rename everything the user sees, keep the storage key.
Reasoning: changing the key would silently erase saved projects for anyone who had them.
Trade-off: an old name remains in code. Recorded in the implementation log of [`docs/blueprint.md`](../blueprint.md).
Revisit if: a migration is added.

### D10. Visual direction: three tones, no decoration

Context: an interface audit found the sidebar and canvas shared one colour, type sizes drifted, avatars used gradients, and the headline used red.
Decision: three surface tones (canvas, sidebar, raised), type taken from a six-step scale, flat avatars, a blue headline accent, tools grouped in one control, resolved cards collapsed to one line, one Ship tool instead of GitHub and Deploy, and the Preview as a bottom sheet on narrow screens (commits `bb658cd` to `5684332`).
Reasoning: hierarchy from tone and spacing, not borders or effects. The brief asked for no decorative gradients or glass, and no excess cards.
Trade-off: the 11px labels moved to 12px on some screens, and some visual character was removed.
Revisit if: sessions show people cannot find Deploy under Ship, or cannot tell sections apart.
Limit: I checked these in a browser pane about 840px wide and a 375px emulation. Wider layouts were not checked.

## Proposed decisions (not yet taken)

### P1. Define success as use after the build, not the build

Proposal: the North Star is weekly successful projects, defined in [metrics](./04-metrics.md#north-star), with user feedback in the definition.
Why: counting builds rewards output volume. It would hide the failure this product most needs to catch, which is an app that was generated and is wrong.
Revisit if: the definition cannot be measured, or the first month of data shows it tracks something else.

### P2. Make failure visible before adding features

Proposal: make build failure reachable and explained before building the Tasks tab or code editing. See [roadmap](./06-roadmap.md) item 4.
Why: today the error path is unreachable, and that is where trust is won or lost.
Revisit if: sessions show people care more about something else.

### P3. Test the thesis with the prototype before building a runtime

Proposal: run the usability sessions in the [discovery plan](./03-discovery-plan.md) first.
Why: it tests the riskiest assumption at almost no cost. A runtime is expensive and would be built on an unproven framing.
Trade-off: it cannot test output quality, so the question of whether specialists beat one agent stays open.
Revisit if: the sessions cannot be run, or answer too little.

### P4. Put a runtime seam in before any real agent work

Proposal: extract an `AgentRuntime` interface so the store calls it and a scripted version stays available (see [`docs/blueprint.md`](../blueprint.md)).
Why: the store holds the scripts and timers directly, which would block a backend swap.
Revisit if: Decision 2 in the [roadmap](./06-roadmap.md#dependencies-and-decision-points) keeps Shipbuds a prototype.

### P5. Compare against a single-agent baseline before committing to specialists

Proposal: when a runtime exists, run the same scenarios as one agent and as a team, and compare as set out in [05-ai-evaluation.md](./05-ai-evaluation.md).
Why: the thesis depends on structure adding value. If it only adds cost, the product should be presented differently.
Revisit if: the baseline cannot be built fairly.
