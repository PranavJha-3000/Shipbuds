import React from 'react'
import { COPY } from './landingCopy'
import { GhostLink, PrimaryLink } from './ui'
import { Replay } from './Replay'

export const Hero: React.FC = () => (
  <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-36 md:pt-32">
    <div className="flex flex-col items-center text-center">
      <h1 className="max-w-[16ch] text-balance text-[clamp(40px,7.5vw,96px)] font-semibold leading-[0.98] tracking-[-0.045em] text-lp-text">
        Vibe coding feels like <span className="text-lp-red">a group chat.</span>
      </h1>
      <div className="mt-8 flex flex-col items-center">
        <p className="max-w-[52ch] text-[18px] leading-[28px] text-lp-fog [text-wrap:pretty]">{COPY.hero.sub}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PrimaryLink to="/signup">{COPY.hero.primary}</PrimaryLink>
          <GhostLink to="/home">{COPY.hero.secondary}</GhostLink>
        </div>
      </div>
    </div>
    <div className="mt-16 md:mt-24">
      <Replay />
    </div>
  </section>
)
