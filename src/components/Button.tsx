import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'yellow' | 'secondary' | 'mint'

export function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: ButtonVariant
  className?: string
}) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`btn ${variant} ${className}`}>
      {children}
    </button>
  )
}

export function IconButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode
  onClick?: () => void
  /** Accessible name; icon-only buttons must have one. */
  label: string
}) {
  return (
    <button type="button" onClick={onClick} className="icon-btn" aria-label={label}>
      {children}
    </button>
  )
}
