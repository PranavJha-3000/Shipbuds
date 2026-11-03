import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from './store'
import { clarifyFor, planFor } from './scripts'

const managerCards = (projectId: string) =>
  useStore.getState().threads[`${projectId}:manager`].messages.map((m) => m.card?.type).filter(Boolean)

describe('scripts', () => {
  it('asks marketplace questions and plans bookings for a tutor marketplace', () => {
    const intent = 'A platform where tutors create profiles and students book demo classes'
    expect(clarifyFor(intent).map((q) => q.id)).toEqual(['pay', 'approve', 'slots'])
    expect(planFor(intent).features).toContain('Booking from available slots')
  })

  it('caps clarify questions at three with a valid default each', () => {
    for (const intent of ['Build a habit tracker', 'tutor booking site']) {
      const qs = clarifyFor(intent)
      expect(qs.length).toBeLessThanOrEqual(3)
      for (const q of qs) expect(q.options[q.selected]).toBeDefined()
    }
  })
})

describe('Manager flow: clarify → plan → build → needs-you → live', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useStore.setState({ projects: [], threads: {}, builds: {}, previews: {}, managers: [], activeManagerId: '' })
  })

  it('runs the whole balanced flow and pauses for the QA decision', () => {
    const s = useStore.getState()
    const id = s.createProject()
    s.managerSend(id, 'A platform where tutors create profiles and students book demo classes')
    vi.runAllTimers()
    expect(managerCards(id)).toEqual(['clarify'])
    expect(useStore.getState().projects[0].planState).toBe('clarifying')

    // Pick "Paid at booking"; the plan should carry that feature.
    useStore.getState().answerClarify(id, [1, 1, 0])
    vi.runAllTimers()
    const plan = useStore.getState().threads[`${id}:manager`].messages.find((m) => m.card?.type === 'plan')!.card!
    expect(plan.type === 'plan' && plan.features).toContain('Payments at booking')
    expect(managerCards(id)).toEqual(['clarify', 'plan', 'strategy'])

    useStore.getState().startBuild(id)
    vi.runAllTimers()
    let b = useStore.getState().builds[id]
    expect(b.awaiting).toBe('review')
    expect(b.state).toBe('building')
    expect(b.tasks.find((t) => t.id === 'review')!.status).toBe('needs_review')
    expect(b.tasks.find((t) => t.id === 'api')!.dependsOn).toEqual(['data'])
    expect(managerCards(id)).toContain('decision')

    useStore.getState().answerDecision(id, 0)
    vi.runAllTimers()
    b = useStore.getState().builds[id]
    expect(b.state).toBe('live')
    expect(b.awaiting).toBeUndefined()
    expect(b.tasks.every((t) => t.status === 'done')).toBe(true)
  })

  it('typing during clarify keeps defaults and goes straight to the plan', () => {
    const id = useStore.getState().createProject()
    useStore.getState().managerSend(id, 'Build a habit tracker')
    vi.runAllTimers()
    useStore.getState().managerSend(id, 'mostly for runners')
    vi.runAllTimers()
    expect(managerCards(id)).toEqual(['clarify', 'plan', 'strategy'])
  })

  it('a second Start building during a build is ignored', () => {
    const id = useStore.getState().createProject()
    useStore.getState().startBuild(id)
    vi.advanceTimersByTime(2500)
    useStore.getState().startBuild(id)
    vi.runAllTimers()
    expect(managerCards(id).filter((c) => c === 'decision')).toHaveLength(1)
    useStore.getState().answerDecision(id, 0)
    vi.runAllTimers()
    expect(useStore.getState().builds[id].state).toBe('live')
  })

  it('lean builds never pause for a decision', () => {
    const id = useStore.getState().createProject()
    useStore.setState((s) => ({ projects: s.projects.map((p) => ({ ...p, strategy: 'lean' as const })) }))
    useStore.getState().startBuild(id)
    vi.runAllTimers()
    expect(useStore.getState().builds[id].state).toBe('live')
    expect(managerCards(id)).not.toContain('decision')
  })
})
