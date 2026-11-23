import { createContext, useContext } from 'react'

/** Room-level UI actions (scoreboard sheet, pause menu) that any in-room screen can trigger. */
export interface RoomUi {
  openScoreboard: () => void
  /** True while a sheet or the pause menu covers the screen. Timers that auto-advance wait while it is. */
  overlayOpen: boolean
}

export const RoomUiContext = createContext<RoomUi>({ openScoreboard: () => {}, overlayOpen: false })
export const useRoomUi = () => useContext(RoomUiContext)
