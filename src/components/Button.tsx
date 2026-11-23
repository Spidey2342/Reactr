import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'yellow' | 'secondary' | 'mint'

export function Button({
  children,
  onClick,
  disabled,
  loading = false,
  variant = 'primary',
  className = '',
  cta = false,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  /** Shows a spinner and blocks taps while a request is in flight. */
  loading?: boolean
  variant?: ButtonVariant
  className?: string
  /** Marks the screen's primary action. The e2e audit checks it is on screen without scrolling. */
  cta?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      data-cta={cta ? '' : undefined}
      className={`btn ${variant} ${loading ? 'loading' : ''} ${className}`}
    >
      {loading && <i className="spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function IconButton({
  children,
  onClick,
  label,
  pressed,
}: {
  children: ReactNode
  onClick?: () => void
  /** Accessible name; icon-only buttons must have one. */
  label: string
  pressed?: boolean
}) {
  return (
    <button type="button" onClick={onClick} className="icon-btn" aria-label={label} aria-pressed={pressed}>
      {children}
    </button>
  )
}
