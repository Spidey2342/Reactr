import { useNavigate } from 'react-router'
import { Avatar, Button, HomeBar, Scenario, TopBar } from '../components'
import { mockPlayers } from '../data/dev-fixtures/players' // DEV FIXTURE
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE

/** Dev-only preview route until Phase 1 turns 25-27 into overlays. */
export default function PlayerDisconnected() {
  const navigate = useNavigate()
  return (
    <div className="screen disconnected">
      <div className="disconnect-banner">⚠ Yaw lost connection</div>
      <TopBar />
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
      <Button onClick={() => navigate(-1)}>CONTINUE</Button>
      <HomeBar />
    </div>
  )
}
