import type { Player } from '../types'
import { ME_ID } from '../lib/identity'

/** Emoji avatar. Structured so a photo URL can be added to Player later (ask before changing). */
export function Avatar({
  player,
  small = false,
  onKick,
}: {
  player: Player
  small?: boolean
  onKick?: () => void
}) {
  return (
    <div className={`avatar-tile ${small ? 'small' : ''} ${player.status}`}>
      <div className="avatar-ring">
        <span role="img" aria-label={`${player.name}'s avatar`}>
          {player.avatar}
        </span>
        {player.isHost && (
          <i className="crown" aria-label="Host">
            ♛
          </i>
        )}
        {onKick && (
          <button type="button" aria-label={`Kick ${player.name}`} onClick={onKick}>
            ×
          </button>
        )}
      </div>
      <strong title={player.name}>{player.name}</strong>
      {player.id === ME_ID && <em>YOU</em>}
    </div>
  )
}
