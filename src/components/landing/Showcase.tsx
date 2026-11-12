import React from 'react'
import { ASSETS } from '../../assets'
import { COPY } from './landingCopy'
import { H2, Section } from './ui'

/** Product showcase video. No autoplay: it has sound and runs 96s. */
export const Showcase: React.FC = () => (
  <Section id="showcase">
    <H2>{COPY.showcase.title}</H2>
    <p className="mt-6 max-w-[52ch] text-[18px] leading-[28px] text-lp-fog [text-wrap:pretty]">{COPY.showcase.sub}</p>
    <video
      className="mt-12 aspect-video w-full rounded-2xl border border-lp-line bg-lp-deck"
      src={ASSETS.demo.showcase}
      poster={ASSETS.demo.showcasePoster}
      controls
      preload="none"
      playsInline
      aria-label="Shipbuds product showcase"
    />
  </Section>
)
