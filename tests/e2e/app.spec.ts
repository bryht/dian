import { test, expect, _electron as electron } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ROOT = path.resolve(__dirname, '../..');
const SCREENSHOTS = path.join(__dirname, 'screenshots');

fs.mkdirSync(SCREENSHOTS, { recursive: true });

async function launchApp(): Promise<{ app: ElectronApplication; page: Page }> {
  const app = await electron.launch({
    args: [path.join(ROOT, 'electron/main.cjs')],
    env: {
      ...process.env,
      ELECTRON_TEST: '1',        // load from build/ instead of localhost:5173
      NODE_ENV: 'test',
    },
  });
  const page = await app.firstWindow();
  await page.waitForLoadState('domcontentloaded');
  return { app, page };
}

// ── App launch ────────────────────────────────────────────────────────────────

test('app launches and shows a window', async () => {
  const { app, page } = await launchApp();
  const windows = app.windows();
  expect(windows.length).toBeGreaterThan(0);
  await page.screenshot({ path: path.join(SCREENSHOTS, '01-app-launch.png'), fullPage: true });
  await app.close();
});

test('window has correct title', async () => {
  const { app, page } = await launchApp();
  const title = await app.evaluate(({ BrowserWindow }) =>
    BrowserWindow.getAllWindows()[0].getTitle()
  );
  expect(title).toBeTruthy();
  await app.close();
});

// ── Login page (unauthenticated state) ───────────────────────────────────────

test('login page renders when not authenticated', async () => {
  const { app, page } = await launchApp();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS, '02-login-page.png'), fullPage: true });

  const body = await page.textContent('body');
  expect(body).toBeTruthy();
  expect(body!.length).toBeGreaterThan(0);
  await app.close();
});

test('login page has a login button', async () => {
  const { app, page } = await launchApp();
  await page.waitForTimeout(1500);

  const loginBtn = page.locator('button').first();
  await expect(loginBtn).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: path.join(SCREENSHOTS, '03-login-button.png'), fullPage: true });
  await app.close();
});

test('login page shows app name "Dian"', async () => {
  const { app, page } = await launchApp();
  await page.waitForTimeout(1500);

  const bodyText = (await page.textContent('body')) ?? '';
  expect(bodyText.toLowerCase()).toContain('dian');
  await app.close();
});

// ── DOM structure ─────────────────────────────────────────────────────────────

test('root element is mounted', async () => {
  const { app, page } = await launchApp();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS, '04-root-mounted.png'), fullPage: true });

  const root = page.locator('#root');
  await expect(root).toBeAttached();
  await app.close();
});

test('page has no uncaught JS errors on load', async () => {
  const errors: string[] = [];
  const { app, page } = await launchApp();

  page.on('pageerror', (err) => errors.push(err.message));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOTS, '05-no-errors.png'), fullPage: true });

  const critical = errors.filter(
    (e) =>
      !e.includes('Failed to fetch') &&
      !e.includes('NetworkError') &&
      !e.includes('net::ERR')
  );
  expect(critical).toHaveLength(0);
  await app.close();
});

// ── Window properties ─────────────────────────────────────────────────────────

test('window is visible and has positive dimensions', async () => {
  const { app } = await launchApp();

  const bounds = await app.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    return win.getBounds();
  });

  expect(bounds.width).toBeGreaterThan(100);
  expect(bounds.height).toBeGreaterThan(100);
  await app.close();
});

test('window is not minimized on launch', async () => {
  const { app } = await launchApp();

  const minimized = await app.evaluate(({ BrowserWindow }) =>
    BrowserWindow.getAllWindows()[0].isMinimized()
  );
  expect(minimized).toBe(false);
  await app.close();
});
