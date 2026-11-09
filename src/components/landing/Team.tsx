import React, { useRef, useState } from 'react'
import { BoopAvatar } from '../ui/BoopAvatar'
import { skinForAgent } from '../ui/boopMap'
import { cx } from '../ui/cx'
import { COPY } from './landingCopy'
import { FOCUS, H2, Section } from './ui'

export const Team: React.FC = () => {
  const [sel, setSel] = useState(3)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const list = COPY.team.list
  const cur = list[sel]
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = (sel + d + list.length) % list.length
    setSel(next)
    refs.current[next]?.focus()
  }

  return (
    <Section id="team">
      <H2>{COPY.team.title}</H2>
      <p className="mt-6 max-w-[48ch] text-[18px] leading-[28px] text-lp-fog">{COPY.team.note}</p>

      <div role="tablist" aria-label="Specialists" onKeyDown={onKey} className="mt-14 flex gap-2 overflow-x-auto border-b border-lp-line pb-px md:gap-4">
        {list.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => { refs.current[i] = el }}
            role="tab"
            id={`tab-${a.id}`}
            aria-selected={i === sel}
            aria-controls="team-panel"
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
            className={cx(
              'group -mb-px flex shrink-0 flex-col items-start gap-3 border-b-2 px-3 pb-4 pt-2 transition-colors duration-instant md:px-5',
              i === sel ? 'border-lp-blue' : 'border-transparent',
              FOCUS,
            )}
          >
            <span className={cx('transition-opacity duration-instant', i === sel ? 'opacity-100' : 'opacity-50 group-hover:opacity-90')}>
              <BoopAvatar px={56} skin={skinForAgent(a.id)} action={i === sel ? 'affirm' : undefined} />
            </span>
            <span className={cx('text-[15px] font-medium', i === sel ? 'text-lp-text' : 'text-lp-fog')}>{a.name}</span>
          </button>
        ))}
      </div>

      <div id="team-panel" role="tabpanel" aria-labelledby={`tab-${cur.id}`} className="grid gap-8 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
        <div>
          <p className="text-[28px] font-semibold leading-[32px] tracking-[-0.03em] text-lp-text">{cur.name}</p>
          <p className="mt-2 text-[18px] leading-[28px] text-lp-fog">{cur.owns}</p>
        </div>
        <figure key={cur.id} className={cx('animate-rise border-l-2 pl-5', cur.id === 'qa' ? 'border-lp-red' : 'border-lp-blue')}>
          <blockquote className="max-w-[34ch] text-[clamp(22px,2.6vw,32px)] font-medium leading-[1.2] tracking-[-0.02em] text-lp-text">
            {cur.says}
          </blockquote>
          <figcaption className="mt-3 text-[13px] text-lp-fog">
            {cur.id === 'qa' ? 'The one kind of message that pauses a build.' : `${cur.name} in the thread, as the Manager routes work.`}
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
