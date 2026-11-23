import { useEffect, useState } from 'react'
import { Avatar, Button, Confetti, CountUp, Reaction, Screen } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
import { feedback } from '../lib/feedback'
import { frozen } from '../lib/timing'
import { gameApi, useRequiredRoom } from '../state/gameStore'
import { useRoomUi } from '../state/roomUi'

const AUTO_SECONDS = 8

export default function RoundResult() {
  const room = useRequiredRoom()
  const { openScoreboard, overlayOpen } = useRoomUi()
  const winner = room.players.find((p) => p.id === room.currentRound.winnerId) || room.players[1]
  const [left, setLeft] = useState(AUTO_SECONDS)

  useEffect(() => feedback.win(), [])

  // The next round starts by itself after 8 seconds. It waits while the scoreboard or pause menu is open.
  useEffect(() => {
    if (frozen() || overlayOpen) return
    if (left <= 0) {
      gameApi.nextRound()
      return
    }
    const t = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(t)
  }, [left, overlayOpen])

  return (
    <Screen
      className="result"
      foot={
        <>
          <Button cta onClick={gameApi.nextRound}>
            ↻　NEXT ROUND IN {left}
          </Button>
          <Button variant="secondary" className="compact" onClick={openScoreboard}>
            ▥ FULL SCOREBOARD
          </Button>
        </>
      }
    >
      <Confetti />
      <span className="round-pill">ROUND {room.currentRound.number} OF 5</span>
      <h1>
        {winner.name.toUpperCase()} WINS
        <br />
        THE ROUND!
      </h1>
      <Avatar player={winner} />
      <Reaction card={reactionCards[0]} />
      <span className="point">
        +<CountUp value={1} /> POINT
      </span>
      <h4>ALL CARDS FROM THE ROUND</h4>
      <div className="round-cards">
        {reactionCards.slice(0, 4).map((c) => (
          <Reaction key={c.id} mini card={c} />
        ))}
      </div>
    </Screen>
  )
}
