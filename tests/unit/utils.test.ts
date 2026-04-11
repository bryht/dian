import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('storage', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    delete (window as any).require;
  });

  it('get returns default when window.require is not available', async () => {
    delete (window as any).require;
    const { get } = await import('../../src/utils/storage');
    const result = await get('key', 'default');
    expect(result).toBe('default');
  });

  it('set resolves when window.require is not available', async () => {
    delete (window as any).require;
    const { set } = await import('../../src/utils/storage');
    await expect(set('key', 'value')).resolves.toBeUndefined();
  });

  it('get returns default value when null is provided', async () => {
    delete (window as any).require;
    const { get } = await import('../../src/utils/storage');
    const result = await get('key', null);
    expect(result).toBeNull();
  });

  it('get retrieves data from electron-json-storage when initialized', async () => {
    const mockStorageGet = vi.fn((key: string, cb: Function) => {
      cb(null, { items: ['test'] });
    });
    const mockStorageSet = vi.fn();
    const mockSetDataPath = vi.fn();

    (window as any).require = vi.fn((module: string) => {
      if (module === 'electron-json-storage') {
        return { get: mockStorageGet, set: mockStorageSet, setDataPath: mockSetDataPath };
      }
      if (module === '@electron/remote') {
        return { app: { getPath: () => '/mock/path' } };
      }
    });

    const { get } = await import('../../src/utils/storage');
    const result = await get<{ items: string[] }>('testKey', null);
    expect(result).toEqual({ items: ['test'] });
    expect(mockStorageGet).toHaveBeenCalledWith('testKey', expect.any(Function));
  });

  it('get returns default when storage returns empty object', async () => {
    const mockStorageGet = vi.fn((key: string, cb: Function) => {
      cb(null, {});
    });
    const mockSetDataPath = vi.fn();

    (window as any).require = vi.fn((module: string) => {
      if (module === 'electron-json-storage') {
        return { get: mockStorageGet, set: vi.fn(), setDataPath: mockSetDataPath };
      }
      if (module === '@electron/remote') {
        return { app: { getPath: () => '/mock/path' } };
      }
    });

    const { get } = await import('../../src/utils/storage');
    const result = await get('testKey', 'default');
    expect(result).toBe('default');
  });

  it('get rejects on storage error', async () => {
    const mockStorageGet = vi.fn((key: string, cb: Function) => {
      cb(new Error('storage read error'), null);
    });
    const mockSetDataPath = vi.fn();

    (window as any).require = vi.fn((module: string) => {
      if (module === 'electron-json-storage') {
        return { get: mockStorageGet, set: vi.fn(), setDataPath: mockSetDataPath };
      }
      if (module === '@electron/remote') {
        return { app: { getPath: () => '/mock/path' } };
      }
    });

    const { get } = await import('../../src/utils/storage');
    await expect(get('testKey', null)).rejects.toThrow('storage read error');
  });

  it('set writes data to electron-json-storage', async () => {
    const mockStorageSet = vi.fn((key: string, value: any, cb: Function) => {
      cb(null);
    });
    const mockSetDataPath = vi.fn();

    (window as any).require = vi.fn((module: string) => {
      if (module === 'electron-json-storage') {
        return { get: vi.fn(), set: mockStorageSet, setDataPath: mockSetDataPath };
      }
      if (module === '@electron/remote') {
        return { app: { getPath: () => '/mock/path' } };
      }
    });

    const { set } = await import('../../src/utils/storage');
    await set('testKey', { data: 'value' });
    expect(mockStorageSet).toHaveBeenCalledWith('testKey', { data: 'value' }, expect.any(Function));
  });

  it('get returns default when window exists but require throws', async () => {
    (window as any).require = vi.fn(() => {
      throw new Error('Module not found');
    });

    const { get } = await import('../../src/utils/storage');
    const result = await get('key', 'fallback');
    expect(result).toBe('fallback');
  });

  it('get returns array data when storage contains an array', async () => {
    const mockStorageGet = vi.fn((key: string, cb: Function) => {
      cb(null, ['item1', 'item2']);
    });
    const mockSetDataPath = vi.fn();

    (window as any).require = vi.fn((module: string) => {
      if (module === 'electron-json-storage') {
        return { get: mockStorageGet, set: vi.fn(), setDataPath: mockSetDataPath };
      }
      if (module === '@electron/remote') {
        return { app: { getPath: () => '/mock/path' } };
      }
    });

    const { get } = await import('../../src/utils/storage');
    const result = await get<string[]>('testKey', []);
    expect(result).toEqual(['item1', 'item2']);
  });
});

describe('Consts', () => {
  it('has correct storage key names', async () => {
    const { default: Consts } = await import('../../src/utils/constants');
    expect(Consts.searchItems).toBe('searchItems');
    expect(Consts.languages).toBe('languages');
    expect(Consts.storage).toBe('storage');
    expect(Consts.defaultCulture).toBe('en-GB');
  });
});

describe('File utility', () => {
  afterEach(() => {
    delete (window as any).require;
  });

  it('File.openFile calls IPC show-save-dialog', async () => {
    const mockInvoke = vi.fn().mockResolvedValue('/path/to/file.csv');
    (window as any).require = vi.fn(() => ({
      ipcRenderer: { invoke: mockInvoke },
    }));

    const { File, Filter } = await import('../../src/utils/file');
    const result = await File.openFile('SaveWords', 'WordList', Filter.csv);

    expect(mockInvoke).toHaveBeenCalledWith('show-save-dialog', {
      title: 'SaveWords',
      defaultPath: 'WordList',
      filter: 'csv',
    });
    expect(result).toBe('/path/to/file.csv');
  });

  it('File.openFile returns false when dialog is cancelled', async () => {
    const mockInvoke = vi.fn().mockResolvedValue(undefined);
    (window as any).require = vi.fn(() => ({
      ipcRenderer: { invoke: mockInvoke },
    }));

    const { File, Filter } = await import('../../src/utils/file');
    const result = await File.openFile('Save', 'file', Filter.txt);
    expect(result).toBe(false);
  });
});

describe('Filter enum', () => {
  it('has correct values', async () => {
    const { Filter } = await import('../../src/utils/file');
    expect(Filter.pdf).toBe('pdf');
    expect(Filter.txt).toBe('txt');
    expect(Filter.csv).toBe('csv');
  });
});
