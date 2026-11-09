import React from 'react'
import { Link } from 'react-router-dom'
import { ASSETS } from '../../assets'
import { COPY } from './landingCopy'
import { FOCUS, scrollToId } from './ui'
import { cx } from '../ui/cx'

export const LandingNav: React.FC = () => (
  <header className="sticky top-0 z-40 px-4 pt-4 md:px-10">
    <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 rounded-full border border-lp-line bg-lp-bg/80 pl-5 pr-2 backdrop-blur-xl">
      <button type="button" onClick={() => scrollToId('top')} className={cx('flex items-center gap-2.5 rounded-full', FOCUS)}>
        <img src={ASSETS.icons.chatbot} alt="" aria-hidden className="brand-icon h-7 w-7" />
        <span className="text-[15px] font-semibold tracking-tight text-lp-text">Shipbuds</span>
      </button>
      <nav aria-label="Sections" className="ml-6 hidden items-center gap-1 md:flex">
        {COPY.nav.links.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToId(id)}
            className={cx('rounded-full px-3 py-1.5 text-[14px] text-lp-fog transition-colors duration-instant hover:text-lp-text', FOCUS)}
          >
            {label}
          </button>
        ))}
      </nav>
      <Link
        to="/signup"
        className={cx('ml-auto inline-flex h-10 items-center rounded-full bg-lp-blue px-5 text-[14px] font-medium text-white transition-colors duration-instant hover:bg-lp-blueHover', FOCUS)}
      >
        {COPY.nav.start}
      </Link>
    </div>
  </header>
)
