import { Button, CountUp, Modal } from '../components'
import { ME_ID } from '../lib/identity'
import type { Room } from '../types'

const ordinal = (n: number) => ['1ST', '2ND', '3RD'][n - 1] ?? `${n}TH`

export default function ScoreboardSheet({ room, close }: { room: Room; close: () => void }) {
  const sorted = [...room.players].sort((a, b) => b.score - a.score)
  const place = sorted.findIndex((p) => p.id === ME_ID) + 1

  return (
    <Modal
      title="SCOREBOARD"
      onClose={close}
      actions={
        <Button variant="secondary" onClick={close}>
          CLOSE
        </Button>
      }
    >
      <p className="muted">
        FIRST TO {room.settings.pointsToWin} • ROUND {room.currentRound.number}
      </p>
      <div className="score-list">
        {sorted.map((p, i) => (
          <div key={p.id}>
            <b>{i + 1}</b>
            <span>{p.avatar}</span>
            <strong>{p.name}</strong>
            <em>
              <CountUp value={p.score} ms={500} /> pts
            </em>
          </div>
        ))}
      </div>
      <small className="muted">YOU'RE IN {ordinal(place)} PLACE</small>
    </Modal>
  )
}
