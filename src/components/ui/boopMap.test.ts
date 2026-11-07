import { describe, expect, it } from 'vitest'
import { AVATAR_SKINS, actionForTaskStatus, skinForAgent, skinForTemplate } from './boopMap'

describe('boopMap', () => {
  it('maps each saved template id to a fixed skin', () => {
    expect(skinForTemplate('violet', 'm1')).toBe(AVATAR_SKINS.violet)
    expect(Object.keys(AVATAR_SKINS).sort()).toEqual(
      ['candy', 'ember', 'forest', 'indigo', 'lagoon', 'ocean', 'sunrise', 'violet'],
    )
  })

  it('is stable for unknown, empty and missing ids and returns a valid skin', () => {
    for (const id of [undefined, '', 'nope', 'constructor', 'toString']) {
      const a = skinForTemplate(id, 'manager-1')
      expect(skinForTemplate(id, 'manager-1')).toBe(a)
      expect(Number.isInteger(a) && a >= 101 && a <= 1717).toBe(true)
    }
  })

  it('spreads different fallback keys across skins', () => {
    const set = new Set(['a', 'b', 'c', 'd', 'e', 'f'].map((k) => skinForTemplate(undefined, k)))
    expect(set.size).toBeGreaterThan(1)
  })

  it('gives every specialist its own skin', () => {
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
})
