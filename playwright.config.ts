import { defineConfig, devices } from '@playwright/test'

/**
 * E2E configuration for PetHUB frontend.
 *
 * Prerequisites:
 * - Frontend dev server: npm run dev (or set E2E_BASE_URL to an already-running instance)
 * - Backend running at VITE_API_BASE_URL (default http://localhost:3000)
 * - Test accounts pre-verified in the DB (see e2e/global.setup.ts for credentials)
 *
 * Run: npx playwright test
 * Run with UI: npx playwright test --ui
 * Run single spec: npx playwright test e2e/auth.spec.ts
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/global.setup.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],

  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
})
