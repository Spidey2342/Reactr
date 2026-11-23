import { useNavigate } from 'react-router'
import { Button, StateShell } from '../components'
import { paths } from '../lib/routes'
import { useBack } from '../lib/nav'
import { gameApi } from '../state/gameStore'

/** Dev-only preview route until Phase 1 turns 25-27 into overlays. */
export default function NoInternet() {
  const navigate = useNavigate()
  const back = useBack()
  const leaveRoom = () => {
    gameApi.leaveRoom()
    navigate(paths.home)
  }
  return (
    <StateShell
      accent="pink"
      icon="📶"
      title="Lost the signal"
      text="You can't do this. We'll get you back in the room as soon as the signal returns."
      foot={
        <>
          <Button cta onClick={back}>
            RETRY NOW
          </Button>
          <button type="button" className="leave" onClick={leaveRoom}>
            LEAVE ROOM
          </button>
          <small className="saved">● YOUR ROOM CODE IS SAVED</small>
        </>
      }
    >
      <div className="signal">
        CHECKING CONNECTION <i />
      </div>
    </StateShell>
  )
}
