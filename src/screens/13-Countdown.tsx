import { useEffect, useState, type CSSProperties } from 'react'
import { Icon, ProgressDots, Reaction, Screen } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE: becomes the real dealt hand
import { feedback } from '../lib/feedback'
import { frozen } from '../lib/timing'
import { gameApi, useRequiredRoom } from '../state/gameStore'

const START = 3
const STEP_MS = 850
const R = 80
const CIRC = 2 * Math.PI * R

export default function Countdown() {
  const room = useRequiredRoom()
  const [n, setN] = useState(START)
  const judge = room.players.find((p) => p.id === room.currentRound.judgeId)

  useEffect(() => {
    if (frozen()) return
    feedback.tick()
    const t = setTimeout(() => (n > 1 ? setN(n - 1) : gameApi.finishCountdown()), STEP_MS)
    return () => clearTimeout(t)
  }, [n])

  return (
    <Screen className="countdown" glow>
      <div className="ready">
        GET READY <Icon name="sound" />
      </div>
      <div className="timer-ring" role="timer" aria-label={`Starting in ${n}`}>
        <svg viewBox="0 0 184 184" aria-hidden="true">
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFD93D" />
              <stop offset="1" stopColor="#FF3D8B" />
            </linearGradient>
          </defs>
          <circle className="ring-track" cx="92" cy="92" r={R} />
          {/* Keyed by n so the arc restarts and drains across each second. */}
          <circle
            key={n}
            className="ring-arc"
            cx="92"
            cy="92"
            r={R}
            strokeDasharray={CIRC}
            style={
              {
                '--from': CIRC * (1 - n / START),
                '--to': CIRC * (1 - (n - 1) / START),
                animationDuration: `${STEP_MS}ms`,
              } as CSSProperties
            }
          />
        </svg>
        <b key={`n${n}`}>{n}</b>
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
    </Screen>
  )
}
