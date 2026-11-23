import { useEffect } from 'react'
import { HomeBar, Scenario } from '../components'
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { gameApi, useRequiredRoom } from '../state/gameStore'

export default function RoundIntro() {
  const room = useRequiredRoom()
  const scenario = scenarios.find((x) => x.id === room.currentRound.scenarioId)!

  useEffect(() => {
    const t = setTimeout(gameApi.finishIntro, 1700)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="screen round-intro glow-page">
      <span className="round-pill">ROUND {room.currentRound.number} OF 5</span>
      <div className="judge-banner">👑 YOU'RE THE JUDGE</div>
      <Scenario scenario={scenario} />
      <div className="big-mark" aria-hidden="true">
        !
      </div>
      <p>Pick the reaction that hits hardest</p>
      <HomeBar />
    </div>
  )
}
