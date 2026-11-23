import { useState } from 'react'
import { Button, Modal, Reaction, RoomTopBar, Scenario, Screen } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE: becomes the real played cards
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { feedback } from '../lib/feedback'
import { gameApi, useRequiredRoom } from '../state/gameStore'
import type { ReactionCard } from '../types'

export default function JudgePicks() {
  const room = useRequiredRoom()
  const [chosen, setChosen] = useState<{ playerId: string; card: ReactionCard } | null>(null)
  const cards = reactionCards.slice(0, 4)
  const scenario = scenarios.find((x) => x.id === room.currentRound.scenarioId) ?? scenarios[0]

  return (
    <Screen className="judge-picks" head={<RoomTopBar />}>
      <h3>Judge's pick</h3>
      <Scenario scenario={scenario} compact />
      <div className="judge-grid">
        {cards.map((c, i) => (
          <Reaction
            key={c.id}
            mini
            card={c}
            onClick={() => {
              feedback.select()
              setChosen({ playerId: room.players[(i + 1) % room.players.length].id, card: c })
            }}
          />
        ))}
      </div>
      {chosen && (
        <Modal
          title="CROWN THIS ONE?"
          onClose={() => setChosen(null)}
          actions={
            <Button
              onClick={() => {
                feedback.win()
                gameApi.crown(chosen.playerId)
              }}
            >
              CROWN THIS ONE 👑
            </Button>
          }
        >
          <p className="muted">This card gets the point!</p>
          <Reaction card={chosen.card} />
        </Modal>
      )}
    </Screen>
  )
}
