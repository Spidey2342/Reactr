import { chromium } from '@playwright/test'

/** Loads the app once before any test so the dev server has compiled everything and settled its dependency cache. */
export default async function globalSetup() {
  const browser = await chromium.launch({
    executablePath: process.env.E2E_CHROME_PATH || undefined,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto('http://127.0.0.1:4173/')
  await page.waitForFunction(() => Boolean((window as unknown as { __reactr?: unknown }).__reactr))
  await page.waitForTimeout(1500)
  await browser.close()
}
