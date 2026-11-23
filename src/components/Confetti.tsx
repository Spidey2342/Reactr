import type { CSSProperties } from 'react'

export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => (
        <i key={i} style={{ '--i': i } as CSSProperties} />
      ))}
    </div>
  )
}
