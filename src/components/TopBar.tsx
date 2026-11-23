import { Icon } from './Icon'
import { IconButton } from './Button'

export function TopBar({
  round = 1,
  onScore,
  onSound,
  sound = true,
}: {
  round?: number
  onScore?: () => void
  onSound?: () => void
  sound?: boolean
}) {
  return (
    <div className="topbar">
      <span className="round-pill">ROUND {round} OF 5</span>
      <span className="judge">
        ♛<b>JUDGE</b>
      </span>
      <div>
        <IconButton label="Scoreboard" onClick={onScore}>
          <Icon name="chart" />
        </IconButton>
        <IconButton label={sound ? 'Mute sound' : 'Unmute sound'} onClick={onSound}>
          <Icon name="sound" />
          {!sound && <i className="slash" />}
        </IconButton>
      </div>
    </div>
  )
}
