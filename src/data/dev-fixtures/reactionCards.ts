// DEV FIXTURE: 40 fake reaction cards sharing only 3 images. Replaced by the DB seed in Phase 2/5.
import type { ReactionCard } from '../../types'

const captions = [
  'NAWA FOR YOU OO',
  'SUDDEN HATE',
  'I PREFER NOT TO SPEAK',
  'MTEWWWWWW',
  'WAHALA',
  'WHO SENT YOU?',
  'EISH...',
  'CHARLEY!',
  'GOD ABEG',
  'IT IS WELL',
  'SERIOUSLY?',
  'NO PRESSURE',
  'AS FOR ME...',
  'YOU DEY PLAY',
  'HERH!',
  'I CAN’T SHOUT',
  'WE MOVE',
  'THIS LIFE',
  'ABEG REST',
  'PAIN',
  'I’M TIRED',
  'NEVER AGAIN',
  'WHY ALWAYS ME?',
  'SMALL SMALL',
  'YOU TRY',
  'DEAD',
  'CONFUSION',
  'NOT TODAY',
  'WHAT IS THIS?',
  'ENOUGH',
  'I KNOW RIGHT',
  'THE AUDACITY',
  'BIG MOOD',
  'LOUDER',
  'SAY LESS',
  'CHAI',
  'OH WOW',
  'PLEASE PLEASE',
  'NO COMMENT',
  'FINAL FINAL',
]

const images = ['/assets/reaction-nawa.jpg', '/assets/reaction-wahala.jpg', '/assets/reaction-clout.jpg']

export const reactionCards: ReactionCard[] = captions.map((caption, i) => ({
  id: `r${i + 1}`,
  caption,
  color: i % 2 ? 'yellow' : 'pink',
  imageUrl: images[i % images.length],
}))
