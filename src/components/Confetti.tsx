import { useEffect, useState, type CSSProperties } from 'react'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/** Two passes of confetti, then it removes itself. Never loops. */
export function Confetti() {
  const [on, setOn] = useState(() => !reduced())
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 5600)
    return () => clearTimeout(t)
  }, [])
  if (!on) return null
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => (
        <i key={i} style={{ '--i': i } as CSSProperties} />
      ))}
    </div>
  )
}
