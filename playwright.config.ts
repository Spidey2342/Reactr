import { defineConfig } from '@playwright/test'

/**
 * `pnpm test:e2e` starts the app itself (hermetic vite config, port 4173) and runs everything in ./e2e.
 * Browser: Playwright's Chromium by default (`pnpm exec playwright install chromium` once).
 * Set E2E_CHROME_PATH to use an installed Chrome/Chromium instead.
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  timeout: 60_000,
  reporter: [['list'], ['json', { outputFile: 'e2e/results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: {
      executablePath: process.env.E2E_CHROME_PATH || undefined,
      args: ['--no-sandbox'],
    },
    trace: 'off',
  },
  webServer: {
    command: 'pnpm exec vite --config vite.e2e.config.ts',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
