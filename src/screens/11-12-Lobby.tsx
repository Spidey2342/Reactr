import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Avatar,
  BackTitle,
  Button,
  Modal,
  ProgressDots,
  RoomCode,
  Screen,
  SoundButton,
  toast,
} from '../components'
import { ME_ID } from '../lib/identity'
import { paths } from '../lib/routes'
import { frozen } from '../lib/timing'
import { gameApi, useRequiredRoom } from '../state/gameStore'
import type { Player } from '../types'

/** Designs 11 (host) and 12 (player). The variant is derived from who the host is. */
export default function Lobby() {
  const navigate = useNavigate()
  const room = useRequiredRoom()
  const host = room.players.find((p) => p.id === ME_ID)?.isHost ?? false
  const hostName = room.players.find((p) => p.isHost)?.name ?? 'The host'
  // Mock only: players "arrive" one by one for the host. Phase 3 replaces this with live data.
  const [count, setCount] = useState(host && !frozen() ? 1 : 4)
  const [kick, setKick] = useState<Player | null>(null)
  const [kicked, setKicked] = useState<string[]>([])

  useEffect(() => {
    if (!host || count >= 4 || frozen()) return
    const t = setTimeout(() => setCount(count + 1), 700)
    return () => clearTimeout(t)
  }, [count, host])

  const players = room.players.slice(0, count).filter((p) => !kicked.includes(p.id))
  const leave = () => {
    gameApi.leaveRoom()
    navigate(paths.home)
  }

  return (
    <Screen
      className="lobby"
      head={<BackTitle title="Lobby" onBack={leave} action={<SoundButton />} />}
      foot={
        <>
          {host ? (
            <>
              <Button cta disabled={players.length < 3} onClick={gameApi.startGame}>
                Start Game
              </Button>
              {players.length < 3 && <p className="minimum">◆ Minimum 3 players</p>}
            </>
          ) : null}
          <button type="button" className="leave" onClick={leave}>
            ↳ Leave room
          </button>
        </>
      }
    >
      <RoomCode code={room.code} />
      <div className="lobby-chips">
        <span>● OPEN</span>
        <small>▣ QR</small>
      </div>
      <div className="lobby-meta">
        <span>🏆 First to {room.settings.pointsToWin}</span>
        <span>⏱ {room.settings.pickTimer ? `${room.settings.pickTimer} sec` : 'No timer'}</span>
      </div>
      <div className="title-row">
        <h2>Players</h2>
        <small>
          {players.length}/{room.settings.maxPlayers}
        </small>
      </div>
      <div className="players">
        {players.map((p) => (
          <Avatar key={p.id} player={p} onKick={host && p.id !== ME_ID ? () => setKick(p) : undefined} />
        ))}
      </div>
      {!host && (
        <div className="waiting-host">
          <ProgressDots index={1} />
          <b>Waiting for host to start...</b>
          <small>{hostName} is setting up the game</small>
        </div>
      )}
      {kick && (
        <Modal
          title={`Kick ${kick.name}?`}
          onClose={() => setKick(null)}
          actions={
            <Button
              onClick={() => {
                setKicked((k) => [...k, kick.id])
                toast(`${kick.name} was removed from the room`)
                setKick(null)
              }}
            >
              Yes, kick player
            </Button>
          }
        >
          <p className="muted">They will be removed from the room.</p>
        </Modal>
      )}
    </Screen>
  )
}
