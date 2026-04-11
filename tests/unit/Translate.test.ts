import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock franc
vi.mock('franc', () => ({
  franc: vi.fn(),
}));

import { getCulture, translateWord } from '../../src/services/Translate';
import { franc } from 'franc';

const mockFranc = franc as unknown as ReturnType<typeof vi.fn>;

describe('getCulture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mapped ISO 639-1 code for known languages', async () => {
    mockFranc.mockReturnValue('eng');
    expect(await getCulture('hello world')).toBe('en');
  });

  it('maps German correctly', async () => {
    mockFranc.mockReturnValue('deu');
    expect(await getCulture('Guten Tag')).toBe('de');
  });

  it('maps French correctly', async () => {
    mockFranc.mockReturnValue('fra');
    expect(await getCulture('bonjour')).toBe('fr');
  });

  it('maps Spanish correctly', async () => {
    mockFranc.mockReturnValue('spa');
    expect(await getCulture('hola')).toBe('es');
  });

  it('maps Italian correctly', async () => {
    mockFranc.mockReturnValue('ita');
    expect(await getCulture('ciao')).toBe('it');
  });

  it('maps Portuguese correctly', async () => {
    mockFranc.mockReturnValue('por');
    expect(await getCulture('olá')).toBe('pt');
  });

  it('maps Dutch correctly', async () => {
    mockFranc.mockReturnValue('nld');
    expect(await getCulture('hallo')).toBe('nl');
  });

  it('maps Russian correctly', async () => {
    mockFranc.mockReturnValue('rus');
    expect(await getCulture('привет')).toBe('ru');
  });

  it('maps Japanese correctly', async () => {
    mockFranc.mockReturnValue('jpn');
    expect(await getCulture('こんにちは')).toBe('ja');
  });

  it('maps Korean correctly', async () => {
    mockFranc.mockReturnValue('kor');
    expect(await getCulture('안녕하세요')).toBe('ko');
  });

  it('maps Chinese (cmn) correctly', async () => {
    mockFranc.mockReturnValue('cmn');
    expect(await getCulture('你好')).toBe('zh');
  });

  it('maps Chinese (zho) correctly', async () => {
    mockFranc.mockReturnValue('zho');
    expect(await getCulture('你好')).toBe('zh');
  });

  it('returns null for undetermined language', async () => {
    mockFranc.mockReturnValue('und');
    expect(await getCulture('xyz')).toBeNull();
  });

  it('returns raw code for unmapped languages', async () => {
    mockFranc.mockReturnValue('swe');
    expect(await getCulture('hej')).toBe('swe');
  });

  it('returns null on franc error', async () => {
    mockFranc.mockImplementation(() => { throw new Error('franc error'); });
    expect(await getCulture('test')).toBeNull();
  });
});

describe('translateWord', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns translated word from Google Translate API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([[['hallo']]]),
    });

    const result = await translateWord('en', 'nl', 'hello');
    expect(result).toBe('hallo');
  });

  it('returns original word when translation data is malformed', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(null),
    });

    const result = await translateWord('en', 'nl', 'hello');
    expect(result).toBe('hello');
  });

  it('returns original word on network error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    const result = await translateWord('en', 'nl', 'hello');
    expect(result).toBe('hello');
    consoleSpy.mockRestore();
  });

  it('constructs correct API URL', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([[[['test']]]]),
    });

    await translateWord('en', 'de', 'hello world');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('sl=en&tl=de&dt=t&q=hello%20world')
    );
  });
});
