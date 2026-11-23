import type { Page } from '@playwright/test'
import { enterRoom, go, reset } from './helpers'

export interface ScreenDef {
  id: string
  /** Gets the app into this screen from any state. */
  setup: (page: Page) => Promise<void>
  /** Does the screen have a primary action that must be on screen without scrolling? */
  cta: boolean
  /** Does it show the bottom tab bar? */
  tabs?: boolean
}

// Leaving through an unknown path first guarantees the target screen mounts fresh (no state left over).
const fresh = async (page: Page) => {
  await reset(page)
  await go(page, '/__fresh')
  await page.waitForSelector('.splash')
}

const route = (path: string) => async (page: Page) => {
  await fresh(page)
  await go(page, path)
  await page.waitForSelector('.screen')
}

const room = (setup: Parameters<typeof enterRoom>[1]) => async (page: Page) => {
  await fresh(page)
  await enterRoom(page, setup)
  await page.waitForSelector('.screen')
}

/** Every route and every in-room screen, plus every sheet, overlay and dev state. */
export const SCREENS: ScreenDef[] = [
  { id: '01 splash', setup: route('/'), cta: false },
  { id: '02 onboarding 1', setup: route('/onboarding'), cta: true },
  {
    id: '03 onboarding 2',
    setup: async (p) => {
      await route('/onboarding')(p)
      await p.getByRole('button', { name: /^Next/ }).click()
      await p.waitForSelector('text=Everyone reacts')
    },
    cta: true,
  },
  {
    id: '04 onboarding 3',
    setup: async (p) => {
      await route('/onboarding')(p)
      await p.getByRole('button', { name: /^Next/ }).click()
      await p.getByRole('button', { name: /^Next/ }).click()
      await p.waitForSelector('text=The judge decides')
    },
    cta: true,
  },
  { id: '05 sign up', setup: route('/signup'), cta: true },
  {
    id: '05b log in',
    setup: async (p) => {
      await route('/signup')(p)
      await p.getByRole('tab', { name: 'Log in' }).click()
      await p.waitForSelector('text=Welcome back')
    },
    cta: true,
  },
  { id: '06 profile setup', setup: route('/profile-setup'), cta: true },
  { id: '07 home', setup: route('/home'), cta: true, tabs: true },
  { id: '08 packs', setup: route('/packs'), cta: false, tabs: true },
  { id: '09 create room', setup: route('/create'), cta: true },
  { id: '10 join room', setup: route('/join'), cta: true },
  { id: '11 lobby host', setup: room({ phase: 'lobby', host: true }), cta: true },
  { id: '12 lobby player', setup: room({ phase: 'lobby', host: false }), cta: false },
  { id: '13 countdown', setup: room({ phase: 'countdown' }), cta: false },
  { id: '14 round intro', setup: room({ phase: 'intro' }), cta: false },
  { id: '15 pick a card', setup: room({ phase: 'pick' }), cta: true },
  { id: '16 waiting', setup: room({ phase: 'waiting' }), cta: false },
  { id: '17 reveal', setup: room({ phase: 'reveal' }), cta: true },
  { id: '18 judge picks', setup: room({ phase: 'judge', judge: true }), cta: false },
  { id: '19 round result', setup: room({ phase: 'result' }), cta: true },
  { id: '21 game over', setup: room({ phase: 'gameover' }), cta: true },
  { id: '23 how to play', setup: route('/how-to-play'), cta: true },
  { id: '24 profile', setup: route('/profile'), cta: false, tabs: true },
  {
    id: '20 scoreboard sheet',
    setup: async (p) => {
      await room({ phase: 'pick' })(p)
      await p.getByRole('button', { name: 'Scoreboard' }).click()
      await p.waitForSelector('[role=dialog]')
    },
    cta: false,
  },
  {
    id: '22 pause menu',
    setup: async (p) => {
      await room({ phase: 'pick' })(p)
      await p.getByRole('button', { name: 'Pause menu' }).click()
      await p.waitForSelector('.pause-layer')
    },
    cta: true,
  },
  {
    id: '22b pause how to play',
    setup: async (p) => {
      await room({ phase: 'pick' })(p)
      await p.getByRole('button', { name: 'Pause menu' }).click()
      await p.getByRole('button', { name: /How to play/ }).click()
      await p.waitForSelector('[role=dialog]')
    },
    cta: false,
  },
  {
    id: '09b settings sheet',
    setup: async (p) => {
      await route('/create')(p)
      await p.getByRole('button', { name: 'Settings' }).click()
      await p.waitForSelector('[role=dialog]')
    },
    cta: false,
  },
  {
    id: '24b edit profile sheet',
    setup: async (p) => {
      await route('/profile')(p)
      await p.getByRole('button', { name: 'EDIT PROFILE', exact: true }).click()
      await p.waitForSelector('[role=dialog]')
    },
    cta: false,
  },
  {
    id: '24c badge sheet',
    setup: async (p) => {
      await route('/profile')(p)
      await p.getByRole('button', { name: 'First Win' }).click()
      await p.waitForSelector('[role=dialog]')
    },
    cta: false,
  },
  { id: '25 no internet (dev)', setup: route('/dev/no-internet'), cta: true },
  { id: '26 disconnected (dev)', setup: route('/dev/disconnected'), cta: true },
  { id: '27 host transfer (dev)', setup: route('/dev/host-transfer'), cta: true },
]
