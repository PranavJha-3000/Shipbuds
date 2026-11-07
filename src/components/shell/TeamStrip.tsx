import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../store/store'
import { agentById } from '../../store/roster'
import type { BuildTask, ChannelId } from '../../store/types'
import { SpecialistIdentity } from '../ui/Identity'
import { cx } from '../ui/cx'
import { actionForAgentStatus, type AgentStatus } from '../ui/boopMap'

const statusOf = (tasks: BuildTask[] | undefined, ch: ChannelId): AgentStatus => {
  const mine = tasks?.filter((t) => t.channel === ch) ?? []
  if (mine.some((t) => t.status === 'needs_review')) return 'needs-you'
  if (mine.some((t) => t.status === 'failed')) return 'failed'
  if (mine.some((t) => t.status === 'running')) return 'working'
  if (mine.length && mine.every((t) => t.status === 'done')) return 'done'
  return 'idle'
}

const LABEL: Record<AgentStatus, string> = {
  'needs-you': 'needs you', working: 'working', failed: 'failed', done: 'done', idle: 'idle',
}

const RING: Record<AgentStatus, string> = {
  'needs-you': 'ring-accentPurple',
  working: 'ring-accent',
  failed: 'ring-accentRed',
  done: 'ring-line',
  idle: 'ring-transparent',
}

/**
 * TEAM STRIP — who is on this project and what each is doing, at a glance.
 * Only specialists the Manager has brought in appear. Status is carried by the
 * ring colour AND the accessible label/tooltip, never colour alone.
 */
export const TeamStrip: React.FC = () => {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const team = useStore((s) => s.projects.find((p) => p.id === projectId)?.team)
  const tasks = useStore((s) => s.builds[projectId]?.tasks)
  const technical = useStore((s) => s.user?.persona === 'technical')
  if (!team?.length) return null

  return (
    <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="Team">
      {team.map((ch) => {
        const status = statusOf(tasks, ch)
        const name = agentById(ch).name
        const task = tasks?.find((t) => t.channel === ch && (t.status === 'running' || t.status === 'needs_review'))
        const label = `${name} — ${LABEL[status]}${technical && task ? `: ${task.label}` : ''}`
        return (
          <button
            key={ch}
            type="button"
            title={label}
            aria-label={label}
            onClick={() => navigate(`/p/${projectId}/thread/${ch}`)}
            className="coarse-hit relative rounded-full transition-transform duration-instant ease-standard active:scale-95"
          >
            <SpecialistIdentity
              agentId={ch}
              size="xs"
              action={actionForAgentStatus(status)}
              className={cx('ring-2 ring-offset-1 ring-offset-ink', RING[status], status === 'working' && 'motion-safe:animate-pulse')}
            />
            {status === 'needs-you' && (
              <span aria-hidden className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accentPurple" />
            )}
          </button>
        )
      })}
    </div>
  )
}
