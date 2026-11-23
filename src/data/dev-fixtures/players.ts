// DEV FIXTURE: fake players for the mock engine. Removed in Phase 2/3.
import type { Player } from '../../types'

export const mockPlayers: Player[] = [
  { id: 'you', name: 'Kofi', avatar: '😎', isHost: true, isJudge: false, score: 0, status: 'online' },
  { id: 'ama', name: 'Ama', avatar: '👩🏾', isHost: false, isJudge: true, score: 0, status: 'online' },
  { id: 'yaw', name: 'Yaw', avatar: '🧑🏿', isHost: false, isJudge: false, score: 0, status: 'online' },
  { id: 'efua', name: 'Efua', avatar: '👩🏿‍🦱', isHost: false, isJudge: false, score: 0, status: 'online' },
  {
    id: 'kwesi',
    name: 'Kwesi Nana Akosua Serwaa',
    avatar: '🧔🏾',
    isHost: false,
    isJudge: false,
    score: 0,
    status: 'online',
  },
  { id: 'abena', name: 'Abena', avatar: '👩🏽', isHost: false, isJudge: false, score: 0, status: 'online' },
  { id: 'leo', name: 'Leo', avatar: '🧑🏽‍🦱', isHost: false, isJudge: false, score: 0, status: 'online' },
]
