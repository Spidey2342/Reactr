import { Avatar, Button, Scenario, Screen, TopBar } from '../components'
import { mockPlayers } from '../data/dev-fixtures/players' // DEV FIXTURE
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { useBack } from '../lib/nav'

/** Dev-only preview route until Phase 1 turns 25-27 into overlays. */
export default function PlayerDisconnected() {
  const back = useBack()
  return (
    <Screen
      className="disconnected"
      head={
        <>
          <div className="disconnect-banner">⚠ Yaw lost connection</div>
          <TopBar />
        </>
      }
      foot={
        <Button cta onClick={back}>
          CONTINUE
        </Button>
      }
    >
      <Scenario scenario={scenarios[2]} compact />
      <h3>First one at a funny moment.</h3>
      <div className="players">
        {mockPlayers.slice(0, 6).map((p, i) => (
          <Avatar key={p.id} player={{ ...p, status: i === 2 ? 'offline' : 'online' }} />
        ))}
      </div>
      <div className="rejoin-card">
        ↻<b>Yaw's card returned to the deck</b>
        <span>ENDS IN 00:14</span>
      </div>
    </Screen>
  )
}
