import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to reset the module cache between tests since loadWordsAsync has an internal cache
describe('loadWordsAsync', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns empty array for invalid culture', async () => {
    const { loadWordsAsync } = await import('../../src/services/Load');
    const result = await loadWordsAsync('invalid', 'test', 5);
    expect(result).toEqual([]);
  });

  it('returns empty array for empty search string', async () => {
    const { loadWordsAsync } = await import('../../src/services/Load');
    const result = await loadWordsAsync('en', '', 5);
    expect(result).toEqual([]);
  });

  it('fetches word list and returns matching words', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('apple\napplication\napply\nbanana\ncherry'),
    });

    const { loadWordsAsync } = await import('../../src/services/Load');
    const result = await loadWordsAsync('en', 'app', 5);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/en.txt'));
    expect(result).toContain('apple');
    expect(result).toContain('application');
    expect(result).toContain('apply');
    expect(result).not.toContain('banana');
  });

  it('limits results to specified count', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('apple\napplication\napply\nappear\nappend'),
    });

    const { loadWordsAsync } = await import('../../src/services/Load');
    const result = await loadWordsAsync('en', 'app', 2);
    expect(result.length).toBe(2);
  });

  it('prioritizes prefix matches over contains matches', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('pineapple\napple\napplication'),
    });

    const { loadWordsAsync } = await import('../../src/services/Load');
    const result = await loadWordsAsync('en', 'app', 5);

    // apple and application start with "app", pineapple only contains it
    const appleIndex = result.indexOf('apple');
    const pineappleIndex = result.indexOf('pineapple');
    expect(appleIndex).toBeLessThan(pineappleIndex);
  });

  it('caches word list for subsequent calls', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('apple\nbanana'),
    });

    const { loadWordsAsync } = await import('../../src/services/Load');
    await loadWordsAsync('en', 'app', 5);
    await loadWordsAsync('en', 'ban', 5);

    // Should only fetch once since it's cached
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('returns empty array when fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    const { loadWordsAsync } = await import('../../src/services/Load');
    const result = await loadWordsAsync('en', 'test', 5);
    expect(result).toEqual([]);
    consoleSpy.mockRestore();
    consoleErrSpy.mockRestore();
  });

  it('returns empty array when fetch returns non-ok status', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { loadWordsAsync } = await import('../../src/services/Load');
    const result = await loadWordsAsync('en', 'test', 5);
    expect(result).toEqual([]);
    consoleSpy.mockRestore();
    consoleErrSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('supports all valid cultures', async () => {
    const validCultures = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pt', 'ru', 'zh'];
    for (const culture of validCultures) {
      vi.resetModules();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('word1\nword2'),
      });

      const { loadWordsAsync } = await import('../../src/services/Load');
      const result = await loadWordsAsync(culture, 'word', 5);
      expect(result.length).toBeGreaterThan(0);
    }
  });
});
