// Usage: node e2e/shots.mjs <before|after> [baseURL]
// Captures Home, Create room and Pick a card by clicking through the real UI (no test hooks).
import { chromium } from '@playwright/test'
import fs from 'node:fs'

const label = process.argv[2] ?? 'after'
const base = process.argv[3] ?? 'http://127.0.0.1:4173'
const out = `e2e/screenshots/${label}`
fs.mkdirSync(out, { recursive: true })
const viewports = [
  { w: 360, h: 640 },
  { w: 390, h: 844 },
]
const browser = await chromium.launch({
  executablePath: process.env.E2E_CHROME_PATH || undefined,
  args: ['--no-sandbox'],
})
for (const { w, h } of viewports) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto(`${base}/home`)
  await page.waitForSelector('.home')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/home-${w}x${h}.png` })
  await page.getByRole('button', { name: /Create Room/i }).first().click()
  await page.waitForSelector('.create')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/create-room-${w}x${h}.png` })
  await page.getByRole('button', { name: /Create room/i }).last().click({ force: true })
  await page.waitForSelector('.lobby')
  const start = page.getByRole('button', { name: 'Start Game' })
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent?.includes('Start Game'))
    return b && !b.disabled
  })
  await start.click()
  await page.waitForSelector('.pick', { timeout: 15000 })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${out}/pick-a-card-${w}x${h}.png` })
  await ctx.close()
}
await browser.close()
console.log('saved to', out)
