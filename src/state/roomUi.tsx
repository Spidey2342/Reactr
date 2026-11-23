import { createContext, useContext } from 'react'

/** Room-level UI actions (scoreboard sheet, pause menu) that any in-room screen can trigger. */
export interface RoomUi {
  openScoreboard: () => void
}

export const RoomUiContext = createContext<RoomUi>({ openScoreboard: () => {} })
export const useRoomUi = () => useContext(RoomUiContext)
