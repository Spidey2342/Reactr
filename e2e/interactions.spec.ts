import { expect, test } from '@playwright/test'
import { boot, enterRoom, go, reset, watchErrors } from './helpers'

test.describe('interactions', () => {
  test('sound toggle is one shared setting across screens', async ({ page }) => {
    const errors = watchErrors(page)
    await boot(page)
    await reset(page)
    await go(page, '/home')
    await page.getByRole('button', { name: 'Mute sound' }).click()
    await expect(page.getByRole('button', { name: 'Unmute sound' })).toBeVisible()
    await enterRoom(page, { phase: 'lobby', host: true })
    await expect(page.getByRole('button', { name: 'Unmute sound' })).toBeVisible()
    await page.getByRole('button', { name: 'Unmute sound' }).click()
    await go(page, '/home')
    await expect(page.getByRole('button', { name: 'Mute sound' })).toBeVisible()
    expect(errors, errors.join('\n')).toEqual([])
  })

  test('vibration and sound follow their toggles', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as any // eslint-disable-line @typescript-eslint/no-explicit-any
      w.__vib = 0
      w.__osc = 0
      navigator.vibrate = () => {
        w.__vib++
        return true
      }
      const Orig = window.AudioContext
      w.AudioContext = class extends Orig {
        createOscillator() {
          w.__osc++
          return super.createOscillator()
        }
      }
    })
    await boot(page)
    await reset(page)
    await enterRoom(page, { phase: 'pick', host: false })
    const count = (k: string) => page.evaluate((key) => (window as any)[key] as number, k) // eslint-disable-line @typescript-eslint/no-explicit-any
    const card = page.locator('.hand .reaction').nth(1)

    // Both on: selecting a card buzzes and beeps.
    await card.click()
    expect(await count('__vib')).toBeGreaterThan(0)
    expect(await count('__osc')).toBeGreaterThan(0)

    // Pause menu: turn both off, then more taps make no new buzz or beep.
    await page.getByRole('button', { name: 'Pause menu' }).click()
    await page.getByRole('switch', { name: 'Sound' }).click()
    await page.getByRole('switch', { name: 'Vibration and haptics' }).click()
    await page.getByRole('button', { name: /Resume/ }).click()
    const v = await count('__vib')
    const o = await count('__osc')
    await page.locator('.hand .reaction').nth(2).click()
    await page.locator('.hand .reaction').nth(3).click()
    expect(await count('__vib')).toBe(v)
    expect(await count('__osc')).toBe(o)
  })

  for (const { w, h } of [
    { w: 360, h: 640 },
    { w: 430, h: 932 },
  ]) {
    test(`join room: Join sits directly above the keyboard, nothing overlaps @ ${w}x${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h })
      await boot(page)
      await reset(page)
      await go(page, '/join')
      const join = page.getByRole('button', { name: /^Join/ }).last()
      const kb = page.getByRole('group', { name: 'Room code keyboard' })
      const jb = (await join.boundingBox())!
      const kbb = (await kb.boundingBox())!
      expect(jb.y + jb.height, 'Join ends above the keyboard').toBeLessThanOrEqual(kbb.y + 1)
      expect(kbb.y - (jb.y + jb.height), 'Join is directly above, not far away').toBeLessThan(40)
      expect(kbb.y + kbb.height).toBeLessThanOrEqual(h)
      // Typing with the on-screen keys fills the code and enables Join.
      await expect(join).toBeDisabled()
      for (const k of ['K', 'F', 'Z', 'A']) await kb.getByRole('button', { name: k, exact: true }).click()
      await expect(join).toBeEnabled()
    })
  }

  test('paste: clipboard allowed, empty, and permission denied', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write'])
    const page = await ctx.newPage()
    await boot(page)
    await go(page, '/join')
    await page.evaluate(() => navigator.clipboard.writeText('Join my game: KFZA'))
    await page.getByRole('button', { name: /Paste/ }).click()
    await expect(page.locator('.toast', { hasText: 'Pasted KFZA' })).toBeVisible()
    await page.evaluate(() => navigator.clipboard.writeText('hello there'))
    await page.getByRole('button', { name: /Paste/ }).click()
    await expect(page.locator('.toast', { hasText: 'no room code' })).toBeVisible()
    await ctx.close()

    const denied = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const p2 = await denied.newPage()
    await p2.addInitScript(() => {
      Object.defineProperty(navigator.clipboard, 'readText', {
        value: () => Promise.reject(new DOMException('denied', 'NotAllowedError')),
      })
    })
    await boot(p2)
    await go(p2, '/join')
    await p2.getByRole('button', { name: /Paste/ }).click()
    await expect(p2.locator('.toast', { hasText: "Couldn't read your clipboard" })).toBeVisible()
    await denied.close()
  })

  test('scan QR: unsupported browser shows a message; a stubbed scanner fills the code', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await ctx.newPage()
    await page.addInitScript(() => {
      delete (window as any).BarcodeDetector // eslint-disable-line @typescript-eslint/no-explicit-any
    })
    await boot(page)
    await go(page, '/join')
    await page.getByRole('button', { name: /Scan QR/ }).click()
    await expect(page.locator('.toast', { hasText: "QR scanning isn't supported" })).toBeVisible()
    await ctx.close()

    const ok = await browser.newContext({
      viewport: { width: 390, height: 844 },
      permissions: ['camera'],
      launchOptions: undefined as never,
    } as never)
    const p2 = await ok.newPage()
    await p2.addInitScript(() => {
      const w = window as any // eslint-disable-line @typescript-eslint/no-explicit-any
      w.BarcodeDetector = class {
        async detect() {
          return [{ rawValue: 'https://reactr.app/join/KFZA' }]
        }
      }
      navigator.mediaDevices.getUserMedia = async () => {
        const c = document.createElement('canvas')
        c.width = 64
        c.height = 64
        const g = c.getContext('2d')!
        setInterval(() => {
          g.fillStyle = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
          g.fillRect(0, 0, 64, 64)
        }, 30)
        return (c as any).captureStream(30) // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    })
    await boot(p2)
    await go(p2, '/join')
    await p2.getByRole('button', { name: /Scan QR/ }).click()
    await expect(p2.locator('.toast', { hasText: 'Scanned KFZA' })).toBeVisible({ timeout: 6000 })
    await ok.close()
  })
})
