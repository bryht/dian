import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// Mock Mousetrap
const mockBind = vi.fn();
const mockUnbind = vi.fn();
vi.mock('mousetrap', () => ({
  default: { bind: (...args: any[]) => mockBind(...args), unbind: (...args: any[]) => mockUnbind(...args) },
}));

// Mock child components
vi.mock('../../src/features/search/Search', () => ({
  default: () => <div data-testid="search">Search</div>,
}));
vi.mock('../../src/features/config/Config', () => ({
  default: () => <div data-testid="config">Config</div>,
}));

// Mock DictContext
const mockUseDict = vi.fn();
vi.mock('../../src/context', () => ({
  DictProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useDict: () => mockUseDict(),
}));

// Mock Electron
const mockIpcOn = vi.fn();
const mockIpcInvoke = vi.fn();
const mockIpcRemoveListener = vi.fn();

beforeEach(() => {
  (window as any).require = vi.fn(() => ({
    ipcRenderer: {
      on: mockIpcOn,
      invoke: mockIpcInvoke,
      removeListener: mockIpcRemoveListener,
    },
  }));
  // Set __APP_VERSION__ global
  (globalThis as any).__APP_VERSION__ = '1.0.0';
});

afterEach(() => {
  delete (window as any).require;
  delete (globalThis as any).__APP_VERSION__;
});

import HomePage from '../../src/features/home/HomePage';

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDict.mockReturnValue({
      isSettingOpened: false,
    });
  });

  it('renders Search and Config components', () => {
    render(<HomePage />);
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('config')).toBeInTheDocument();
  });

  it('renders the version badge', () => {
    render(<HomePage />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('wrapper does not have toggled class when settings closed', () => {
    mockUseDict.mockReturnValue({ isSettingOpened: false });
    const { container } = render(<HomePage />);
    expect(container.querySelector('.wrapper')).not.toHaveClass('toggled');
  });

  it('wrapper has toggled class when settings open', () => {
    mockUseDict.mockReturnValue({ isSettingOpened: true });
    const { container } = render(<HomePage />);
    expect(container.querySelector('.wrapper')).toHaveClass('toggled');
  });

  it('registers keyboard shortcuts on mount', () => {
    render(<HomePage />);
    expect(mockBind).toHaveBeenCalledWith('esc', expect.any(Function));
    expect(mockBind).toHaveBeenCalledWith(['command+f', 'ctrl+f'], expect.any(Function));
    expect(mockBind).toHaveBeenCalledWith('J', expect.any(Function));
    expect(mockBind).toHaveBeenCalledWith('K', expect.any(Function));
  });

  it('listens for input-message IPC event on mount', () => {
    render(<HomePage />);
    expect(mockIpcOn).toHaveBeenCalledWith('input-message', expect.any(Function));
  });

  it('cleans up keyboard shortcuts and IPC on unmount', () => {
    const { unmount } = render(<HomePage />);
    unmount();

    expect(mockUnbind).toHaveBeenCalledWith(['esc', 'command+f', 'ctrl+f', 'J', 'K']);
    expect(mockIpcRemoveListener).toHaveBeenCalledWith('input-message', expect.any(Function));
  });

  it('J shortcut scrolls down', () => {
    render(<HomePage />);
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const jCallback = mockBind.mock.calls.find((c: any[]) => c[0] === 'J')![1];
    jCallback();
    expect(scrollSpy).toHaveBeenCalledWith(window.scrollX, window.scrollY + 20);
    scrollSpy.mockRestore();
  });

  it('K shortcut scrolls up', () => {
    render(<HomePage />);
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const kCallback = mockBind.mock.calls.find((c: any[]) => c[0] === 'K')![1];
    kCallback();
    expect(scrollSpy).toHaveBeenCalledWith(window.scrollX, window.scrollY - 20);
    scrollSpy.mockRestore();
  });

  it('Esc shortcut calls minimize when no webview present', () => {
    render(<HomePage />);
    const escCallback = mockBind.mock.calls.find((c: any[]) => c[0] === 'esc')![1];
    escCallback();
    expect(mockIpcInvoke).toHaveBeenCalledWith('minimize-window');
  });

  it('Esc shortcut does NOT minimize when webview is present', () => {
    // Add a webview element
    const webview = document.createElement('div');
    webview.id = 'webview';
    document.body.appendChild(webview);

    render(<HomePage />);
    const escCallback = mockBind.mock.calls.find((c: any[]) => c[0] === 'esc')![1];
    escCallback();
    expect(mockIpcInvoke).not.toHaveBeenCalled();

    document.body.removeChild(webview);
  });

  it('renders sidebar element', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('#sidebar')).toBeInTheDocument();
    expect(container.querySelector('.sidebar')).toBeInTheDocument();
  });

  it('Cmd+F shortcut focuses and clears the word input', () => {
    // Create a mock input element
    const input = document.createElement('input');
    input.id = 'word';
    input.value = 'existing text';
    document.body.appendChild(input);

    render(<HomePage />);
    const cmdFCallback = mockBind.mock.calls.find((c: any[]) => JSON.stringify(c[0]) === JSON.stringify(['command+f', 'ctrl+f']))![1];
    cmdFCallback();

    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('');

    document.body.removeChild(input);
  });

  it('input-message "focus" event focuses and clears the word input', () => {
    // Create a mock input element
    const input = document.createElement('input');
    input.id = 'word';
    input.value = 'some text';
    document.body.appendChild(input);

    render(<HomePage />);

    // Get the handler from the IPC mock
    const handler = mockIpcOn.mock.calls.find((c: any[]) => c[0] === 'input-message')![1];
    handler({}, 'focus');

    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('');

    document.body.removeChild(input);
  });

  it('input-message with non-focus message does not affect input', () => {
    const input = document.createElement('input');
    input.id = 'word';
    input.value = 'untouched';
    document.body.appendChild(input);

    render(<HomePage />);
    const handler = mockIpcOn.mock.calls.find((c: any[]) => c[0] === 'input-message')![1];
    handler({}, 'other-message');

    expect(input.value).toBe('untouched');

    document.body.removeChild(input);
  });
});
