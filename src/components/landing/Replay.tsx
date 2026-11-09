import React, { useEffect, useState } from 'react'
import { BoopAvatar } from '../ui/BoopAvatar'
import { AVATAR_SKINS, skinForAgent, type BoopAction } from '../ui/boopMap'
import { cx } from '../ui/cx'
import { FOCUS } from './ui'

type Who = 'you' | 'manager' | 'frontend' | 'backend' | 'qa'
/** 'auto' is a Fix it chosen by the timer because the visitor did not answer. */
type Choice = 'fix' | 'ship' | 'auto' | null

const NAME: Record<Who, string> = { you: 'You', manager: 'Manager', frontend: 'Frontend', backend: 'Backend', qa: 'QA' }

/** Index of the line where QA asks the visitor a question and the replay waits. */
const ASK = 5
const AUTO_ANSWER_MS = 7000

const lines = (choice: Choice): { who: Who; text: string; activity?: boolean }[] => [
  { who: 'you', text: 'A habit tracker with streaks and a weekly heatmap. Fast and simple.' },
  { who: 'manager', text: 'Plan is ready: scope, heatmap UI, streak storage, QA. I am bringing in Frontend, Backend and QA.' },
  { who: 'manager', text: 'Manager routed work to #frontend and #backend', activity: true },
  { who: 'frontend', text: 'Heatmap built. Cells fill as streaks land.' },
  { who: 'backend', text: 'Streaks persist. The weekly rollup returns seven days.' },
  { who: 'qa', text: 'An empty week shows a blank grid. Fix it before we ship?' },
  { who: 'qa', text: choice === 'ship' ? 'Shipping as is. I logged the empty-week case for later.' : 'Fixed. 14 cases pass, including the empty week.' },
  { who: 'manager', text: 'Reviewed. Preview is live. Ready to commit.' },
]

const prefersReduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const Face: React.FC<{ who: Who; action?: BoopAction }> = ({ who, action }) =>
  who === 'you' ? (
    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lp-rail text-[12px] font-semibold text-lp-text">
      Y
    </span>
  ) : (
    <BoopAvatar px={32} action={action} skin={who === 'manager' ? AVATAR_SKINS.ocean : skinForAgent(who)} />
  )

export const Replay: React.FC = () => {
  const reduced = prefersReduced()
  const [n, setN] = useState(reduced ? 8 : 0)
  const [choice, setChoice] = useState<Choice>(reduced ? 'fix' : null)
  const [run, setRun] = useState(0)
  const all = lines(choice)
  const waiting = n === ASK + 1 && choice === null
  const done = n >= all.length

  useEffect(() => {
    if (reduced || done) return
    const t = setTimeout(() => (waiting ? setChoice('auto') : setN(n + 1)), waiting ? AUTO_ANSWER_MS : n === 0 ? 700 : 1500)
    return () => clearTimeout(t)
  }, [n, waiting, done, reduced, run])

  const restart = () => { setChoice(null); setN(0); setRun((r) => r + 1) }
  const filled = n < 4 ? 0 : n < 5 ? 14 : n < 6 ? 21 : choice !== 'ship' && n >= 7 ? 28 : 21
  const status = waiting ? 'Needs you' : done ? 'Ready' : n === 0 ? 'Waiting' : 'Building'
  const last = all[Math.max(0, n - 1)]

  return (
    <div className="overflow-hidden rounded-[20px] border border-lp-line bg-lp-deck" role="group" aria-label="Simulated replay of a Shipbuds build">
      <div className="h-[2px] bg-lp-line" aria-hidden>
        <div
          className={cx('h-full transition-[width,background-color] duration-shift ease-travel', waiting ? 'bg-lp-red' : 'bg-lp-blue')}
          style={{ width: `${(Math.min(n, all.length) / all.length) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-3 border-b border-lp-line px-5 py-3">
        <span className={cx('h-2 w-2 rounded-full', waiting ? 'bg-lp-red' : 'bg-lp-blue', !done && !waiting && 'animate-pulse')} aria-hidden />
        <p className="font-lpmono text-[12px] text-lp-fog">streak-tracker · simulated replay</p>
        <button
          type="button"
          onClick={restart}
          className={cx('ml-auto rounded-full border border-lp-line px-3 py-1 text-[13px] text-lp-fog transition-colors duration-instant hover:text-lp-text', FOCUS)}
        >
          Replay
        </button>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <ol className="min-h-[420px] space-y-4 p-5 md:min-h-[460px] md:border-r md:border-lp-line md:p-6" aria-live="polite">
          {all.slice(0, n).map((l, i) =>
            l.activity ? (
              <li key={i} className="flex items-center gap-3 pl-11 text-[13px] text-lp-fog">
                <span className="h-px w-5 bg-lp-line" aria-hidden />
                {l.text}
              </li>
            ) : (
              <li key={i} className="flex animate-rise gap-3">
                <Face who={l.who} action={l === last && !done ? (i === ASK && waiting ? 'wary' : 'waiting-wave') : l === last && i === all.length - 1 ? 'success' : undefined} />
                <div className={cx('min-w-0', i === ASK && waiting && 'border-l-2 border-lp-red pl-3')}>
                  <p className="text-[13px] font-semibold text-lp-text">{NAME[l.who]}</p>
                  <p className="mt-0.5 text-[15px] leading-[22px] text-lp-fog [text-wrap:pretty]">{l.text}</p>
                  {i === ASK && choice && (
                    <p className="mt-2 text-[13px] text-lp-fog">{choice === 'ship' ? 'You chose Ship as is.' : choice === 'fix' ? 'You chose Fix it.' : 'No answer, so the Manager chose Fix it.'}</p>
                  )}
                  {i === ASK && waiting && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setChoice('fix')}
                        className={cx('h-9 rounded-full bg-lp-blue px-4 text-[14px] font-medium text-white transition-colors duration-instant hover:bg-lp-blueHover', FOCUS)}
                      >
                        Fix it
                      </button>
                      <button
                        type="button"
                        onClick={() => setChoice('ship')}
                        className={cx('h-9 rounded-full border border-lp-line px-4 text-[14px] text-lp-text transition-colors duration-instant hover:bg-lp-rail', FOCUS)}
                      >
                        Ship as is
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ),
          )}
        </ol>

        <div className="border-t border-lp-line p-5 md:border-t-0 md:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-lp-text">Preview</p>
            <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px]', waiting ? 'border-lp-red text-lp-red' : 'border-lp-line text-lp-fog')}>
              <span className={cx('h-1.5 w-1.5 rounded-full', waiting ? 'bg-lp-red' : 'bg-lp-blue')} aria-hidden />
              {status}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[['Current', filled ? '12 days' : '0 days'], ['Best', filled ? '31 days' : '0 days']].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-lp-rail px-4 py-3">
                <p className="text-[12px] text-lp-fog">{k}</p>
                <p className="mt-0.5 font-lpmono text-[20px] text-lp-text">{v}</p>
              </div>
            ))}
          </div>
          <p className="mb-2 mt-6 text-[13px] text-lp-fog">Last four weeks</p>
          <div className="grid grid-cols-7 gap-1.5" aria-hidden>
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className={cx('h-6 rounded-[5px] transition-colors duration-shift', i < filled ? 'bg-lp-blue' : 'bg-lp-rail')} />
            ))}
          </div>
          <p className="mt-4 text-[13px] text-lp-fog">
            {waiting ? 'The build is paused until you answer.' : done ? 'Nothing sent. This is a scripted demo.' : 'Updating as the team builds.'}
          </p>
        </div>
      </div>
    </div>
  )
}
