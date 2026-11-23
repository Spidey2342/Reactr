import { expect, test, type Page } from '@playwright/test'
import { boot, VIEWPORTS, watchErrors } from './helpers'
import { SCREENS } from './screens'

/**
 * Visits every screen at four phone sizes and fails on:
 *  (a) a visible interactive element with no handler, or whose click/typing does nothing
 *  (b) the primary CTA or the tab bar being outside the viewport without scrolling (or covered)
 *  (c) horizontal overflow
 *  (d) console errors, uncaught exceptions or failed requests
 */

const INTERACTIVE =
  'button, a[href], input, select, textarea, [role="button"], [role="tab"], [role="switch"], [tabindex]:not([tabindex="-1"])'

/** Which part of the page can be touched right now: an open dialog or pause layer hides the rest. */
const scopeSelector = (page: Page) =>
  page.evaluate(() => {
    if (document.querySelector('[role="dialog"]')) return '[role="dialog"]'
    if (document.querySelector('.pause-layer')) return '.pause-layer'
    return '.app'
  })

/** Tags the visible, enabled interactive elements in scope with data-audit and returns how many. */
const tagInteractive = (page: Page, scope: string, selector: string) =>
  page.evaluate(
    ({ scope, selector }) => {
      document.querySelectorAll('[data-audit]').forEach((e) => e.removeAttribute('data-audit'))
      const root = document.querySelector(scope)
      if (!root) return { total: 0, noHandler: [] as string[], disabled: 0 }
      const seen = new Set<Element>()
      let n = 0
      let disabled = 0
      const noHandler: string[] = []
      root.querySelectorAll(selector).forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        if (r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || cs.display === 'none') return
        if ((el as HTMLButtonElement).disabled) {
          disabled++
          return
        }
        // The option that is already selected in a radio group has nothing left to do when tapped again.
        if (el.getAttribute('role') === 'radio' && el.getAttribute('aria-checked') === 'true') return
        // Same for the tab that is already showing.
        if (el.getAttribute('role') === 'tab' && el.getAttribute('aria-selected') === 'true') return
        const key = Object.keys(el).find((k) => k.startsWith('__reactProps$'))
        const props = key ? ((el as unknown as Record<string, Record<string, unknown>>)[key] ?? {}) : {}
        const hasHandler = Object.keys(props).some((k) => /^on[A-Z]/.test(k) && typeof props[k] === 'function')
        const label = `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().slice(0, 40)}"`
        if (!hasHandler) noHandler.push(label)
        el.setAttribute('data-audit', String(n++))
      })
      return { total: n, noHandler, disabled }
    },
    { scope, selector },
  )

