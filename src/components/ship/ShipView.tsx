import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../store/store'
import { Check } from 'lucide-react'
import { GitHubView } from '../github/GitHubView'
import { DeployView } from '../deploy/DeployView'
import { cx } from '../ui/cx'

const TABS = [
  { id: 'github', label: 'Source', to: 'ship' },
  { id: 'deploy', label: 'Deploy', to: 'ship/deploy' },
] as const

/** GitHub and Deploy are one job — getting the project out — so they share one tool and one tab bar. */
export const ShipView: React.FC<{ tab: 'github' | 'deploy' }> = ({ tab }) => {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const gh = useStore((s) => s.github[projectId])
  const deploys = useStore((s) => s.deployments[projectId])
  const steps = [
    { label: 'Connect', done: !!gh?.connected },
    { label: 'Commit', done: (gh?.commits.length ?? 0) > 0 },
    { label: 'Deploy', done: !!deploys?.some((d) => d.status === 'success') },
  ]
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div role="group" aria-label="Ship" className="flex shrink-0 items-center gap-0.5 border-b border-line px-5 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => navigate(`/p/${projectId}/${t.to}`)}
            className={cx(
              'coarse-hit rounded-full px-3 py-1 text-label transition-colors duration-instant ease-standard',
              tab === t.id ? 'bg-action text-paper' : 'text-muted hover:text-paper',
            )}
          >
            {t.label}
          </button>
        ))}
        {/* Where this project is on the way out the door. */}
        <ol aria-label="Shipping progress" className="ml-auto flex items-center gap-3 text-meta text-muted">
          {steps.map((s) => (
            <li key={s.label} className={'flex items-center gap-1 ' + (s.done ? 'text-paper' : '')}>
              <span className={'flex h-3.5 w-3.5 items-center justify-center rounded-full ' + (s.done ? 'bg-accent' : 'border border-line')}>
                {s.done && <Check size={9} className="text-white" strokeWidth={3} />}
              </span>
              {s.label}
              <span className="sr-only">{s.done ? ', done' : ', not yet'}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{tab === 'github' ? <GitHubView /> : <DeployView />}</div>
    </div>
  )
}
