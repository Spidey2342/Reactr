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

export interface Session {
  signedIn: boolean
  name: string
  handle: string
  contact: string
  avatar: string
  /** Small data URL of an uploaded photo; wins over the emoji avatar when set. */
  photo?: string
}

export interface Prefs {
  sound: boolean
  haptics: boolean
  notifications: boolean
}

export interface GameState {
  /** The room this device is in, or null when not in a room. `room.phase` is the only game phase. */
  room: Room | null
  /** Settings being edited on the Create Room screen. */
  draftSettings: RoomSettings
  /** Swap-hand used flag (server-owned later). */
  swapped: boolean
  prefs: Prefs
  /** Mock session until Phase 3 (Supabase auth). Persisted in localStorage. */
  session: Session
}

const SESSION_KEY = 'reactr.session'
const PREFS_KEY = 'reactr.prefs'

const defaultSession: Session = {
  signedIn: false,
  name: 'Kofi Mensah',
  handle: 'kofi_mensah',
  contact: '',
  avatar: '😎',
}
const defaultPrefs: Prefs = { sound: true, haptics: true, notifications: true }

function load<T extends object>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<T>) } : fallback
  } catch {
    return fallback
  }
}

const store = createStore<GameState>({
  room: null,
  draftSettings: defaultSettings,
  swapped: false,
  prefs: load(PREFS_KEY, defaultPrefs),
  session: load(SESSION_KEY, defaultSession),
})

let lastSession = store.getState().session
let lastPrefs = store.getState().prefs
store.subscribe(() => {
  const { session, prefs } = store.getState()
  try {
    if (session !== lastSession) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    if (prefs !== lastPrefs) window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    /* storage can be unavailable (private mode); the app still works for this visit */
  }
  lastSession = session
  lastPrefs = prefs
})

/** The store itself, for the dev/e2e hooks only. Screens use gameApi and the hooks below. */
export const gameStore = store
export const getPrefs = () => store.getState().prefs

const patchRoom = (fn: (room: Room) => Room) =>
  store.setState((s) => (s.room ? { ...s, room: fn(s.room) } : s))

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const me = () => {
  const { session } = store.getState()
  return { name: session.name.split(' ')[0].slice(0, 16) || 'You', avatar: session.avatar }
}

export const gameApi: GameApi = {
  setDraftSettings: (draftSettings) => store.setState((s) => ({ ...s, draftSettings })),

  createRoom: () => {
    // Same room code: a rematch in the same room, so the open /room/:code route stays valid.
    const room = makeRoom(store.getState().draftSettings, store.getState().room?.code, ME_ID, me())
    store.setState((s) => ({ ...s, room, swapped: false }))
    return room
  },

  joinRoom: async (code) => {
    await wait(900) // mock network delay
    if (code === 'FULL') return { ok: false, error: 'full' }
    if (code === 'NOPE') return { ok: false, error: 'not_found' }
    const room = makeRoom(store.getState().draftSettings, code, 'ama', me())
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
    // Same room code: a rematch in the same room, so the open /room/:code route stays valid.
    const room = makeRoom(store.getState().draftSettings, store.getState().room?.code, ME_ID, me())
    store.setState((s) => ({ ...s, room, swapped: false }))
    return room
  },
}

export const prefsApi = {
  setSound: (sound: boolean) => store.setState((s) => ({ ...s, prefs: { ...s.prefs, sound } })),
  setHaptics: (haptics: boolean) => store.setState((s) => ({ ...s, prefs: { ...s.prefs, haptics } })),
  setNotifications: (notifications: boolean) =>
    store.setState((s) => ({ ...s, prefs: { ...s.prefs, notifications } })),
}

const toHandle = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'player'

/** Mock auth. Phase 3 swaps these for Supabase calls; the screens keep calling the same methods. */
export const sessionApi = {
  signUp: ({ name, contact }: { name: string; contact: string }) =>
    store.setState((s) => ({
      ...s,
      session: { ...s.session, signedIn: true, name, handle: toHandle(name), contact },
    })),
  logIn: ({ contact }: { contact: string }) =>
    store.setState((s) => ({ ...s, session: { ...s.session, signedIn: true, contact } })),
  logOut: () => store.setState((s) => ({ ...s, room: null, session: { ...s.session, signedIn: false } })),
  updateProfile: (patch: Partial<Pick<Session, 'name' | 'avatar' | 'photo'>>) =>
    store.setState((s) => {
      const next = { ...s.session, ...patch }
      if (patch.name !== undefined) next.handle = toHandle(patch.name)
      return { ...s, session: next }
    }),
  deleteAccount: () => store.setState((s) => ({ ...s, room: null, session: defaultSession })),
}

export function useGameState(): GameState {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState)
}

export const useSession = () => useGameState().session

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