test.describe('audit: every screen at every size', () => {
  for (const screen of SCREENS) {
    for (const { w, h } of VIEWPORTS) {
      test(`${screen.id} @ ${w}x${h}`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true })
        const page = await context.newPage()
        const errors = watchErrors(page)
        let fileChooser = false
        page.on('filechooser', () => (fileChooser = true))
        await boot(page)
        const problems: string[] = []

        await screen.setup(page)
        // Let the screen-in transition finish (measure a settled screen, not one mid-slide).
        await page.evaluate(async () => {
          const running = () =>
            document.getAnimations().filter((a) => {
              const end = a.effect?.getComputedTiming().endTime
              return typeof end === 'number' && Number.isFinite(end) && a.playState === 'running'
            })
          const start = performance.now()
          let quiet = 0
          while (performance.now() - start < 3000 && quiet < 3) {
            await new Promise((r) => requestAnimationFrame(r))
            quiet = running().length ? 0 : quiet + 1
          }
        })

        // (b) primary CTA and tab bar are on screen without scrolling, and not covered.
        const layout = await page.evaluate(
          ({ wantCta, wantTabs }) => {
            const out: string[] = []
            const vw = window.innerWidth
            const vh = window.innerHeight
            const scope =
              document.querySelector('.pause-layer') ?? document.querySelector('[role="dialog"]') ?? document.body
            const inside = (el: Element) => {
              const r = el.getBoundingClientRect()
              return r.left >= -0.5 && r.right <= vw + 0.5 && r.top >= -0.5 && r.bottom <= vh + 0.5
            }
            const uncovered = (el: Element) => {
              const r = el.getBoundingClientRect()
              const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
              return !!hit && (el === hit || el.contains(hit))
            }
            if (wantCta) {
              const cta = scope.querySelector('[data-cta]')
              if (!cta) out.push('no primary CTA ([data-cta]) found')
              else {
                const r = cta.getBoundingClientRect()
                if (!inside(cta)) out.push(`primary CTA is outside the viewport (top ${Math.round(r.top)}, bottom ${Math.round(r.bottom)}, viewport ${vh})`)
                else if (!uncovered(cta)) out.push('primary CTA is covered by another element')
              }
            }
            if (wantTabs) {
              const tabs = document.querySelector('nav.tabs')
              if (!tabs) out.push('no tab bar found')
              else {
                if (!inside(tabs)) out.push('tab bar is outside the viewport')
                tabs.querySelectorAll('button').forEach((b) => {
                  if (!inside(b) || !uncovered(b)) out.push(`tab "${b.textContent}" is cut off or covered`)
                })
              }
            }
            return out
          },
          { wantCta: screen.cta, wantTabs: !!screen.tabs },
        )
        problems.push(...layout.map((m) => `(b) ${m}`))

        // (c) horizontal overflow: the page, every shell container, and every control.
        const overflow = await page.evaluate(() => {
          const out: string[] = []
          const vw = window.innerWidth
          const de = document.documentElement
          if (de.scrollWidth > vw) out.push(`page scrollWidth ${de.scrollWidth} > viewport ${vw}`)
          if (document.body.scrollWidth > vw) out.push(`body scrollWidth ${document.body.scrollWidth} > viewport ${vw}`)
          document
            .querySelectorAll('.app,.screen,.screen-head,.screen-body,.screen-foot,.overlay,.modal,.pause-layer,.pause-panel,.tabs')
            .forEach((el) => {
              if (el.closest('[data-hscroll]')) return
              if (el.scrollWidth > el.clientWidth + 1)
                out.push(`.${el.className.toString().split(' ')[0]} scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth}`)
            })
          document.querySelectorAll('button,input,.input,h1,h2,h3,p').forEach((el) => {
            if (el.closest('[data-hscroll]') || el.closest('.confetti')) return
            const r = el.getBoundingClientRect()
            if (r.width < 2 || r.height < 2) return
            if (r.right > vw + 1 || r.left < -1)
              out.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 24)}" sticks out horizontally (${Math.round(r.left)}..${Math.round(r.right)} of ${vw})`)
          })
          return out
        })
        problems.push(...overflow.map((m) => `(c) ${m}`))

        // (a) every visible interactive element has a handler and its use changes something.
        const scope = await scopeSelector(page)
        const first = await tagInteractive(page, scope, INTERACTIVE)
        problems.push(...first.noHandler.map((m) => `(a) no handler: ${m}`))
        const total = first.total
        expect(total, 'screen has no interactive elements to audit').toBeGreaterThan(0)

        for (let i = 0; i < total; i++) {
          if (i > 0) {
            await screen.setup(page)
            await page.waitForTimeout(120)
            const s = await scopeSelector(page)
            const again = await tagInteractive(page, s, INTERACTIVE)
            if (again.total !== total) {
              problems.push(`(a) interactive element count changed between visits (${total} vs ${again.total})`)
              break
            }
          }
          const target = page.locator(`[data-audit="${i}"]`)
          const info = await target.evaluate((el) => ({
            label: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().slice(0, 40)}"`,
            isText: el instanceof HTMLInputElement && ['text', 'password', 'email', 'tel', ''].includes(el.type),
            isCheck: el instanceof HTMLInputElement && el.type === 'checkbox',
          }))
          fileChooser = false
          await page.evaluate(() => {
            const w = window as unknown as { __audit?: { mutated: boolean; mo: MutationObserver } }
            w.__audit?.mo.disconnect()
            const state = { mutated: false, mo: null as unknown as MutationObserver }
            state.mo = new MutationObserver((records) => {
              // CountUp animates text on its own; that is not a reaction to the click.
              if (records.some((r) => !(r.target as Element).closest?.('[data-value]') && !(r.target.parentElement?.closest('[data-value]')))) state.mutated = true
            })
            state.mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true })
            w.__audit = state
          })
          const before = await target.evaluate((el) => ({
            href: location.href,
            value: (el as HTMLInputElement).value,
            checked: (el as HTMLInputElement).checked,
          }))
          try {
            if (info.isText) await target.fill(before.value + 'x', { timeout: 4000 })
            else await target.click({ timeout: 4000 })
          } catch (e) {
            problems.push(`(a) could not use ${info.label}: ${String((e as Error).message).split('\n')[0]}`)
            continue
          }
          await page.waitForTimeout(220)
          const after = await page.evaluate(() => {
            const w = window as unknown as { __audit?: { mutated: boolean } }
            const t = document.querySelector('[data-audit]') as HTMLInputElement | null
            return { href: location.href, mutated: !!w.__audit?.mutated, value: t?.value, checked: t?.checked }
          })
          const changed =
            after.mutated ||
            after.href !== before.href ||
            fileChooser ||
            (info.isText && after.value !== before.value) ||
            (info.isCheck && after.checked !== before.checked)
          if (!changed) problems.push(`(a) does nothing when used: ${info.label}`)
        }

        // (d) console errors and failed requests across the whole visit.
        problems.push(...errors.map((m) => `(d) ${m}`))

        await context.close()
        expect(problems, problems.join('\n')).toEqual([])
      })
    }
  }
})
