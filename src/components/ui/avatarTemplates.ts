/**
 * AVATAR TEMPLATES — the ids a Manager can pin as its face.
 *
 * The ids are stored on Managers (and on the onboarding draft), so they keep their
 * old colour names even though each now maps to a BoopFace skin in `boopMap.ts`.
 * A Manager with no explicit id gets a stable face hashed from its own id, so
 * existing Managers need no migration. An uploaded photo always wins.
 */
export const AVATAR_TEMPLATES: { id: string }[] = [
  { id: 'violet' },
  { id: 'ocean' },
  { id: 'ember' },
  { id: 'forest' },
  { id: 'sunrise' },
  { id: 'indigo' },
  { id: 'lagoon' },
  { id: 'candy' },
]

/** FNV-1a — tiny, stable across sessions, good spread over a small set. */
export const hash = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}
