import React, { useEffect, useRef } from 'react'
import 'boopface'
import type { BoopFace } from 'boopface'
import type { BoopAction } from './boopMap'

/**
 * BOOP AVATAR — the only file that touches the <boop-face> custom element.
 * BoopFace is MIT, by CX ArtLab (https://github.com/CX-ArtLab/BoopFace).
 * Lists use live={false} so many faces do not all follow the pointer.
 * Rendering 40 faces showed no errors or duplicates under StrictMode. Frame rate was
 * not measured (the browser pane was hidden and throttled), so keep well under ~60 on screen.
 */
export const BoopAvatar: React.FC<{
  skin: number
  px: number
  action?: BoopAction
  /** Pointer-following eyes. Off for lists. */
  live?: boolean
  className?: string
}> = ({ skin, px, action, live = false, className }) => {
  const ref = useRef<BoopFace>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.setPointerFollow?.(live)
  }, [live])

  useEffect(() => {
    const el = ref.current
    if (!el || !action || action === 'idle') {
      ref.current?.reset?.()
      return
    }
    void el.play?.(action)
  }, [action])

  return (
    <span aria-hidden className={className} style={{ width: px, height: px, display: 'inline-block' }}>
      <boop-face ref={ref} size={px} skin={skin} motion="auto" />
    </span>
  )
}
