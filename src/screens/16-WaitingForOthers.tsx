import { useEffect } from 'react'
import { Avatar, Button, HomeBar, RoomTopBar, Scenario } from '../components'
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { gameApi, useRequiredRoom } from '../state/gameStore'

export default function WaitingForOthers() {
  const room = useRequiredRoom()
  const scenario = scenarios.find((x) => x.id === room.currentRound.scenarioId)!

  // Mock only: the reveal starts on a timer. The server moves the phase once everyone has played.
  useEffect(() => {
    const t = setTimeout(gameApi.finishWaiting, 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="screen waiting">
      <RoomTopBar />
      <Scenario scenario={scenario} compact />
      <div className="card-back">
        <b>R</b>
        <span>LOCKED IN</span>
      </div>
      <h3>Waiting for 3 players...</h3>
      <div className="mini-players">
        {room.players.map((p) => (
          <Avatar key={p.id} small player={p} />
        ))}
      </div>
      <div className="all-good">✓ AMA LOCKED IN</div>
      <p className="muted">Hang tight, the cards reveal soon.</p>
      <Button disabled>SWAP HAND</Button>
      <HomeBar />
    </div>
  )
}
