import { Button, Modal } from '../components'
import type { Player } from '../types'

export default function ScoreboardSheet({ players, close }: { players: Player[]; close: () => void }) {
  const sorted = [...players].sort((a, b) => b.score - a.score)

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
      <p className="muted">FIRST TO 5 • ROUND 3</p>
      <div className="score-list">
        {sorted.map((p, i) => (
          <div key={p.id}>
            <b>{i + 1}</b>
            <span>{p.avatar}</span>
            <strong>{p.name}</strong>
            <em>{p.score} pts</em>
          </div>
        ))}
      </div>
      <small className="muted">YOU'RE IN 4TH PLACE</small>
    </Modal>
  )
}
