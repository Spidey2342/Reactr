import { ME_ID } from './identity'
import { gameApi, gameStore, prefsApi, sessionApi } from '../state/gameStore'
import { crown, defaultSettings, fillBotPlays, makeRoom, playCard, setPhase } from '../state/mockEngine'
import type { Phase } from '../types'

export interface RoomSetup {
  phase: Phase
  /** Are you the host (true) or a player who joined (false)? */
  host?: boolean
  /** Are you the judge this round? */
  judge?: boolean
  round?: number
}

export interface ReactrHooks {
  go: (path: string) => void
  reset: () => void
  room: (setup: RoomSetup) => string
  state: () => unknown
}

declare global {
  interface Window {
    __reactr?: ReactrHooks
    __REACTR_FREEZE__?: boolean
  }
}

/**
 * Test hooks for the e2e audit: jump straight to any screen without waiting for timers.
 * Installed in dev only; `import.meta.env.DEV` is false in production builds so this is tree-shaken out.
 */
export function installDevHooks(navigate: (path: string) => void) {
  if (!import.meta.env.DEV) return
  window.__reactr = {
    go: (path) => navigate(path),
    reset: () => {
      gameApi.leaveRoom()
      sessionApi.deleteAccount()
      prefsApi.setSound(true)
      prefsApi.setHaptics(true)
      prefsApi.setNotifications(true)
      gameApi.setDraftSettings(defaultSettings)
    },
    state: () => gameStore.getState(),
    room: ({ phase, host = true, judge = false, round = 1 }) => {
      const code = 'KFZ7'
      const judgeId = judge ? ME_ID : 'ama'
      let room = makeRoom(defaultSettings, code, host ? ME_ID : 'ama', { name: 'Kofi', avatar: '😎' })
      room = {
        ...room,
        players: room.players.map((p) => ({ ...p, isJudge: p.id === judgeId })),
        currentRound: { ...room.currentRound, number: round, judgeId },
      }
      if (['waiting', 'reveal', 'judge', 'result', 'gameover'].includes(phase)) {
        if (!judge) room = playCard(room, ME_ID, 'r1')
        room = fillBotPlays(room)
      }
      if (phase === 'result') room = crown(room, 'ama')
      room = setPhase(room, phase)
      gameStore.setState((s) => ({ ...s, room, swapped: false }))
      navigate(`/room/${code}`)
      return code
    },
  }
}
