import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { IconButton } from './Button'

export function BackTitle({
  title,
  onBack,
  action,
}: {
  title: string
  onBack: () => void
  action?: ReactNode
}) {
  return (
    <header className="back-title">
      <IconButton label="Back" onClick={onBack}>
        <Icon name="back" />
      </IconButton>
      <h2>{title}</h2>
      <div className="header-action">{action}</div>
    </header>
  )
}
