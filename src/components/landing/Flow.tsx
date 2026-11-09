import React from 'react'
import { cx } from '../ui/cx'
import { COPY } from './landingCopy'
import { H2, Section } from './ui'

export const Flow: React.FC = () => (
  <section id="flow" className="scroll-mt-24 border-y border-lp-line bg-lp-deck">
    <Section>
      <H2>{COPY.flow.title}</H2>
      <ol className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-8">
        <span aria-hidden className="absolute left-[7px] top-2 hidden h-px w-[calc(100%-1rem)] bg-lp-line md:block" />
        <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-lp-line md:hidden" />
        {COPY.flow.steps.map((s, i) => (
          <li key={s.label} className="relative pl-10 md:pl-0 md:pt-12">
            <span aria-hidden className={cx('absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-lp-deck', i === 3 ? 'bg-lp-text' : 'bg-lp-blue', 'md:top-0')} />
            {i === 2 && (
              <span className="absolute left-5 top-0 hidden items-center gap-1.5 text-[12px] text-lp-red md:left-6 md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-lp-red" aria-hidden />
                {COPY.flow.pause}
              </span>
            )}
            <p className="text-[13px] text-lp-fog">Step {i + 1}</p>
            <h3 className="mt-1 text-[28px] font-semibold leading-[32px] tracking-[-0.03em] text-lp-text">{s.label}</h3>
            <p className="mt-3 max-w-[30ch] text-[16px] leading-[24px] text-lp-fog [text-wrap:pretty]">{s.desc}</p>
            <p className="mt-5 font-lpmono text-[12px] leading-[18px] text-lp-text/80">{s.art}</p>
            {i === 2 && <p className="mt-2 text-[13px] text-lp-red md:hidden">{COPY.flow.pause}</p>}
          </li>
        ))}
      </ol>
    </Section>
  </section>
)
