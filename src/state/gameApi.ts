import type { Room, RoomSettings } from '../types'

export type JoinResult = { ok: true; code: string } | { ok: false; error: 'not_found' | 'full' }

/**
 * Everything the UI is allowed to do to the game. The mock engine implements this today;
 * Phase 2/3 replaces it with Supabase function calls. Screens only ever call these methods
 * and render the state, they never compute game rules.
 */
export interface GameApi {
  setDraftSettings: (settings: RoomSettings) => void
  createRoom: () => Room
  joinRoom: (code: string) => Promise<JoinResult>
  leaveRoom: () => void
  startGame: () => void
  finishCountdown: () => void
  finishIntro: () => void
  submitPlay: (cardId: string) => void
  swapHand: () => void
  finishWaiting: () => void
  finishReveal: () => void
  crown: (winnerId: string) => void
  nextRound: () => void
  playAgain: () => Room
}
