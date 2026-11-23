import { useState } from 'react'
import { Button, HomeBar, Reaction, RoomTopBar, Scenario } from '../components'
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { gameApi, useGameState, useHand, useRequiredRoom } from '../state/gameStore'

/** Design 15b "Pick A Card Selected v2" (15 is superseded). */
export default function PickACard() {
  const room = useRequiredRoom()
  const { swapped } = useGameState()
  const hand = useHand()
  const [selected, setSelected] = useState(() => hand[0].id)
  const scenario = scenarios.find((x) => x.id === room.currentRound.scenarioId)!
  const card = hand.find((c) => c.id === selected) || hand[0]

  return (
    <div className="screen pick">
      <RoomTopBar />
      <Scenario scenario={scenario} compact />
      <div className="pick-main">
        <Reaction selected card={card} />
      </div>
      <p className="lock-hint">TAP AGAIN TO LOCK IT IN</p>
      <button type="button" className="swap" disabled={swapped} onClick={gameApi.swapHand}>
        ⟳　Swap hand ({swapped ? '0' : '1'} left)
      </button>
      <div className="hand">
        {hand.map((c) => (
          <Reaction key={c.id} mini card={c} selected={c.id === selected} onClick={() => setSelected(c.id)} />
        ))}
      </div>
      <Button onClick={() => gameApi.submitPlay(card.id)}>⚡　PLAY THIS CARD</Button>
      <HomeBar />
    </div>
  )
}
