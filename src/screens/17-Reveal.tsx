import { useState } from 'react'
import { Button, HomeBar, Icon, IconButton, ProgressDots, Reaction, Scenario } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { ME_ID } from '../lib/identity'
import { gameApi, prefsApi, useGameState, useRequiredRoom } from '../state/gameStore'

const EMOJIS = ['😂', '🔥', '💀']

export default function Reveal() {
  const room = useRequiredRoom()
  const { prefs } = useGameState()
  const [idx, setIdx] = useState(0)
  const [reacts, setReacts] = useState([12, 5, 3])

  const round = room.currentRound
  const plays = round.plays.length
    ? round.plays
    : [
        { playerId: ME_ID, cardId: 'r5' },
        { playerId: 'yaw', cardId: 'r1' },
      ]
  const card = reactionCards.find((c) => c.id === plays[idx % plays.length].cardId) || reactionCards[4]
  const scenario = scenarios.find((x) => x.id === round.scenarioId)!

  const next = () => {
    if (idx < 4) setIdx(idx + 1)
    else if (round.judgeId === ME_ID) gameApi.finishReveal()
    else setTimeout(gameApi.finishReveal, 500)
  }
  const previous = () => setIdx(Math.max(0, idx - 1))

  return (
    <div className="screen reveal">
      <div className="reveal-head">
        <h1>Reveal</h1>
        <span className="round-pill">{idx + 1} OF 5</span>
        <IconButton
          label={prefs.sound ? 'Mute sound' : 'Unmute sound'}
          onClick={() => prefsApi.setSound(!prefs.sound)}
        >
          <Icon name="sound" />
        </IconButton>
      </div>
      <Scenario scenario={scenario} compact />
      <div className="reveal-card">
        <button type="button" aria-label="Previous card" onClick={previous}>
          ‹
        </button>
        <Reaction card={card} />
        <button type="button" aria-label="Next card" onClick={next}>
          ›
        </button>
      </div>
      <p className="swipe">SWIPE TO FLIP THE NEXT CARD</p>
      <ProgressDots index={idx} total={5} />
      <div className="reactions">
        {EMOJIS.map((emoji, i) => (
          <button
            type="button"
            key={emoji}
            aria-label={`React with ${emoji}`}
            onClick={() => setReacts((a) => a.map((n, j) => (i === j ? n + 1 : n)))}
          >
            {emoji} <b>{reacts[i]}</b>
          </button>
        ))}
      </div>
      <Button onClick={next}>NEXT CARD　→</Button>
      <Button variant="secondary" onClick={previous}>
        PREVIOUS
      </Button>
      <small className="judge-name">JUDGE: ABENA</small>
      <HomeBar />
    </div>
  )
}
