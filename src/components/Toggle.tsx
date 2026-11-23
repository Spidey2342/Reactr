export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (value: boolean) => void
  /** Accessible name, e.g. "Sound". */
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`toggle ${on ? 'on' : ''}`}
      onClick={(e) => {
        // Rows wrap the switch in a <label>; stop the label from re-dispatching a second click on it.
        e.stopPropagation()
        onChange(!on)
      }}
    >
      <i />
    </button>
  )
}
