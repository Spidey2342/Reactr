import { Icon } from './Icon'
import { IconButton } from './Button'
import { SoundButton } from './SoundButton'

export function TopBar({ round = 1, onScore }: { round?: number; onScore?: () => void }) {
  return (
    <div className="topbar">
      <span className="round-pill">ROUND {round} OF 5</span>
      <span className="judge">
        ♛<b>JUDGE</b>
      </span>
      <div>
        {onScore && (
          <IconButton label="Scoreboard" onClick={onScore}>
            <Icon name="chart" />
          </IconButton>
        )}
        <SoundButton />
      </div>
    </div>
  )
}
