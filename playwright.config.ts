import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'tests/e2e/report', open: 'never' }]],
});
