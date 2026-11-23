import { useState } from 'react'
import { Button, Modal, Toggle } from '../components'
import { prefsApi, useGameState } from '../state/gameStore'

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
  const { prefs } = useGameState()

  return (
    <div className="pause-layer">
      <div className="pause-panel">
        <h1>Paused</h1>
        <p className="muted">Round 3 of 5　•　Session active</p>
        <Button onClick={close}>▶　Resume</Button>
        <button type="button">▣　How to play</button>
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
      {confirm && (
        <Modal
          title={host ? 'End game for everyone?' : 'Leave this game?'}
          onClose={() => setConfirm(false)}
          actions={
            <div className="dialog-actions">
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={end}>End game</Button>
            </div>
          }
        >
          <p className="muted">As host, leaving ends the game for everyone.</p>
        </Modal>
      )}
    </div>
  )
}
