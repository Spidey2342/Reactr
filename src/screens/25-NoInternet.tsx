import { useNavigate } from 'react-router'
import { Button, StateShell } from '../components'

/** Dev-only preview route until Phase 1 turns 25-27 into overlays. */
export default function NoInternet() {
  const navigate = useNavigate()
  return (
    <StateShell
      accent="pink"
      icon="📶"
      title="Lost the signal"
      text="You can't do this. We'll get you back in the room as soon as the signal returns."
    >
      <div className="signal">
        CHECKING CONNECTION <i />
      </div>
      <Button onClick={() => navigate(-1)}>RETRY NOW</Button>
      <button type="button" className="leave">
        LEAVE ROOM
      </button>
      <small>● YOUR ROOM CODE IS SAVED</small>
    </StateShell>
  )
}
