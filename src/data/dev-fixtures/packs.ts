// DEV FIXTURE: fake pack list with made-up card counts. Real counts come from the DB in Phase 2/5.
export interface PackInfo {
  name: string
  emoji: string
  count: number
  color: 'pink' | 'yellow' | 'mint'
}

export const packs: PackInfo[] = [
  { name: 'Everyday Life', emoji: '🤪', count: 48, color: 'pink' },
  { name: 'School Life', emoji: '🎒', count: 42, color: 'yellow' },
  { name: 'Trotro & Transport', emoji: '🚌', count: 36, color: 'mint' },
  { name: 'Family & Relatives', emoji: '👨‍👩‍👧', count: 38, color: 'pink' },
  { name: 'Work & Hustle', emoji: '💼', count: 32, color: 'mint' },
]
