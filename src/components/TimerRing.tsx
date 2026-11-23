/** Circular countdown. The arc shrinks smoothly between whole-second ticks. */
export function TimerRing({ value, total }: { value: number; total: number }) {
  const r = 22
  const circumference = 2 * Math.PI * r
  const fraction = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0
  const urgent = value <= 5
  return (
    <div className={`timer-mini ${urgent ? 'urgent' : ''}`} role="timer" aria-label={`${value} seconds left`}>
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle className="track" cx="28" cy="28" r={r} />
        <circle
          className="arc"
          cx="28"
          cy="28"
          r={r}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </svg>
      <b>{value}</b>
    </div>
  )
}
