import React from 'react'
import { ASSETS } from '../../assets'
import { COPY } from './landingCopy'
import { GhostLink, H2, PrimaryLink, Section } from './ui'

export const Honest: React.FC = () => (
  <section id="honest" className="scroll-mt-24 border-y border-lp-line bg-lp-deck">
    <Section>
      <H2>{COPY.honest.title}</H2>
      <dl className="mt-14 grid gap-x-16 md:grid-cols-2">
        {COPY.honest.items.map((t) => (
          <div key={t.t} className="border-t border-lp-line py-6">
            <dt className="text-[20px] font-semibold tracking-[-0.02em] text-lp-text">{t.t}</dt>
            <dd className="mt-2 max-w-[44ch] text-[16px] leading-[24px] text-lp-fog">{t.d}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-lp-line pt-6 font-lpmono text-[12px] leading-[18px] text-lp-fog">{COPY.honest.nonClaims}</p>
    </Section>
  </section>
)

export const FinalCTA: React.FC = () => (
  <Section className="pb-20 md:pb-28">
    <h2 className="max-w-[14ch] text-[clamp(44px,8vw,104px)] font-semibold leading-[0.95] tracking-[-0.05em] text-lp-text">
      {COPY.final.title}
    </h2>
    <div className="mt-10 flex flex-wrap gap-3">
      <PrimaryLink to="/signup">{COPY.final.primary}</PrimaryLink>
      <GhostLink to="/home">{COPY.final.secondary}</GhostLink>
    </div>
  </Section>
)

export const Footer: React.FC = () => (
  <footer className="border-t border-lp-line">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:px-10">
      <div className="flex items-center gap-2.5">
        <img src={ASSETS.icons.chatbot} alt="Shipbuds" className="brand-icon h-7 w-7" />
        <p className="text-[14px] text-lp-text">{COPY.footer.brand} <span className="text-lp-fog">by {COPY.footer.by}</span></p>
      </div>
      <p className="text-[13px] text-lp-fog md:ml-auto">{COPY.footer.credit}</p>
    </div>
  </footer>
)
