import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function Chip({
  children,
  color = 'pink',
  active = true,
  onClick,
}: {
  children: ReactNode
  color?: 'pink' | 'yellow' | 'mint'
  active?: boolean
  onClick?: () => void
}) {
  if (!onClick) {
    return (
      <span className={`chip ${color} ${active ? 'active' : ''}`}>
        {active && <Icon name="check" size={14} />} {children}
      </span>
    )
  }
  return (
    <button type="button" onClick={onClick} className={`chip ${color} ${active ? 'active' : ''}`}>
      {active && <Icon name="check" size={14} />} {children}
    </button>
  )
}
