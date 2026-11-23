import type { Page } from '@playwright/test'

export const VIEWPORTS = [
  { w: 360, h: 640 },
  { w: 375, h: 667 },
  { w: 390, h: 844 },
  { w: 430, h: 932 },
] as const

type RoomSetup = { phase: string; host?: boolean; judge?: boolean; round?: number }

/** Loads the app once. `freeze` stops auto-advancing screens so they can be inspected. */
export async function boot(page: Page, { freeze = true } = {}) {
  if (freeze) await page.addInitScript(() => ((window as unknown as { __REACTR_FREEZE__: boolean }).__REACTR_FREEZE__ = true))
  await page.goto('/')
  await page.waitForFunction(() => Boolean((window as unknown as { __reactr?: unknown }).__reactr))
}

export const go = (page: Page, path: string) =>
  page.evaluate((p) => (window as any).__reactr.go(p), path) // eslint-disable-line @typescript-eslint/no-explicit-any

export const reset = (page: Page) => page.evaluate(() => (window as any).__reactr.reset()) // eslint-disable-line @typescript-eslint/no-explicit-any

export const enterRoom = (page: Page, setup: RoomSetup) =>
  page.evaluate((s) => (window as any).__reactr.room(s), setup) // eslint-disable-line @typescript-eslint/no-explicit-any

/** Collects everything that should fail a test: console errors, uncaught exceptions, failed or 4xx/5xx requests. */
export function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText ?? ''}`))
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`)
  })
  return errors
}
