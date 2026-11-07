import React from 'react'
import { useStore } from '../../store/store'
import { ImportWizard } from '../import/ImportWizard'
import { ArchivedModal } from './ArchivedModal'
import { Popover, MenuItem } from '../ui/Popover'
import { FolderInput, Archive, LogOut, Wrench } from 'lucide-react'

/**
 * Account menu — the last of the three bespoke menu implementations, now on
 * the shared `Popover`, so it gains Escape handling, arrow-key navigation,
 * focus restoration and an exit animation.
 *
 * The avatar previously used `hover:opacity-90`, an opacity change in a
 * product where every other control changes its background value. It is now
 * the standard control-fill hover.
 */
export const AccountMenu: React.FC = () => {
  const user = useStore((s) => s.user)
  const signOut = useStore((s) => s.signOut)
  const setPersona = useStore((s) => s.setPersona)
  const technical = user?.persona === 'technical'
  const [importOpen, setImportOpen] = React.useState(false)
  const [archivedOpen, setArchivedOpen] = React.useState(false)

  const label = user?.name || user?.email || 'Account'

  return (
    <>
      <Popover
        label="Account"
        side="top"
        align="start"
        className="w-full"
        trigger={(p) => (
          <button
            type="button"
            title={label}
            aria-label={label}
            {...p}
            className="coarse-hit flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left transition-colors duration-instant ease-standard hover:bg-surface"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action text-label font-semibold text-paper">
              {(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 truncate text-label text-paper">{label}</span>
          </button>
        )}
      >
        <MenuItem
          icon={<FolderInput size={14} />}
          label="Import project"
          onClick={() => setImportOpen(true)}
        />
        <MenuItem
          icon={<Archive size={14} />}
          label="Archived"
          onClick={() => setArchivedOpen(true)}
        />
        <MenuItem
          icon={<Wrench size={14} />}
          label="Show technical detail"
          checked={technical}
          onClick={() => setPersona(technical ? 'non-technical' : 'technical')}
        />
        <MenuItem icon={<LogOut size={14} />} label="Sign out" onClick={() => signOut()} />
      </Popover>

      {importOpen && <ImportWizard open={importOpen} onClose={() => setImportOpen(false)} />}
      {archivedOpen && <ArchivedModal open={archivedOpen} onClose={() => setArchivedOpen(false)} />}
    </>
  )
}
