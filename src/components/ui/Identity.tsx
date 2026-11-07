import React from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../../store/store'
import { cx } from './cx'
import { AVATAR_TEMPLATES } from './avatarTemplates'
import { BoopAvatar } from './BoopAvatar'
import { AVATAR_SKINS, skinForAgent, skinForTemplate, type BoopAction } from './boopMap'
import { Shuffle } from 'lucide-react'

/**
 * IDENTITY — the one component that renders a Manager's face.
 *
 * Previously eight files imported `ManagerAvatar` from a layout module, and
 * that component only ever drew an initial letter — so a Manager whose avatar
 * was uploaded in onboarding showed their photo in the rail but a bare letter
 * in the chat header and in every message bubble. One component now always
 * renders the image when one exists, with a single initials fallback.
 *
 * Resolution order is explicit and shallow:
 *   explicit managerId → the project's owning Manager → the active Manager
 *   → the onboarding draft (so the workspace is coherent before setup ends).
 */

export type IdentitySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** One ladder for every avatar in the product: Tailwind box classes plus the face size in px. */
const SIZES: Record<IdentitySize, { box: string; px: number }> = {
  xs: { box: 'h-6 w-6', px: 24 },
  sm: { box: 'h-7 w-7', px: 28 },
  md: { box: 'h-8 w-8', px: 32 },
  lg: { box: 'h-10 w-10', px: 40 },
  xl: { box: 'h-12 w-12', px: 48 },
}

export const Identity: React.FC<{
  /** Resolves the project owner when omitted. */
  managerId?: string
  size?: IdentitySize
  /** Overrides the derived name — used for aria labels. */
  name?: string
  className?: string
  /** Expression to play on the face. */
  action?: BoopAction
  /** Pointer-following eyes. Leave off in lists. */
  live?: boolean
}> = ({ managerId, size = 'md', className, action, live }) => {
  const { projectId = '' } = useParams()
  const onboarding = useStore((s) => s.onboarding)
  const managers = useStore((s) => s.managers)
  const activeManagerId = useStore((s) => s.activeManagerId)
  const projectOwnerId = useStore((s) => s.projects.find((p) => p.id === projectId)?.managerId)

  const ownerId = managerId ?? projectOwnerId
  const owner = ownerId ? managers.find((m) => m.id === ownerId) : undefined
  const active = activeManagerId ? managers.find((m) => m.id === activeManagerId) : undefined
  // The onboarding draft is consulted only BEFORE setup ends (no Manager yet);
  // once Managers exist, a missing field resolves locally — never to another
  // Manager's photo, template or nickname.
  const draft = !owner && !active

  const avatar =
    owner?.avatar ||
    (!ownerId ? active?.avatar : undefined) ||
    (draft ? onboarding.managerAvatar : undefined)
  const templateId =
    owner?.templateId ??
    (!ownerId ? active?.templateId : undefined) ??
    (draft ? onboarding.managerTemplate : undefined)
  const { box, px } = SIZES[size]

  // An uploaded photo always wins. Otherwise the Manager wears a BoopFace whose skin is
  // keyed by the same resolution order as the avatar, so it is stable across sessions
  // without any persisted migration.
  if (avatar) {
    return (
      <span className={cx('relative flex shrink-0 items-center justify-center overflow-hidden rounded-full', box, className)}>
        <img src={avatar} alt="" aria-hidden className="h-full w-full object-cover" draggable={false} />
      </span>
    )
  }
  return (
    <span className={cx('relative flex shrink-0 items-center justify-center rounded-full', box, className)}>
      <BoopAvatar
        skin={skinForTemplate(templateId, ownerId || activeManagerId || 'onboarding')}
        px={px}
        action={action}
        live={live}
      />
    </span>
  )
}

/**
 * SPECIALIST IDENTITY — the agent counterpart. Agents have no uploaded photo, so each
 * specialist always wears the same BoopFace. Same size ladder as `Identity`.
 */
export const SpecialistIdentity: React.FC<{
  agentId: string
  size?: IdentitySize
  className?: string
  action?: BoopAction
  live?: boolean
}> = ({ agentId, size = 'sm', className, action, live }) => (
  <span className={cx('relative flex shrink-0 items-center justify-center rounded-full', SIZES[size].box, className)}>
    <BoopAvatar skin={skinForAgent(agentId)} px={SIZES[size].px} action={action} live={live} />
  </span>
)

/**
 * TEMPLATE PICKER — the Manager PFP chooser.
 *
 * "Auto" keeps the deterministic hash, so every Manager gets a different
 * colour for free; the swatches pin an explicit choice. An uploaded photo
 * always wins over the template, so picking a colour never blocks upload.
 */
export const AvatarTemplatePicker: React.FC<{
  value: string
  onChange: (id: string) => void
  className?: string
}> = ({ value, onChange, className }) => (
  <div className={cx('flex flex-col items-center gap-2', className)}>
    <p className="text-micro font-medium uppercase text-muted">Face</p>
    <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Face">
      <button
        type="button"
        role="radio"
        aria-checked={value === ''}
        aria-label="Automatic face"
        title="Automatic: a different face for each Manager"
        onClick={() => onChange('')}
        className={cx(
          'flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-instant ease-standard',
          value === ''
            ? 'border-accent text-paper'
            : 'border-line bg-surface text-muted hover:text-paper',
        )}
      >
        <Shuffle size={12} aria-hidden />
      </button>
      {AVATAR_TEMPLATES.map((t, i) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={value === t.id}
          aria-label={`Face ${i + 1}`}
          title={`Face ${i + 1}`}
          onClick={() => onChange(t.id)}
          className={cx(
            'flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-instant ease-standard hover:scale-110',
            value === t.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-ink' : 'ring-1 ring-line',
          )}
        >
          <BoopAvatar skin={AVATAR_SKINS[t.id]} px={28} />
        </button>
      ))}
    </div>
  </div>
)
