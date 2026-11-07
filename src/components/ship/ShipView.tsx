import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div role="group" aria-label="Ship" className="flex shrink-0 gap-0.5 border-b border-line px-5 py-2">
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
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{tab === 'github' ? <GitHubView /> : <DeployView />}</div>
    </div>
  )
}
