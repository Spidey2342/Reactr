import { useRef, useState } from 'react'
import { Button, ProgressDots, Reaction, Scenario, Screen, SoundButton } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { feedback } from '../lib/feedback'
import { ME_ID } from '../lib/identity'
import { gameApi, useRequiredRoom } from '../state/gameStore'

const EMOJIS = ['😂', '🔥', '💀']
const LAST = 4
const SWIPE_PX = 48

interface Floater {
  id: number
  emoji: string
  x: number
}

export default function Reveal() {
  const room = useRequiredRoom()
  const [idx, setIdx] = useState(0)
  const [reacts, setReacts] = useState([12, 5, 3])
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [finishing, setFinishing] = useState(false)
  const start = useRef<number | null>(null)
  const nextId = useRef(1)

  const round = room.currentRound
  const judge = room.players.find((p) => p.id === round.judgeId)
  const plays = round.plays.length
    ? round.plays
    : [
        { playerId: ME_ID, cardId: 'r5' },
        { playerId: 'yaw', cardId: 'r1' },
      ]
  const card = reactionCards.find((c) => c.id === plays[idx % plays.length].cardId) || reactionCards[4]
  const scenario = scenarios.find((x) => x.id === round.scenarioId)!

  const next = () => {
    if (finishing) return
    if (idx < LAST) {
      setIdx(idx + 1)
      feedback.flip()
    } else {
      setFinishing(true)
      feedback.lock()
      if (round.judgeId === ME_ID) gameApi.finishReveal()
      else setTimeout(gameApi.finishReveal, 500)
    }
  }
  const previous = () => {
    if (idx === 0 || finishing) return
    setIdx(idx - 1)
    feedback.flip()
  }

  const react = (i: number) => {
    setReacts((a) => a.map((n, j) => (i === j ? n + 1 : n)))
    feedback.select()
    const id = nextId.current++
    setFloaters((f) => [...f, { id, emoji: EMOJIS[i], x: 18 + Math.random() * 64 }])
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1300)
  }

  return (
    <Screen
      className="reveal"
      head={
        <div className="reveal-head">
          <h1>Reveal</h1>
          <span className="round-pill">{idx + 1} OF 5</span>
          <SoundButton />
        </div>
      }
      foot={
        <>
          <Button cta loading={finishing} onClick={next}>
            NEXT CARD　→
          </Button>
          <Button variant="secondary" className="compact" disabled={idx === 0 || finishing} onClick={previous}>
            PREVIOUS
          </Button>
        </>
      }
    >
      <Scenario scenario={scenario} compact />
      <div
        className="reveal-card"
        onPointerDown={(e) => {
          start.current = e.clientX
        }}
        onPointerUp={(e) => {
          const from = start.current
          start.current = null
          if (from === null) return
          const dx = e.clientX - from
          if (Math.abs(dx) > SWIPE_PX) (dx < 0 ? next : previous)()
        }}
      >
        <button type="button" aria-label="Previous card" disabled={idx === 0 || finishing} onClick={previous}>
          ‹
        </button>
        <div key={idx} className="flip" data-testid="reveal-card">
          <Reaction card={card} />
        </div>
        <button type="button" aria-label="Next card" disabled={finishing} onClick={next}>
          ›
        </button>
        <div className="floaters" aria-hidden="true">
          {floaters.map((f) => (
            <span key={f.id} style={{ left: `${f.x}%` }}>
              {f.emoji}
            </span>
          ))}
        </div>
      </div>
      <p className="swipe">SWIPE TO FLIP THE NEXT CARD</p>
      <ProgressDots index={idx} total={5} />
      <div className="reactions">
        {EMOJIS.map((emoji, i) => (
          <button type="button" key={emoji} aria-label={`React with ${emoji}`} onClick={() => react(i)}>
            {emoji} <b>{reacts[i]}</b>
          </button>
        ))}
      </div>
      <small className="judge-name">JUDGE: {(judge?.name ?? 'ABENA').toUpperCase()}</small>
    </Screen>
  )
}
