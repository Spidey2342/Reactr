export function Stepper({
  value,
  setValue,
  min = 3,
  max = 8,
}: {
  value: number
  setValue: (n: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="stepper">
      <button type="button" aria-label="Decrease" onClick={() => setValue(Math.max(min, value - 1))}>
        −
      </button>
      <b>{value}</b>
      <button type="button" aria-label="Increase" onClick={() => setValue(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  )
}
