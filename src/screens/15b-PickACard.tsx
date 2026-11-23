import { useEffect, useRef, useState } from 'react'
import { Button, Icon, Reaction, RoomTopBar, Scenario, Screen, TimerRing } from '../components'
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { feedback } from '../lib/feedback'
import { frozen } from '../lib/timing'
import { gameApi, useGameState, useHand, useRequiredRoom } from '../state/gameStore'

/** Design 15b "Pick A Card Selected v2" (15 is superseded). */
export default function PickACard() {
  const room = useRequiredRoom()
  const { swapped } = useGameState()
  const hand = useHand()
  const total = room.settings.pickTimer
  const [selected, setSelected] = useState(() => hand[0].id)
  const [locked, setLocked] = useState(false)
  const [left, setLeft] = useState(total)
  const stripRef = useRef<HTMLDivElement>(null)
  const scenario = scenarios.find((x) => x.id === room.currentRound.scenarioId)!
  const card = hand.find((c) => c.id === selected) || hand[0]

  // A new hand (after Swap hand) starts with its first card selected.
  useEffect(() => setSelected(hand[0].id), [hand])

  const lock = (id: string) => {
    if (locked) return
    setLocked(true)
    feedback.lock()
    gameApi.submitPlay(id)
  }

  // Tap a card once to lift it, tap it again to lock it in.
  const choose = (id: string) => {
    if (id === selected) lock(id)
    else {
      setSelected(id)
      feedback.select()
    }
  }

  // Keep the selected card centred in the hand strip.
  useEffect(() => {
    // Scroll only the strip. scrollIntoView would also scroll the whole screen body.
    const strip = stripRef.current
    const el = strip?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!strip || !el) return
    strip.scrollTo({ left: el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' })
  }, [selected, hand])

  // The pick timer. Out of time plays the selected card.
  const latest = useRef(lock)
  latest.current = lock
  useEffect(() => {
    if (!total || frozen() || locked) return
    if (left <= 0) {
      latest.current(selected)
      return
    }
    const t = setTimeout(() => {
      if (left <= 6) feedback.tick()
      setLeft(left - 1)
    }, 1000)
    return () => clearTimeout(t)
  }, [left, total, locked, selected])

  return (
    <Screen
      className="pick"
      head={<RoomTopBar />}
      foot={
        <Button cta disabled={locked} onClick={() => lock(card.id)}>
          <Icon name="bolt" size={18} />　PLAY THIS CARD
        </Button>
      }
    >
      <div className="pick-scenario">
        <Scenario scenario={scenario} compact />
        {total > 0 && <TimerRing value={left} total={total} />}
      </div>
      <div className="pick-main">
        <Reaction selected card={card} onClick={() => lock(card.id)} />
      </div>
      <p className="lock-hint">TAP AGAIN TO LOCK IT IN</p>
      <button type="button" className="swap" disabled={swapped || locked} onClick={gameApi.swapHand}>
        ⟳　Swap hand ({swapped ? '0' : '1'} left)
      </button>
      <div className="hand" ref={stripRef} data-hscroll>
        {hand.map((c) => (
          <Reaction key={c.id} mini card={c} selected={c.id === selected} onClick={() => choose(c.id)} />
        ))}
      </div>
    </Screen>
  )
}
