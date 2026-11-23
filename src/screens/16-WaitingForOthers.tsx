import { useEffect, useState } from 'react'
import { Avatar, Button, RoomTopBar, Scenario, Screen } from '../components'
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { frozen } from '../lib/timing'
import { gameApi, useRequiredRoom } from '../state/gameStore'

const WAITING_ON = 3

export default function WaitingForOthers() {
  const room = useRequiredRoom()
  const scenario = scenarios.find((x) => x.id === room.currentRound.scenarioId)!
  const [waiting, setWaiting] = useState(WAITING_ON)

  // Mock only: the others lock in one by one, then the reveal starts. The server moves the phase later.
  useEffect(() => {
    if (frozen()) return
    const t = setTimeout(() => (waiting > 0 ? setWaiting(waiting - 1) : gameApi.finishWaiting()), 450)
    return () => clearTimeout(t)
  }, [waiting])

  return (
    <Screen className="waiting" head={<RoomTopBar />} foot={<Button disabled>SWAP HAND</Button>}>
      <Scenario scenario={scenario} compact />
      <div className="card-back">
        <b>R</b>
        <span>LOCKED IN</span>
      </div>
      <h3>{waiting > 0 ? `Waiting for ${waiting} player${waiting === 1 ? '' : 's'}...` : 'Everyone is in!'}</h3>
      <div className="mini-players">
        {room.players.map((p) => (
          <Avatar key={p.id} small player={p} />
        ))}
      </div>
      <div className="all-good">✓ AMA LOCKED IN</div>
      <p className="muted">Hang tight, the cards reveal soon.</p>
    </Screen>
  )
}
