import { useEffect, useState } from 'react'
import { HomeBar, Icon, ProgressDots, Reaction } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE: becomes the real dealt hand
import { gameApi, useRequiredRoom } from '../state/gameStore'

export default function Countdown() {
  const room = useRequiredRoom()
  const [n, setN] = useState(3)
  const judge = room.players.find((p) => p.id === room.currentRound.judgeId)

  useEffect(() => {
    const t = setTimeout(() => (n > 1 ? setN(n - 1) : gameApi.finishCountdown()), 850)
    return () => clearTimeout(t)
  }, [n])

  return (
    <div className="screen countdown glow-page">
      <div className="ready">
        GET READY <Icon name="sound" />
      </div>
      <div className="timer-ring">
        <b>{n}</b>
      </div>
      <ProgressDots index={2} />
      <h2>
        Round {room.currentRound.number} of first to {room.settings.pointsToWin}
      </h2>
      <p>👑 {judge?.name} is first judge</p>
      <div className="count-hand">
        {reactionCards.slice(0, 7).map((c) => (
          <Reaction key={c.id} mini card={c} />
        ))}
      </div>
      <HomeBar />
    </div>
  )
}
