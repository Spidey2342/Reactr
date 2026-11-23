import { useState } from 'react'
import { Button, Icon, Modal, Toggle } from '../components'
import { prefsApi, useGameState, useRequiredRoom } from '../state/gameStore'
import { HowSteps } from './23-HowToPlay'

export default function PauseMenu({
  host,
  close,
  end,
}: {
  host: boolean
  close: () => void
  end: () => void
}) {
  const [confirm, setConfirm] = useState(false)
  const [how, setHow] = useState(false)
  const { prefs } = useGameState()
  const room = useRequiredRoom()

  return (
    <div className="pause-layer">
      <div className="pause-panel">
        <h1>Paused</h1>
        <p className="muted">Round {room.currentRound.number} of 5　•　Session active</p>
        <Button cta onClick={close}>
          ▶　Resume
        </Button>
        <button type="button" onClick={() => setHow(true)}>
          <span>▣　How to play</span>
          <Icon name="arrow" size={16} />
        </button>
        <label>
          <span>🔊　Sound</span>
          <Toggle label="Sound" on={prefs.sound} onChange={prefsApi.setSound} />
        </label>
        <label>
          <span>📳　Vibration / Haptics</span>
          <Toggle label="Vibration and haptics" on={prefs.haptics} onChange={prefsApi.setHaptics} />
        </label>
        <button type="button" className="leave" onClick={() => setConfirm(true)}>
          ↳ Leave game
        </button>
      </div>
      {how && (
        <Modal
          title="How to play"
          onClose={() => setHow(false)}
          actions={<Button onClick={() => setHow(false)}>Got it!</Button>}
        >
          <HowSteps compact />
        </Modal>
      )}
      {confirm && (
        <Modal
          title={host ? 'End game for everyone?' : 'Leave this game?'}
          onClose={() => setConfirm(false)}
          actions={
            <div className="dialog-actions">
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={end}>{host ? 'End game' : 'Leave game'}</Button>
            </div>
          }
        >
          <p className="muted">
            {host
              ? 'As host, leaving ends the game for everyone.'
              : 'You will leave the room. The game carries on without you.'}
          </p>
        </Modal>
      )}
    </div>
  )
}
