import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('auth0-config', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    // Restore window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('uses environment variables for domain and clientId', async () => {
    vi.stubEnv('VITE_AUTH0_DOMAIN', 'test-domain.auth0.com');
    vi.stubEnv('VITE_AUTH0_CLIENT_ID', 'test-client-id');

    const { auth0Config } = await import('../../src/auth0-config');

    expect(auth0Config.domain).toBe('test-domain.auth0.com');
    expect(auth0Config.clientId).toBe('test-client-id');

    vi.unstubAllEnvs();
  });

  it('falls back to placeholder values when env vars are not set', async () => {
    vi.stubEnv('VITE_AUTH0_DOMAIN', '');
    vi.stubEnv('VITE_AUTH0_CLIENT_ID', '');

    const { auth0Config } = await import('../../src/auth0-config');

    expect(auth0Config.domain).toBe('your-domain.auth0.com');
    expect(auth0Config.clientId).toBe('your-client-id');

    vi.unstubAllEnvs();
  });

  it('uses localStorage for cacheLocation', async () => {
    const { auth0Config } = await import('../../src/auth0-config');
    expect(auth0Config.cacheLocation).toBe('localstorage');
  });

  it('enables refresh tokens', async () => {
    const { auth0Config } = await import('../../src/auth0-config');
    expect(auth0Config.useRefreshTokens).toBe(true);
  });

  it('sets redirectUri to electron callback in non-development mode', async () => {
    // Vitest runs with MODE=test (not development), so getRedirectUri()
    // returns the Electron production callback.
    const { auth0Config } = await import('../../src/auth0-config');
    expect(auth0Config.redirectUri).toBe('electron://app/callback');
  });
});
