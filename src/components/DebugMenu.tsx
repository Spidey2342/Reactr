import { useState } from 'react'
import { useNavigate } from 'react-router'
import '../styles/dev.css'

/** Hidden preview menu for the system-state screens. Only ever bundled in dev builds. */
export default function DebugMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const go = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <>
      <button type="button" className="debug-toggle" aria-label="Debug menu" onClick={() => setOpen(!open)} />
      {open && (
        <div className="debug-menu">
          <b>Preview states</b>
          <button type="button" onClick={() => go('/dev/no-internet')}>
            No internet
          </button>
          <button type="button" onClick={() => go('/dev/disconnected')}>
            Disconnected
          </button>
          <button type="button" onClick={() => go('/dev/host-transfer')}>
            Host transfer
          </button>
        </div>
      )}
    </>
  )
}
