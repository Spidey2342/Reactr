import { Avatar, Button, Confetti, HomeBar, Reaction } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
import { gameApi, useRequiredRoom } from '../state/gameStore'
import { useRoomUi } from '../state/roomUi'

export default function RoundResult() {
  const room = useRequiredRoom()
  const { openScoreboard } = useRoomUi()
  const winner = room.players.find((p) => p.id === room.currentRound.winnerId) || room.players[1]

  return (
    <div className="screen scroll result">
      <Confetti />
      <span className="round-pill">ROUND {room.currentRound.number} OF 5</span>
      <h1>
        {winner.name.toUpperCase()} WINS
        <br />
        THE ROUND!
      </h1>
      <Avatar player={winner} />
      <Reaction card={reactionCards[0]} />
      <span className="point">+1 POINT</span>
      <h4>ALL CARDS FROM THE ROUND</h4>
      <div className="round-cards">
        {reactionCards.slice(0, 4).map((c) => (
          <Reaction key={c.id} mini card={c} />
        ))}
      </div>
      <Button onClick={gameApi.nextRound}>↻　NEXT ROUND IN 8</Button>
      <Button variant="secondary" onClick={openScoreboard}>
        ▥ FULL SCOREBOARD
      </Button>
      <HomeBar />
    </div>
  )
}
