import { useState } from 'react'
import { Button, HomeBar, Modal, Reaction, RoomTopBar, Scenario } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE: becomes the real played cards
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { gameApi, useRequiredRoom } from '../state/gameStore'

export default function JudgePicks() {
  const room = useRequiredRoom()
  const [chosen, setChosen] = useState<string | null>(null)
  const cards = reactionCards.slice(0, 4)

  return (
    <div className="screen judge-picks">
      <RoomTopBar />
      <h3>Judge's pick</h3>
      <Scenario scenario={scenarios[0]} compact />
      <div className="judge-grid">
        {cards.map((c, i) => (
          <Reaction
            key={c.id}
            mini
            card={c}
            onClick={() => setChosen(room.players[(i + 1) % room.players.length].id)}
          />
        ))}
      </div>
      {chosen && (
        <Modal
          title="CROWN THIS ONE?"
          onClose={() => setChosen(null)}
          actions={<Button onClick={() => gameApi.crown(chosen)}>CROWN THIS ONE 👑</Button>}
        >
          <p className="muted">This card gets the point!</p>
          <Reaction card={cards[0]} />
        </Modal>
      )}
      <HomeBar />
    </div>
  )
}
