import { useEffect, useState } from 'react'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/** Counts from 0 to `value` once when it mounts, easing out. Renders the final value straight away if motion is reduced. */
export function CountUp({ value, ms = 700, suffix = '' }: { value: number; ms?: number; suffix?: string }) {
  const [shown, setShown] = useState(() => (reduced() ? value : 0))

  useEffect(() => {
    if (reduced() || value === 0) {
      setShown(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])

  return (
    <span data-value={value}>
      {shown}
      {suffix}
    </span>
  )
}
