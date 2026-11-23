import { prefsApi, useGameState } from '../state/gameStore'
import { Icon } from './Icon'
import { IconButton } from './Button'

/** The one sound toggle. Every sound icon in the app is this component, so they share one setting. */
export function SoundButton() {
  const { prefs } = useGameState()
  return (
    <IconButton
      label={prefs.sound ? 'Mute sound' : 'Unmute sound'}
      pressed={!prefs.sound}
      onClick={() => prefsApi.setSound(!prefs.sound)}
    >
      <Icon name="sound" />
      {!prefs.sound && <i className="slash" aria-hidden="true" />}
    </IconButton>
  )
}
