import { expect, test } from '@playwright/test'
import { watchErrors } from './helpers'

/**
 * Plays a whole mock game through the real UI, no test hooks: splash, onboarding, sign up,
 * profile setup, create room, lobby, five rounds (including one where you are the judge),
 * game over, then the tabs and the Profile actions. Timers run for real.
 */
for (const { w, h } of [
  { w: 360, h: 640 },
  { w: 390, h: 844 },
]) {
  test(`full mock game, sign up to game over @ ${w}x${h}`, async ({ browser }) => {
    test.setTimeout(240_000)
    const context = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true })
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const page = await context.newPage()
    const errors = watchErrors(page)
    const toastText = () => page.locator('.toast')

    // Splash moves on by itself.
    await page.goto('/')
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 8000 })

    // Onboarding: swipe left to go forward, tap Next, then Let's go.
    await expect(page.getByRole('heading', { name: 'A situation drops' })).toBeVisible()
    await page.mouse.move(w * 0.85, 300)
    await page.mouse.down()
    await page.mouse.move(w * 0.15, 300, { steps: 10 })
    await page.mouse.up()
    await expect(page.getByRole('heading', { name: 'Everyone reacts' })).toBeVisible()
    await page.mouse.move(w * 0.15, 300)
    await page.mouse.down()
    await page.mouse.move(w * 0.85, 300, { steps: 10 })
    await page.mouse.up()
    await expect(page.getByRole('heading', { name: 'A situation drops' })).toBeVisible()
    await page.getByRole('button', { name: /^Next/ }).click()
    await page.getByRole('button', { name: /^Next/ }).click()
    await expect(page.getByRole('heading', { name: 'The judge decides' })).toBeVisible()
    await page.getByRole('button', { name: /Let's go/ }).click()
    await expect(page).toHaveURL(/\/signup/)

    // Sign up / Log in tabs and the link both switch forms, each with its own copy.
    await expect(page.getByRole('heading', { name: 'Make your account' })).toBeVisible()
    await page.getByRole('tab', { name: 'Log in' }).click()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByLabel('DISPLAY NAME')).toHaveCount(0)
    await page.getByRole('button', { name: 'Create an account' }).click()
    await expect(page.getByRole('heading', { name: 'Make your account' })).toBeVisible()
    await page.getByRole('button', { name: 'Log in here' }).click()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await page.getByRole('tab', { name: 'Sign up' }).click()
    await expect(page.getByRole('heading', { name: 'Make your account' })).toBeVisible()

    // Google: no Supabase env here, so a clear "coming soon" toast.
    await page.getByRole('button', { name: /Continue with Google/ }).click()
    await expect(toastText().filter({ hasText: 'coming soon' })).toBeVisible()

    // Validation, then a real sign up.
    await page.getByRole('button', { name: /Create account/ }).click()
    await expect(page.getByText("That doesn't look like an email or Ghana number")).toBeVisible()
    await page.getByLabel('EMAIL OR PHONE NUMBER').fill('kofi@example.com')
    await page.locator('#auth-password').fill('password123')
    await page.getByRole('button', { name: 'Show password' }).click()
    await expect(page.locator('#auth-password')).toHaveAttribute('type', 'text')
    await page.locator('.terms').click()
    await page.getByRole('button', { name: /Create account/ }).click()
    await expect(page).toHaveURL(/\/profile-setup/, { timeout: 5000 })

    // Profile setup.
    await page.getByRole('radio', { name: 'Avatar 8' }).click()
    await page.getByRole('button', { name: /Start playing/ }).click()
    await expect(page).toHaveURL(/\/home/)
    await expect(page.getByRole('heading', { name: /Hey, Kofi/ })).toBeVisible()

    // Create room, lobby fills up, start.
    await page.getByRole('button', { name: /Create Room/ }).click()
    await expect(page).toHaveURL(/\/create/)
    await page.getByRole('radio', { name: '3', exact: true }).click()
    await page.getByRole('button', { name: /Create room/ }).click()
    await expect(page).toHaveURL(/\/room\/[A-Z]{4}/)
    const start = page.getByRole('button', { name: 'Start Game' })
    await expect(start).toBeDisabled()
    await expect(start).toBeEnabled({ timeout: 6000 })
    await start.click()

    // Countdown (ring counts 3-2-1), round intro, then Pick a card.
    await expect(page.locator('.countdown')).toBeVisible()
    await expect(page.locator('.pick')).toBeVisible({ timeout: 15_000 })

    // Pick timer really counts down.
    const timer = page.getByRole('timer')
    const t0 = Number(await timer.innerText())
    await page.waitForTimeout(2200)
    expect(Number(await timer.innerText())).toBeLessThan(t0)

    // Tap a card once: it lifts and is selected. Tap it again: it locks in.
    const second = page.locator('.hand .reaction').nth(1)
    await second.click()
    await expect(second).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.pick')).toBeVisible()
    await second.click()
    await expect(page.locator('.waiting')).toBeVisible({ timeout: 4000 })

    // Rounds. Handle whichever screen is showing until the game is over.
    let results = 0
    let sawJudgeScreen = false
    let firstReveal = true
    for (let guard = 0; guard < 400; guard++) {
      const cls = await page.evaluate(() => document.querySelector('.screen')?.className ?? '')
      if (cls.includes('gameover')) break
      if (cls.includes('judge-picks')) {
        sawJudgeScreen = true
        await page.locator('.judge-grid button.reaction').first().click()
        await page.getByRole('button', { name: /CROWN THIS ONE/ }).click()
      } else if (cls.includes('pick')) {
        await page.getByRole('button', { name: /PLAY THIS CARD/ }).click({ timeout: 5000 })
      } else if (cls.includes('reveal')) {
        if (firstReveal) {
          firstReveal = false
          // Emoji reaction floats up and bumps the count.
          await page.getByRole('button', { name: 'React with 😂' }).click()
          await expect(page.locator('.floaters span')).toHaveCount(1)
          // Swipe the card to flip to the next one.
          const card = page.getByTestId('reveal-card')
          const box = (await card.boundingBox())!
          await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2)
          await page.mouse.down()
          await page.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2, { steps: 8 })
          await page.mouse.up()
          await expect(page.getByText('2 OF 5')).toBeVisible()
          // Reaction cards shown as content are not buttons.
          await expect(page.locator('.reveal button.reaction')).toHaveCount(0)
        }
        const next = page.locator('.reveal [data-cta]')
        if (await next.isEnabled()) await next.click()
        await page.waitForTimeout(150)
      } else if (cls.includes('judge-picks')) {
        sawJudgeScreen = true
        await page.locator('.judge-grid button.reaction').first().click()
        await page.getByRole('button', { name: /CROWN THIS ONE 👑/ }).click()
      } else if (cls.includes('result')) {
        results++
        await expect(page.locator('.result button.reaction')).toHaveCount(0)
        if (results === 1) {
          await page.getByRole('button', { name: /FULL SCOREBOARD/ }).click()
          await expect(page.getByRole('dialog', { name: 'SCOREBOARD' })).toBeVisible()
          await page.getByRole('button', { name: 'CLOSE' }).click()
          await expect(page.getByRole('dialog')).toHaveCount(0)
        }
        await page.locator('.result [data-cta]').click()
      }
      await page.waitForTimeout(250)
    }
    expect(results, 'five rounds should end with a result each').toBe(5)
    expect(sawJudgeScreen, 'you judge one of the five rounds').toBe(true)

    // Game over: score counts up, confetti stops by itself.
    await expect(page.getByText('GAME OVER')).toBeVisible()
    await expect(page.locator('.gameover button.reaction')).toHaveCount(0)
    await expect(page.locator('.champ [data-value="5"]')).toHaveText('5')
    await expect(page.locator('.confetti')).toHaveCount(0, { timeout: 9000 })

    // Share → copy link.
    await page.getByRole('button', { name: /SHARE RESULT/ }).click()
    await page.getByRole('button', { name: 'COPY LINK' }).click()
    await expect(toastText().filter({ hasText: 'Link copied' })).toBeVisible()
    await expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('http')

    // Play again → a new lobby; leave → Home.
    await page.getByRole('button', { name: 'PLAY AGAIN' }).click()
    await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
    await page.getByRole('button', { name: /Leave room/ }).click()
    await expect(page).toHaveURL(/\/home/)

    // Tabs reach each other from every tab screen.
    const tab = (name: string) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name })
    await tab('Packs').click()
    await expect(page).toHaveURL(/\/packs/)
    await tab('Profile').click()
    await expect(page).toHaveURL(/\/profile/)
    await tab('Packs').click()
    await expect(page).toHaveURL(/\/packs/)
    await tab('Home').click()
    await expect(page).toHaveURL(/\/home/)
    await tab('Profile').click()
    await tab('Home').click()
    await expect(page).toHaveURL(/\/home/)
    await page.getByRole('button', { name: 'Profile' }).first().click()
    await expect(page).toHaveURL(/\/profile/)

    // Profile: edit, badge, settings rows, rate, privacy, version, log out, log in, delete.
    await page.getByRole('button', { name: 'EDIT PROFILE', exact: true }).click()
    await page.getByLabel('DISPLAY NAME').fill('Kofi Boateng')
    await page.getByRole('radio', { name: 'Avatar 3' }).click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('heading', { name: 'Kofi Boateng' })).toBeVisible()
    await page.getByRole('button', { name: 'First Win' }).click()
    await expect(page.getByRole('dialog', { name: 'First Win' })).toContainText('first game')
    await page.getByRole('button', { name: 'Got it' }).click()
    const notif = page.getByRole('switch', { name: 'Notifications' })
    await notif.click()
    await expect(notif).toHaveAttribute('aria-checked', 'false')
    await page.getByRole('button', { name: /^Privacy/ }).click()
    await expect(page.getByRole('dialog', { name: 'Privacy' })).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await page.getByRole('button', { name: /Rate the app/ }).click()
    await expect(toastText().filter({ hasText: 'Thanks' })).toBeVisible()
    await expect(page.getByText(/REACTR V\d+\.\d+\.\d+/)).toBeVisible()
    await page.getByRole('button', { name: /Log out/ }).click()
    await expect(page).toHaveURL(/\/signup/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await page.getByLabel('EMAIL OR PHONE NUMBER').fill('kofi@example.com')
    await page.locator('#auth-password').fill('password123')
    await page.getByRole('button', { name: /^Log in/ }).last().click()
    await expect(page).toHaveURL(/\/home/, { timeout: 5000 })
    await page.getByRole('button', { name: 'Profile' }).first().click()
    await page.getByRole('button', { name: /Delete account/ }).click()
    await page.getByRole('dialog').getByRole('button', { name: /^Delete/ }).click()
    await expect(page).toHaveURL(/\/signup/)

    expect(errors, errors.join('\n')).toEqual([])
    await context.close()
  })
}
