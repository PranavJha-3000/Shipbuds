import React from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../ui/cx'

export const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-blue'

const PILL = 'inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium transition-colors duration-instant ease-standard'

export const PrimaryLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className={cx(PILL, 'bg-lp-blue text-white hover:bg-lp-blueHover', FOCUS)}>
    {children}
  </Link>
)

export const GhostLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className={cx(PILL, 'border border-lp-line text-lp-text hover:bg-lp-rail', FOCUS)}>
    {children}
  </Link>
)

/** HashRouter owns the URL hash, so in-page links scroll by element id instead of href="#id". */
export const scrollToId = (id: string) => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className, children }) => (
  <section id={id} className={cx('mx-auto max-w-7xl scroll-mt-24 px-6 py-24 md:px-10 md:py-36', className)}>
    {children}
  </section>
)

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="max-w-[18ch] text-[clamp(34px,5vw,64px)] font-semibold leading-[1] tracking-[-0.04em] text-lp-text">{children}</h2>
)
