import { prefsApi, useGameState } from '../state/gameStore'
import { Button } from './Button'
import { Modal } from './Modal'
import { Toggle } from './Toggle'

/** The settings sheet opened by every gear icon. Same three switches as the Profile settings list. */
export function SettingsSheet({ close }: { close: () => void }) {
  const { prefs } = useGameState()
  return (
    <Modal
      title="Settings"
      onClose={close}
      actions={
        <Button variant="secondary" onClick={close}>
          Done
        </Button>
      }
    >
      <div className="sheet-list">
        <label>
          <span>Sound</span>
          <Toggle label="Sound" on={prefs.sound} onChange={prefsApi.setSound} />
        </label>
        <label>
          <span>Vibration and haptics</span>
          <Toggle label="Haptics" on={prefs.haptics} onChange={prefsApi.setHaptics} />
        </label>
        <label>
          <span>Notifications</span>
          <Toggle label="Notifications" on={prefs.notifications} onChange={prefsApi.setNotifications} />
        </label>
      </div>
    </Modal>
  )
}
