import React, { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ASSETS } from '../../assets'
import { cx } from '../ui/cx'
import { COPY } from './landingCopy'
import { FOCUS, H2, Section } from './ui'

const Window: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => (
  <div className="overflow-hidden rounded-[20px] border border-lp-line bg-lp-deck">
    <p className="border-b border-lp-line px-5 py-3 font-lpmono text-[12px] text-lp-fog">{url}</p>
    <div className="min-h-[340px] p-5 md:p-7">{children}</div>
  </div>
)

const Preview = () => (
  <Window url="shipbuds.app/p/streak-tracker · preview">
    <div className="flex flex-wrap gap-2">
      {['Desktop', 'Tablet', 'Mobile'].map((v, i) => (
        <span key={v} className={cx('rounded-full px-3.5 py-1.5 text-[13px]', i === 0 ? 'bg-lp-blue font-medium text-white' : 'border border-lp-line text-lp-fog')}>{v}</span>
      ))}
    </div>
    <div className="mt-6 rounded-xl bg-lp-bg p-5">
      <p className="text-[15px] font-semibold text-lp-text">Streaks</p>
      <div className="mt-4 grid grid-cols-7 gap-1.5" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} className={cx('h-7 rounded-[5px]', [4, 12, 19].includes(i) ? 'bg-lp-rail' : 'bg-lp-blue')} />
        ))}
      </div>
    </div>
  </Window>
)

const Canvas = () => (
  <Window url="shipbuds.app/p/portal · canvas">
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="text-[13px] text-lp-fog">Imported screenshot</p>
        <div className="mt-2 space-y-2 rounded-xl bg-lp-bg p-4" aria-hidden>
          <div className="h-5 w-2/5 rounded bg-lp-rail" />
          <div className="grid grid-cols-2 gap-2"><div className="h-14 rounded bg-lp-rail" /><div className="h-14 rounded bg-lp-rail" /></div>
          <div className="h-7 w-1/3 rounded-full bg-lp-rail" />
        </div>
      </div>
      <div>
        <p className="text-[13px] text-lp-fog">Editable regions</p>
        <div className="mt-2 space-y-2 rounded-xl bg-lp-bg p-4">
          <p className="text-[14px] text-lp-text">Header</p>
          <div className="rounded-lg border-2 border-lp-blue p-3">
            <p className="text-[14px] text-lp-text">Invoice table</p>
            <p className="font-lpmono text-[12px] text-lp-fog">selected · width 100% · padding 12</p>
          </div>
          <p className="text-[13px] text-lp-fog">Apply routes the change to Frontend.</p>
        </div>
      </div>
    </div>
  </Window>
)

const Ship = () => (
  <Window url="shipbuds.app/p/portal · ship">
    <div className="flex flex-wrap items-center gap-2 text-[13px]" aria-label="Ship chain">
      {['Shipbuds', 'Code', 'GitHub', 'Deploy', 'Live URL'].map((c, i) => (
        <React.Fragment key={c}>
          {i > 0 && <ArrowRight size={14} className="text-lp-fog" aria-hidden />}
          <span className={cx('rounded-full px-3.5 py-1.5', i === 0 ? 'bg-lp-blue font-medium text-white' : 'border border-lp-line text-lp-text')}>{c}</span>
        </React.Fragment>
      ))}
    </div>
    <div className="mt-6 rounded-xl bg-lp-bg p-4">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-lp-rail px-2.5 py-1 font-lpmono text-[12px] text-lp-fog">c41ad0</span>
        <p className="text-[15px] text-lp-text">Portal v3: client messages</p>
        <span className="ml-auto text-[12px] text-lp-fog">simulated</span>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-lp-line pt-4">
        <img src={ASSETS.icons.github} alt="" aria-hidden className="brand-icon h-4 w-4" />
        <span className="font-lpmono text-[12px] text-lp-fog">main · deploy log · Live at portal-v3.shipbuds.app</span>
      </div>
    </div>
  </Window>
)

const PANELS = { preview: <Preview />, canvas: <Canvas />, ship: <Ship /> } as const

export const Workspace: React.FC = () => {
  const [sel, setSel] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const tabs = COPY.workspace.tabs
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = (sel + d + tabs.length) % tabs.length
    setSel(next)
    refs.current[next]?.focus()
  }

  return (
    <Section id="workspace">
      <H2>{COPY.workspace.title}</H2>
      <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-16">
        <div role="tablist" aria-label="Workspace tools" onKeyDown={onKey} className="flex gap-2 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => { refs.current[i] = el }}
              role="tab"
              id={`ws-${t.id}`}
              aria-selected={i === sel}
              aria-controls="ws-panel"
              tabIndex={i === sel ? 0 : -1}
              onClick={() => setSel(i)}
              className={cx(
                'shrink-0 border-lp-line text-left transition-colors duration-instant md:border-t md:py-6 md:last:border-b',
                i === sel ? 'text-lp-text' : 'text-lp-fog hover:text-lp-text',
                FOCUS,
              )}
            >
              <span className="flex items-center gap-3 px-4 py-2 text-[clamp(22px,2.4vw,32px)] font-semibold tracking-[-0.03em] md:px-0 md:py-0">
                <span aria-hidden className={cx('hidden h-2 w-2 rounded-full md:block', i === sel ? 'bg-lp-blue' : 'bg-lp-line')} />
                {t.label}
              </span>
              <span className={cx('hidden max-w-[34ch] pl-5 text-[16px] leading-[24px] text-lp-fog md:mt-2 md:block', i !== sel && 'md:hidden')}>{t.desc}</span>
            </button>
          ))}
        </div>
        <div id="ws-panel" role="tabpanel" aria-labelledby={`ws-${tabs[sel].id}`} key={tabs[sel].id} className="animate-rise">
          <p className="mb-4 text-[15px] text-lp-fog md:hidden">{tabs[sel].desc}</p>
          {PANELS[tabs[sel].id]}
        </div>
      </div>
    </Section>
  )
}
