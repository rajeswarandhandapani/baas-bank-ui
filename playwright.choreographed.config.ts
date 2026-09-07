import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e/choreographed', timeout: 90000, expect: { timeout: 20000 }, workers: 1,
  use: { baseURL: 'http://localhost:4201', viewport: { width: 1440, height: 1000 }, actionTimeout: 20000, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  outputDir: 'test-results/choreographed',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/choreographed', open: 'never' }]],
});
