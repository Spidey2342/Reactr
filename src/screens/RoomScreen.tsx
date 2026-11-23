import { useMemo, useState, type ReactElement } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Icon } from '../components'
import { ME_ID } from '../lib/identity'
import { paths } from '../lib/routes'
import { gameApi, useGameState } from '../state/gameStore'
import { RoomUiContext } from '../state/roomUi'
import type { Phase } from '../types'
import Lobby from './11-12-Lobby'
import Countdown from './13-Countdown'
import RoundIntro from './14-RoundIntro'
import PickACard from './15b-PickACard'
import WaitingForOthers from './16-WaitingForOthers'
import Reveal from './17-Reveal'
import JudgePicks from './18-JudgePicks'
import RoundResult from './19-RoundResult'
import ScoreboardSheet from './20-ScoreboardSheet'
import GameOver from './21-GameOver'
import PauseMenu from './22-PauseMenu'

/** The ONE mapping from game phase to screen. There is no separate "page" state. */
const screenFor: Record<Phase, () => ReactElement> = {
  lobby: () => <Lobby />,
  countdown: () => <Countdown />,
  intro: () => <RoundIntro />,
  pick: () => <PickACard />,
  waiting: () => <WaitingForOthers />,
  reveal: () => <Reveal />,
  judge: () => <JudgePicks />,
  result: () => <RoundResult />,
  gameover: () => <GameOver />,
}

const PAUSABLE: Phase[] = ['countdown', 'intro', 'pick', 'waiting', 'reveal', 'judge', 'result']

/** Route /room/:code. Renders whatever screen the room's phase calls for, plus the room overlays. */
export default function RoomScreen() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { room } = useGameState()
  const [scoreboard, setScoreboard] = useState(false)
  const [paused, setPaused] = useState(false)
  const overlayOpen = scoreboard || paused
  const ui = useMemo(
    () => ({ openScoreboard: () => setScoreboard(true), overlayOpen }),
    [overlayOpen],
  )

  // Not in this room (e.g. page refreshed with mock state). Phase 4 replaces this with a reconnect.
  if (!room || room.code !== code) return <Navigate to={paths.home} replace />

  const isHost = room.players.find((p) => p.id === ME_ID)?.isHost ?? false

  return (
    <RoomUiContext.Provider value={ui}>
      {/* Keyed by phase so each phase change plays the screen-in transition. */}
      <div key={room.phase} className="screen-transition">
        {screenFor[room.phase]()}
      </div>
      {scoreboard && <ScoreboardSheet room={room} close={() => setScoreboard(false)} />}
      {paused && (
        <PauseMenu
          host={isHost}
          close={() => setPaused(false)}
          end={() => {
            setPaused(false)
            gameApi.leaveRoom()
            navigate(paths.home)
          }}
        />
      )}
      {PAUSABLE.includes(room.phase) && (
        <button type="button" className="pause-dot" aria-label="Pause menu" onClick={() => setPaused(true)}>
          <Icon name="menu" size={14} />
        </button>
      )}
    </RoomUiContext.Provider>
  )
}
