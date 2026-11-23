/** Every URL in the app lives here. Game screens are NOT routes: /room/:code renders them from room.phase. */
export const paths = {
  splash: '/',
  onboarding: '/onboarding',
  signup: '/signup',
  profileSetup: '/profile-setup',
  home: '/home',
  packs: '/packs',
  profile: '/profile',
  create: '/create',
  join: (code?: string) => (code ? `/join/${code}` : '/join'),
  room: (code: string) => `/room/${code}`,
  howTo: '/how-to-play',
} as const
