import { Avatar, Button, RoomCode, Screen } from '../components'
import { mockPlayers } from '../data/dev-fixtures/players' // DEV FIXTURE
import { useBack } from '../lib/nav'

/** Dev-only preview route until Phase 1 turns 25-27 into overlays. */
export default function HostTransfer() {
  const back = useBack()
  return (
    <Screen
      className="host-transfer"
      head={<div className="host-banner">✓ Ama is now the host</div>}
      foot={
        <Button cta onClick={back}>
          START GAME
        </Button>
      }
    >
      <h2>LOBBY</h2>
      <RoomCode code="KFZ7" />
      <div className="players">
        {mockPlayers.slice(0, 6).map((p, i) => (
          <Avatar key={p.id} player={{ ...p, isHost: i === 1 }} />
        ))}
      </div>
      <div className="new-host">
        <Avatar player={{ ...mockPlayers[1], isHost: true }} />
        <h2>Ama is the new host</h2>
        <p className="muted">All set! You may have a new host, but your game goes on.</p>
        <Button variant="mint" onClick={back}>
          GOT IT!
        </Button>
      </div>
    </Screen>
  )
}
