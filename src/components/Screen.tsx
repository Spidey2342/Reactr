import type { ReactNode } from 'react'

/**
 * The one screen shell. Fixed header, a middle region that scrolls, a pinned footer for the primary
 * action, and an optional tab bar that lives outside the scrolling region.
 */
export function Screen({
  className = '',
  head,
  foot,
  footClass = '',
  tabs,
  glow = false,
  children,
}: {
  className?: string
  head?: ReactNode
  foot?: ReactNode
  footClass?: string
  tabs?: ReactNode
  glow?: boolean
  children: ReactNode
}) {
  return (
    <div className={`screen ${glow ? 'glow-page' : ''} ${className}`}>
      {head && <div className="screen-head">{head}</div>}
      <div className={`screen-body ${head ? '' : 'no-head'}`}>{children}</div>
      {foot && <div className={`screen-foot ${footClass}`}>{foot}</div>}
      {tabs}
    </div>
  )
}
