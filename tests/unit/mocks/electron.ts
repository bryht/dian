import { vi } from 'vitest';

export const mockIpcRenderer = {
  invoke: vi.fn(),
  send: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
};

export const mockRemote = {
  app: {
    getPath: vi.fn().mockReturnValue('/mock/userData'),
  },
};

/**
 * Sets up window.require mock for Electron modules.
 * Call in beforeEach to reset mocks.
 */
export function setupElectronMock() {
  (window as any).require = vi.fn((module: string) => {
    if (module === 'electron') {
      return { ipcRenderer: mockIpcRenderer };
    }
    if (module === '@electron/remote') {
      return mockRemote;
    }
    if (module === 'electron-json-storage') {
      return mockStorage;
    }
    throw new Error(`Cannot find module '${module}'`);
  });
}

export const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
  setDataPath: vi.fn(),
};

export function cleanupElectronMock() {
  delete (window as any).require;
}
