import { useEffect } from 'react'
import { Scenario, Screen } from '../components'
import { scenarios } from '../data/dev-fixtures/scenarios' // DEV FIXTURE
import { ME_ID } from '../lib/identity'
import { frozen } from '../lib/timing'
import { gameApi, useRequiredRoom } from '../state/gameStore'

export default function RoundIntro() {
  const room = useRequiredRoom()
  const scenario = scenarios.find((x) => x.id === room.currentRound.scenarioId)!
  const judge = room.players.find((p) => p.id === room.currentRound.judgeId)
  const iAmJudge = room.currentRound.judgeId === ME_ID

  useEffect(() => {
    if (frozen()) return
    const t = setTimeout(gameApi.finishIntro, 1700)
    return () => clearTimeout(t)
  }, [])

  return (
    <Screen className="round-intro" glow>
      <span className="round-pill">ROUND {room.currentRound.number} OF 5</span>
      <div className="judge-banner">
        👑 {iAmJudge ? "YOU'RE THE JUDGE" : `${(judge?.name ?? 'SOMEONE').toUpperCase()} IS THE JUDGE`}
      </div>
      <Scenario scenario={scenario} />
      <div className="big-mark" aria-hidden="true">
        !
      </div>
      <p>{iAmJudge ? 'Everyone else is picking. You decide who wins.' : 'Pick the reaction that hits hardest'}</p>
    </Screen>
  )
}
