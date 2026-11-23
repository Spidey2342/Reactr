// Builds the screens x viewports table from e2e/results.json (written by `pnpm test:e2e`).
// Usage: node e2e/report.mjs
import { readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('./results.json', import.meta.url), 'utf8'))
const rows = new Map()
const other = []
const walk = (suite) => {
  for (const spec of suite.specs ?? []) {
    const ok = spec.tests.every((t) => t.status === 'expected')
    const m = spec.title.match(/^(.*) @ (\d+x\d+)$/)
    if (spec.file.includes('audit') && m) {
      if (!rows.has(m[1])) rows.set(m[1], {})
      rows.get(m[1])[m[2]] = ok ? 'pass' : 'FAIL'
    } else other.push([spec.title, ok ? 'pass' : 'FAIL'])
  }
  for (const s of suite.suites ?? []) walk(s)
}
data.suites.forEach(walk)

const sizes = ['360x640', '375x667', '390x844', '430x932']
const lines = ['| Screen | ' + sizes.join(' | ') + ' |', '|---|' + sizes.map(() => '---').join('|') + '|']
for (const [name, r] of [...rows].sort((a, b) => a[0].localeCompare(b[0])))
  lines.push(`| ${name} | ${sizes.map((s) => r[s] ?? '-').join(' | ')} |`)
console.log(lines.join('\n'))
console.log('\n| Other test | Result |\n|---|---|')
for (const [t, r] of other) console.log(`| ${t} | ${r} |`)
const { expected, unexpected, flaky } = data.stats
console.log(`\nTotal: ${expected} passed, ${unexpected} failed, ${flaky} flaky`)
