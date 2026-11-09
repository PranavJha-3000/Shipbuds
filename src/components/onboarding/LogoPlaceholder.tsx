import React from 'react'
import { cx } from '../ui/cx'
import { ASSETS } from '../../assets'

/**
 * Brand lockup. Renders the Shipbuds chatbot icon, whitened for
 * dark surfaces. Every brand consumer goes through this one component.
 */
export const LogoPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cx('flex items-center', className)}>
    <img
      src={ASSETS.icons.chatbot}
      alt="Shipbuds"
      className="brand-icon h-7 w-7 shrink-0"
    />
  </div>
)
