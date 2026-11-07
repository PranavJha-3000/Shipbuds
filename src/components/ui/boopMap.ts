/** Expressions BoopFace can play (subset of its `BoopFaceAction`, without the deprecated names). */
export type BoopAction =
  | 'idle' | 'bored' | 'waiting-spin' | 'waiting-wrap' | 'waiting-wave' | 'input' | 'affirm'
  | 'success' | 'failure' | 'wary' | 'inspect' | 'angry' | 'refuse' | 'surprise' | 'love'
  | 'random' | 'sleep' | 'wake'
