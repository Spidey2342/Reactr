import { prefsApi, useGameState, useRequiredRoom } from '../state/gameStore'
import { useRoomUi } from '../state/roomUi'
import { TopBar } from './TopBar'

/** TopBar wired to the store: current round, sound preference and the scoreboard sheet. */
export function RoomTopBar() {
  const room = useRequiredRoom()
  const { prefs } = useGameState()
  const { openScoreboard } = useRoomUi()
  return (
    <TopBar
      round={room.currentRound.number}
      sound={prefs.sound}
      onSound={() => prefsApi.setSound(!prefs.sound)}
      onScore={openScoreboard}
    />
  )
}
