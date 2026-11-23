import { useEffect, type ReactNode } from 'react'

export function Modal({
  title,
  children,
  onClose,
  actions,
}: {
  title: string
  children: ReactNode
  onClose?: () => void
  actions?: ReactNode
}) {
  useEffect(() => {
    if (!onClose) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <i className="grab" aria-hidden="true" />
        <h2>{title}</h2>
        {children}
        {actions}
      </section>
    </div>
  )
}
