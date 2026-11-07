import { describe, expect, it } from 'vitest'
import { AVATAR_SKINS, AGENT_SKINS, actionForAgentStatus, skinForAgent, skinForTemplate, waitingVariant } from './boopMap'

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

  it('never gives a specialist the same face as a Manager', () => {
    const managers = new Set(Object.values(AVATAR_SKINS))
    for (const id of Object.keys(AGENT_SKINS)) expect(managers.has(skinForAgent(id))).toBe(false)
    for (const k of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      expect(Object.values(AGENT_SKINS)).not.toContain(skinForTemplate(undefined, k))
    }
  })

  it('loops waiting expressions and plays the rest once', () => {
    expect(waitingVariant('waiting-wave')).toBe('wave')
    expect(waitingVariant('waiting-spin')).toBe('spin')
    expect(waitingVariant('waiting-wrap')).toBe('wrap')
    expect(waitingVariant('wary')).toBeNull()
    expect(waitingVariant(undefined)).toBeNull()
  })

  it('maps a specialist status to an expression', () => {
    expect(actionForAgentStatus('working')).toBe('waiting-wave')
    expect(actionForAgentStatus('needs-you')).toBe('wary')
    expect(actionForAgentStatus('done')).toBe('success')
    expect(actionForAgentStatus('failed')).toBe('failure')
    expect(actionForAgentStatus('idle')).toBe('idle')
  })
})
