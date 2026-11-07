# BoopFace Avatars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the initials and flat colour discs that stand in for Managers and specialist agents with BoopFace robot faces that show each agent's state.

**Architecture:** Add the `boopface` npm package (a `<boop-face>` Web Component, MIT, zero dependencies). One new wrapper, `BoopAvatar`, is the only file that touches the custom element. `Identity` (Managers) and `SpecialistIdentity` (agents) render it, `TeamStrip` and the Manager header drive its expression from existing task and typing state. Pure mapping code (which skin, which expression) lives in its own file so it can be unit tested in Vitest's node environment.

**Tech Stack:** React 18, TypeScript strict, Vite 5, Tailwind 3, Vitest 2 (node environment, no jsdom), `boopface@0.8.0`.

**Spec:** none written. The requirement is the user's message in chat: "use https://github.com/CX-ArtLab/BoopFace.git to replace generic looking pfp for various agents/managers". Facts about the library come from its README at that repository, read on 2026-11-07.

## Global Constraints

- Use the published npm package `boopface` at `0.8.0`. Do not vendor or copy its source files into this repo.
- Licence is MIT. Keep the licence attribution, and credit "BoopFace by CX ArtLab" in the README. The README states the licence does not allow presenting the character as another party's original character or standalone brand. Never call it Shipbuds' own mascot in copy or docs.
- Valid expression names for `play()`: `idle`, `bored`, `waiting-spin`, `waiting-wrap`, `waiting-wave`, `input`, `affirm`, `success`, `failure`, `wary`, `inspect`, `angry`, `refuse`, `surprise`, `love`, `random`, `sleep`, `wake`. `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` loops until stopped.
- Skins are numbers from 101 to 1717 (set with the `skin` attribute or `setSkin(n)`). Numbers never change. The full build loads skin painters lazily on first use.
- An uploaded Manager photo must keep winning over any generated face (existing rule in `src/components/ui/Identity.tsx`).
- Honour `prefers-reduced-motion` (the component's `motion="auto"` does this). Avatars stay decorative: `aria-hidden`, with names in adjacent text or labels.
- No change to the persisted store shape or the `architect-store` key. Stored `Manager.templateId` values (`violet`, `ocean`, `ember`, `forest`, `sunrise`, `indigo`, `lagoon`, `candy`), `''` and `undefined` must keep working.
- Style rules from `docs/design-system.md` apply: no gradients, six type sizes, radius from the scale.
- Writing rules for docs: no em dashes, short direct sentences.

## Review Focus

- Many avatars at once (40 message bubbles plus sidebar rows plus the Team strip): the page must stay smooth, and list avatars must not each follow the pointer. Pinned by Task 1's measurement and Task 3's list setting.
- Old saved Managers: `templateId` of `undefined`, `''` or an unknown string still resolves to a valid skin, and the same Manager always gets the same skin. Pinned by `skinForTemplate` tests in Task 2.
- A Manager with an uploaded photo still shows the photo, not a robot. Pinned by Task 3's browser check and the `showsPhoto` rule.
- React StrictMode mounts twice in dev: the custom element must register once and not duplicate timers. Pinned by Task 1's browser check.
- The mapping module must not import `boopface` (it would break Vitest's node environment). Pinned by Task 2 running in node.

---

### Task 1: Install BoopFace and prove it in this app

**Files:**
- Modify: `package.json`, `package-lock.json` (add `boopface` at `0.8.0`)
- Create: `src/boopface.d.ts` (JSX typing for `<boop-face>`)
- Create: `src/components/ui/BoopAvatar.tsx` (first version: renders the element, no state wiring)
- Modify: `src/main.tsx` (one side-effect `import 'boopface'`)

**Interfaces:**
- Produces: `BoopAvatar: React.FC<{ skin: number; px: number; action?: BoopAction; live?: boolean; className?: string }>` where `live` means pointer-follow on. `BoopAction` is the union of valid names above, exported from `src/components/ui/boopMap.ts` (created in Task 2; until then define the union inline and move it).
- Produces (decision): a recorded answer to "how many live faces are acceptable", written as a one-line comment at the top of `BoopAvatar.tsx`.

- [ ] **Step 1: Install**

Run: `npm install boopface@0.8.0`
Expected: `package.json` lists `"boopface": "0.8.0"`; no peer or audit errors.

- [ ] **Step 2: Declare the element for TypeScript**

In `src/boopface.d.ts`, augment `React.JSX.IntrinsicElements` with `'boop-face'` accepting `size`, `skin`, `color`, `motion`, `auto-sleep` and `ref` to an `HTMLElement` that has `play(action: string): Promise<void>`, `startWaiting(opts?: { variant?: 'spin' | 'wrap' | 'wave' }): void`, `stopWaiting(): void`, `setPointerFollow(on: boolean): void`, `setSkin(n: number | string | null): void`, `reset(): void`.
Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 3: Implement the first `BoopAvatar` and register the element**

`BoopAvatar` renders `<boop-face size={px} skin={skin} motion="auto">` inside a `span` of `px` by `px` with `aria-hidden`. In an effect keyed on `[action]`, call `play(action)` when set. In an effect keyed on `[live]`, call `setPointerFollow(!!live)`. Import `'boopface'` once in `src/main.tsx`.

- [ ] **Step 4: Prove it in the browser and measure**

Temporarily render 40 `BoopAvatar`s (mixed skins, `live` false) on `/home`. Check: faces animate, no console errors, StrictMode does not duplicate faces, and scrolling and typing stay smooth. Compare with 40 faces using `motion="reduce"`. Record the largest count that feels smooth and whether `reduce` is needed for list avatars. Remove the temporary markup.
Expected: a written decision in the `BoopAvatar.tsx` header comment, for example "lists use live=false; up to N faces stay smooth".

- [ ] **Step 5: Check bundle impact**

Run: `npm run build`
Expected: succeeds. Note the change in gzip size of the main chunk and any new skin chunks in the commit message. If the main chunk grows by more than about 60 KB gzip, switch the import to `boopface/lite` and give up skins (stop and ask, because that changes the design).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/boopface.d.ts src/components/ui/BoopAvatar.tsx src/main.tsx
git commit -m "feat: add BoopFace avatar component"
```

### Task 2: Mapping logic with tests

**Files:**
- Create: `src/components/ui/boopMap.ts`
- Test: `src/components/ui/boopMap.test.ts`

**Interfaces:**
- Consumes: `Manager.templateId?: string` (`src/store/types.ts`), `TaskStatus` and `ChannelId` (`src/store/types.ts`), `AVATAR_TEMPLATES` ids (`src/components/ui/avatarTemplates.ts`).
- Produces:
  - `type BoopAction` (the valid names listed in Global Constraints).
  - `skinForTemplate(templateId: string | undefined, fallbackKey: string): number`
  - `skinForAgent(agentId: string): number`
  - `actionForTaskStatus(status: TaskStatus): BoopAction`
  - `AVATAR_SKINS: Record<string, number>` mapping each existing template id to a skin number.

- [ ] **Step 1: Write the failing tests**

```ts
it('maps each saved template id to a fixed skin', () => {
  expect(skinForTemplate('violet', 'm1')).toBe(AVATAR_SKINS.violet)
})
it('is stable for unknown, empty and missing ids and returns a valid skin', () => {
  for (const id of [undefined, '', 'nope']) {
    const a = skinForTemplate(id, 'manager-1')
    expect(skinForTemplate(id, 'manager-1')).toBe(a)
    expect(Number.isInteger(a) && a >= 101 && a <= 1717).toBe(true)
  }
})
it('spreads different fallback keys across skins', () => {
  const set = new Set(['a', 'b', 'c', 'd', 'e', 'f'].map((k) => skinForTemplate(undefined, k)))
  expect(set.size).toBeGreaterThan(1)
})
it('gives every specialist its own skin, distinct from each other', () => {
  const ids = ['frontend', 'backend', 'ai-ml', 'devops', 'qa']
  expect(new Set(ids.map(skinForAgent)).size).toBe(ids.length)
})
it('maps task status to an expression', () => {
  expect(actionForTaskStatus('running')).toBe('waiting-wave')
  expect(actionForTaskStatus('needs_review')).toBe('wary')
  expect(actionForTaskStatus('done')).toBe('success')
  expect(actionForTaskStatus('failed')).toBe('failure')
  expect(actionForTaskStatus('queued')).toBe('idle')
})
```

- [ ] **Step 2: Run to see it fail**

Run: `npx vitest run src/components/ui/boopMap.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `boopMap.ts`**

Signatures as above. `skinForTemplate` uses `AVATAR_SKINS[templateId]` when present, otherwise indexes the values of `AVATAR_SKINS` by the same FNV-1a hash already used in `avatarTemplates.ts` (export that `hash` from there rather than copying it). Choose the eight template skins and five agent skins by eye in the skin gallery (https://cx-artlab.github.io/BoopFace/skins.html): pick calm, legible-at-28px skins that read well on `#121214`, avoid loud patterns, and keep the five agent skins clearly different from each other. Record the chosen numbers in the map. The file must not import `boopface`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run`
Expected: PASS (existing 6 plus the new tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/boopMap.ts src/components/ui/boopMap.test.ts src/components/ui/avatarTemplates.ts
git commit -m "feat: map templates, agents and task status to BoopFace skins and expressions"
```

### Task 3: Managers and specialists render faces

**Files:**
- Modify: `src/components/ui/Identity.tsx` (`Identity`, `SpecialistIdentity`)
- Modify: `src/components/ui/BoopAvatar.tsx` (use `BoopAction` from `boopMap.ts`)

**Interfaces:**
- Consumes: `skinForTemplate`, `skinForAgent`, `BoopAction` from Task 2; `BoopAvatar` from Task 1.
- Produces: `Identity` gains `action?: BoopAction` and `live?: boolean`. `SpecialistIdentity` gains `agentId: string` (required) plus the same two props. Existing `name` prop stays for the initials-free label.

- [ ] **Step 1: Update `Identity`**

When `avatar` (uploaded photo) exists, render the photo exactly as now. Otherwise render `BoopAvatar` with `skin = skinForTemplate(templateId, ownerId || activeManagerId || 'onboarding')` and `px` from the size ladder (xs 24, sm 28, md 32, lg 40, xl 48). Keep the outer `span` size classes so layout does not move. Remove the gradient `style` and the initials fallback.

- [ ] **Step 2: Update `SpecialistIdentity` and its call sites**

Add the required `agentId` prop, render `BoopAvatar` with `skinForAgent(agentId)`. Update both call sites in `src/components/chat/MessageBubble.tsx` (lines near 87 and 183) to pass the author id.
Run: `npx tsc --noEmit -p .`
Expected: no errors.

- [ ] **Step 3: List avatars are quiet**

Pass `live={false}` everywhere in lists (`Sidebar.tsx`, `MessageBubble.tsx`). Only `lg` and `xl` uses (`App.tsx:76`, `FirstRun.tsx:33`, onboarding) may follow the pointer. Apply the count decision from Task 1 Step 4.

- [ ] **Step 4: Check in the browser**

On `/home`, in a project thread, and in the sidebar: faces render, sizes match the old discs, a Manager with an uploaded photo still shows the photo (upload one through Add Manager), console is clean.
Expected: pass on all four; screenshot the thread.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Identity.tsx src/components/ui/BoopAvatar.tsx src/components/chat/MessageBubble.tsx src/components/shell/Sidebar.tsx
git commit -m "feat: Managers and specialists render BoopFace avatars"
```

### Task 4: Faces show state

**Files:**
- Modify: `src/components/shell/TeamStrip.tsx` (replace initials rings with faces, keep the status ring and tooltip)
- Modify: `src/components/shell/TopBar.tsx` (Manager header face reacts to typing)
- Modify: `src/components/chat/MessageBubble.tsx` (typing row avatar, if it renders an avatar)

**Interfaces:**
- Consumes: `actionForTaskStatus` (Task 2), `Identity`/`SpecialistIdentity` `action` prop (Task 3).
- Produces: nothing new.

- [ ] **Step 1: TeamStrip**

For each active specialist, render `SpecialistIdentity` with `action = actionForTaskStatus(status)` for that specialist's current task. Keep the colour ring, the label and the `title`/`aria-label` text so status never relies on the face alone.

- [ ] **Step 2: Manager header**

In `TopBar`, pass `action='waiting-spin'` to the Manager `Identity` while `managerThread.typing` is true, otherwise `'idle'`.

- [ ] **Step 3: Verify**

Run: `npm test` then a full browser run: send a message (header face waits then relaxes), start a build (strip faces switch to waiting, then success), answer the QA decision (QA face shows wary while paused).
Expected: tests pass, expressions change at the right moments, no console errors, reduced-motion emulation leaves faces calm.

- [ ] **Step 4: Commit**

```bash
git add src/components/shell/TeamStrip.tsx src/components/shell/TopBar.tsx src/components/chat/MessageBubble.tsx
git commit -m "feat: avatar expressions follow task status and typing"
```

### Task 5: Picker, credit, docs

**Files:**
- Modify: `src/components/ui/Identity.tsx` (`AvatarTemplatePicker` swatches become small faces)
- Modify: `README.md` (credit line and licence note), `docs/design-system.md` (avatar rule), `docs/platform.md` (feature map row), `docs/product/07-decision-log.md` (one new decision)

**Interfaces:**
- Consumes: `BoopAvatar`, `AVATAR_SKINS` (Tasks 1 and 2).

- [ ] **Step 1: Picker**

Each of the eight swatches renders a `BoopAvatar` at 28px with its skin and `live={false}`, keeping the radio semantics, the ring selection style and the Auto option. The picker uses the template id, so nothing stored changes.
Run: `npx tsc --noEmit -p . && npm test`
Expected: pass.

- [ ] **Step 2: Credit and docs**

README: add "Avatars: BoopFace by CX ArtLab (MIT)" with the repository link, and one sentence that Shipbuds does not claim the character. `docs/design-system.md`: one short section on avatars (face per agent, photo wins, lists quiet, decorative). `docs/platform.md`: one row. Decision log: one entry (decision, options, trade-off: a third-party character identity and a new dependency, revisit if the licence terms change or performance suffers).

- [ ] **Step 3: Full verification and commit**

Run: `npm run build && npm test`
Expected: both pass. In the browser check the picker, onboarding step four, the sidebar, a thread, and the Team strip once more.

```bash
git add src/components/ui/Identity.tsx README.md docs
git commit -m "feat: BoopFace picker, credit and docs"
```
