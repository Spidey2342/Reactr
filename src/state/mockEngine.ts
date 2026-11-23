// MOCK ENGINE: fake, client-side game rules. Replaced by Supabase functions in Phase 2.
// Pure functions only; the store calls these.
import type { Phase, ReactionCard, Room, RoomSettings, Round } from '../types'
import { mockPlayers } from '../data/dev-fixtures/players'
import { reactionCards } from '../data/dev-fixtures/reactionCards'
import { scenarios } from '../data/dev-fixtures/scenarios'
import { ME_ID } from '../lib/identity'

export const defaultSettings: RoomSettings = {
  pointsToWin: 5,
  pickTimer: 30,
  maxPlayers: 6,
  packs: ['Everyday Life', 'School Life', 'Trotro & Transport', 'Work & Hustle'],
  judgeMode: 'rotating',
  midGameJoin: true,
}

export const randomCode = () =>
  Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')

/** `asHostId` is who hosts the room; the device owner (ME_ID) is a normal player when it differs. */
export function makeRoom(
  settings = defaultSettings,
  code = randomCode(),
  asHostId: string = ME_ID,
  me?: { name: string; avatar: string },
): Room {
  const players = mockPlayers.slice(0, 4).map((p) => ({
    ...p,
    ...(p.id === ME_ID && me ? { name: me.name, avatar: me.avatar } : {}),
    score: 0,
    isHost: p.id === asHostId,
  }))
  const round: Round = { number: 1, scenarioId: scenarios[0].id, judgeId: 'ama', plays: [] }
  return { code, settings, players, deck: reactionCards, currentRound: round, phase: 'lobby' }
}

export function setPhase(room: Room, phase: Phase): Room {
  return { ...room, phase }
}

export function nextRound(room: Room): Room {
  const n = room.currentRound.number + 1
  const online = room.players.filter((p) => p.status === 'online')
  const judge =
    room.settings.judgeMode === 'random'
      ? online[Math.floor(Math.random() * online.length)]
      : online[n % online.length]
  return {
    ...room,
    phase: 'intro',
    players: room.players.map((p) => ({ ...p, isJudge: p.id === judge.id })),
    currentRound: {
      number: n,
      scenarioId: scenarios[(n - 1) % scenarios.length].id,
      judgeId: judge.id,
      plays: [],
    },
  }
}

export function playCard(room: Room, playerId: string, cardId: string): Room {
  return {
    ...room,
    currentRound: {
      ...room.currentRound,
      plays: [...room.currentRound.plays.filter((p) => p.playerId !== playerId), { playerId, cardId }],
    },
  }
}

export function fillBotPlays(room: Room): Room {
  let next = room
  room.players
    .filter((p) => !p.isJudge && p.status === 'online')
    .forEach((p, i) => {
      if (!next.currentRound.plays.some((x) => x.playerId === p.id)) {
        const card = reactionCards[(room.currentRound.number * 5 + i) % reactionCards.length]
        next = playCard(next, p.id, card.id)
      }
    })
  return next
}

export function crown(room: Room, winnerId: string): Room {
  return {
    ...room,
    phase: 'result',
    players: room.players.map((p) => (p.id === winnerId ? { ...p, score: p.score + 1 } : p)),
    currentRound: { ...room.currentRound, winnerId },
  }
}

export function handFor(round: number): ReactionCard[] {
  return Array.from({ length: 7 }, (_, i) => reactionCards[(round * 4 + i) % reactionCards.length])
}
