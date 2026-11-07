# Shipbuds interface rules

The rules the shared components already follow. Use the component before writing a new one. If a rule here stops matching the code, the code wins and this page needs fixing.

## Surfaces

Three tones carry the hierarchy, defined in `tailwind.config.js` and mirrored as CSS variables in `src/index.css`.

- Canvas (`ink`, `#121214`): the chat and page background.
- Sidebar (`sidebar`, `#18181b`): the sidebar and drawer.
- Raised (`surface`, `#1e1e22`): cards, popovers, the composer, hover fills.

Borders are a hairline (`line`, `#2c2c32`). No gradients, no glass, no heavy shadows. Blur is allowed only where a surface floats over content.

## Type, radius, motion

Six type sizes: display 28, title 17, body 15, label 13, meta 12, micro 11 (uppercase only). Do not use `text-[Npx]` in new code.

Radius: 8px for controls and rows, 12px for bubbles, the composer and dialogs, full only for things that are round.

Durations: instant 120ms, enter 200ms, exit 140ms, shift 260ms. Animate transform and opacity only. Anything a user can trigger again uses a transition, not a keyframe. Reduced motion is honoured globally in `src/index.css`.

## Dialog (`src/components/ui/Dialog.tsx`)

One modal for the whole product. It has `role="dialog"`, a focus trap, Escape to close, a scroll lock, focus restored to the trigger, and a 140ms exit animation. Use `title` for the name and `description` for one line of context. Put actions in `footer`: the primary action on the right, a secondary Close or Cancel beside it. Do not open a dialog from inside a dialog.

Use a dialog when the user must decide before continuing. For anything optional, use a popover or an inline card.

## Popover and menus (`src/components/ui/Popover.tsx`)

For small menus anchored to a button. It handles Escape, outside click, arrow-key navigation and focus restoration. Use `side="top"` near the bottom edge (the account menu in the sidebar footer does). A `MenuItem` can be a toggle with `checked`. Keep menus to a handful of items, each starting with a verb or a clear noun.

## Empty states (`src/components/ui/EmptyState.tsx`)

A 48px glyph, a title, one line of body, and at most one primary action plus an optional quiet secondary. Never inside a bordered card. If the screen already has a clear way forward, give the empty state no action. The Preview does this: it says what to do and relies on the Plan and Approach cards for the button.

## Cards in the thread

A card is something you can act on, not another message. Plan and Approach are joined as one block, because Approach is part of approving the plan. When a card is answered, it collapses to one quiet line with a check, so the thread does not fill with boxes. Only the newest build card shows progress. Older build narration becomes quiet one-line notes.

## Status

Status is never colour alone. Blue is working or primary, purple is needs you, red is failed, neutral is done or idle. Pair the colour with an icon or a label.

## Narrow screens

Below 1024px the sidebar is a slide-over and starts closed. Below 900px the Preview is a bottom sheet opened from the header. The composer respects the device safe area.
