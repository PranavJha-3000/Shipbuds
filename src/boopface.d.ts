import type { BoopFace } from 'boopface'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'boop-face': React.DetailedHTMLProps<React.HTMLAttributes<BoopFace>, BoopFace> & {
        size?: number | string
        skin?: number | string
        color?: string
        motion?: 'auto' | 'reduce' | 'full'
        'auto-sleep'?: number | string
      }
    }
  }
}
