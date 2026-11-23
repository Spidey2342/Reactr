import { useMemo, useSyncExternalStore } from 'react'
import type { Room, RoomSettings } from '../types'
import { ME_ID } from '../lib/identity'
import { createStore } from './createStore'
import type { GameApi } from './gameApi'
import {
  crown,
  defaultSettings,
  fillBotPlays,
  handFor,
  makeRoom,
  nextRound,
  playCard,
  setPhase,
} from './mockEngine'

export interface GameState {
  /** The room this device is in, or null when not in a room. `room.phase` is the only game phase. */
  room: Room | null
  /** Settings being edited on the Create Room screen. */
  draftSettings: RoomSettings
  /** Swap-hand used flag (server-owned later). */
  swapped: boolean
  prefs: { sound: boolean; haptics: boolean }
}

const store = createStore<GameState>({
  room: null,
  draftSettings: defaultSettings,
  swapped: false,
  prefs: { sound: true, haptics: true },
})

const patchRoom = (fn: (room: Room) => Room) =>
  store.setState((s) => (s.room ? { ...s, room: fn(s.room) } : s))

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const gameApi: GameApi = {
  setDraftSettings: (draftSettings) => store.setState((s) => ({ ...s, draftSettings })),

  createRoom: () => {
    const room = makeRoom(store.getState().draftSettings)
    store.setState((s) => ({ ...s, room, swapped: false }))
    return room
  },

  joinRoom: async (code) => {
    await wait(900) // mock network delay
    if (code === 'FULL') return { ok: false, error: 'full' }
    if (code === 'NOPE') return { ok: false, error: 'not_found' }
    const room = makeRoom(store.getState().draftSettings, code, 'ama')
    store.setState((s) => ({ ...s, room, swapped: false }))
    return { ok: true, code }
  },

  leaveRoom: () => store.setState((s) => ({ ...s, room: null, swapped: false })),
  startGame: () => patchRoom((r) => setPhase(r, 'countdown')),
  finishCountdown: () => patchRoom((r) => setPhase(r, 'intro')),
  finishIntro: () =>
    patchRoom((r) => setPhase(r, r.currentRound.judgeId === ME_ID ? 'judge' : 'pick')),
  submitPlay: (cardId) => patchRoom((r) => setPhase(fillBotPlays(playCard(r, ME_ID, cardId)), 'waiting')),
  swapHand: () => store.setState((s) => ({ ...s, swapped: true })),
  finishWaiting: () => patchRoom((r) => setPhase(r, 'reveal')),
  // Mock only: when someone else judges, the mock crowns 'ama' (the old fake behaviour).
  finishReveal: () =>
    patchRoom((r) => (r.currentRound.judgeId === ME_ID ? setPhase(r, 'judge') : crown(r, 'ama'))),
  crown: (winnerId) => patchRoom((r) => crown(r, winnerId)),
  nextRound: () =>
    patchRoom((r) => (r.currentRound.number >= 5 ? setPhase(r, 'gameover') : nextRound(r))),
  playAgain: () => {
    const room = makeRoom(store.getState().draftSettings)
    store.setState((s) => ({ ...s, room, swapped: false }))
    return room
  },
}

export const prefsApi = {
  setSound: (sound: boolean) => store.setState((s) => ({ ...s, prefs: { ...s.prefs, sound } })),
  setHaptics: (haptics: boolean) => store.setState((s) => ({ ...s, prefs: { ...s.prefs, haptics } })),
}

export function useGameState(): GameState {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState)
}

/** The current room. Only call inside screens that are rendered under a valid /room/:code. */
export function useRequiredRoom(): Room {
  const { room } = useGameState()
  if (!room) throw new Error('useRequiredRoom called outside a room')
  return room
}

export function useHand() {
  const { room, swapped } = useGameState()
  const round = room?.currentRound.number ?? 1
  return useMemo(() => handFor(round + (swapped ? 8 : 0)), [round, swapped])
}
