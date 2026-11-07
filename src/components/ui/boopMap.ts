/** Expressions BoopFace can play (subset of its `BoopFaceAction`, without the deprecated names). */
export type BoopAction =
  | 'idle' | 'bored' | 'waiting-spin' | 'waiting-wrap' | 'waiting-wave' | 'input' | 'affirm'
  | 'success' | 'failure' | 'wary' | 'inspect' | 'angry' | 'refuse' | 'surprise' | 'love'
  | 'random' | 'sleep' | 'wake'

import type { TaskStatus } from '../../store/types'
import { hash } from './avatarTemplates'

/**
 * Skin per saved template id. Ids are stored on Managers, so they keep their old
 * names even though the colours no longer match them. Skins chosen by eye at 28px
 * on #121214: calm, legible, clearly different from each other.
 */
export const AVATAR_SKINS: Record<string, number> = {
  violet: 1001, ocean: 301, ember: 1101, forest: 701,
  sunrise: 901, indigo: 501, lagoon: 601, candy: 1601,
}

const SKIN_LIST = Object.values(AVATAR_SKINS)

/** Explicit template wins; anything else hashes the key, so a Manager keeps one face. */
export const skinForTemplate = (templateId: string | undefined, fallbackKey: string): number =>
  (templateId && Object.prototype.hasOwnProperty.call(AVATAR_SKINS, templateId) ? AVATAR_SKINS[templateId] : undefined) ?? SKIN_LIST[hash(fallbackKey || 'manager') % SKIN_LIST.length]

const AGENT_SKINS: Record<string, number> = { frontend: 501, backend: 1001, 'ai-ml': 701, devops: 901, qa: 1601 }

/** Specialists always wear the same face. Unknown ids fall back to the hash. */
export const skinForAgent = (agentId: string): number =>
  AGENT_SKINS[agentId] ?? SKIN_LIST[hash(agentId) % SKIN_LIST.length]

export const actionForTaskStatus = (status: TaskStatus): BoopAction =>
  ({ running: 'waiting-wave', needs_review: 'wary', done: 'success', failed: 'failure', queued: 'idle' } as const)[status]
