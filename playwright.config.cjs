const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
    locale: 'fr-FR',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      args: process.env.PLAYWRIGHT_CHROMIUM_ARGS
        ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS)
        : []
    }
  },
  webServer: {
    command: 'node scripts/serve.mjs --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 15000
  }
});
