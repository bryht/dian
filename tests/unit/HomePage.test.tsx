import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock child components
vi.mock('../../src/features/search/Search', () => ({
  default: () => <div data-testid="search">Search</div>,
}));
vi.mock('../../src/features/history/HistoryView', () => ({
  default: () => <div data-testid="history">History</div>,
}));
vi.mock('../../src/features/export/ExportView', () => ({
  default: () => <div data-testid="export">Export</div>,
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
const mockIpcRemoveListener = vi.fn();

beforeEach(() => {
  (window as any).require = vi.fn(() => ({
    ipcRenderer: {
      on: mockIpcOn,
      removeListener: mockIpcRemoveListener,
    },
  }));
});

afterEach(() => {
  delete (window as any).require;
});

import HomePage from '../../src/features/home/HomePage';

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDict.mockReturnValue({
      activeView: 'translate',
      setActiveView: vi.fn(),
      searchItems: [],
      languages: [],
      inputLang: 'en',
      setInputLang: vi.fn(),
      isDark: false,
      toggleDark: vi.fn(),
      updateSearchItems: vi.fn(),
      updateLanguages: vi.fn(),
      loadSearchItems: vi.fn(),
      loadLanguages: vi.fn(),
    });
  });

  it('renders the translate view by default', () => {
    render(<HomePage />);
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  it('renders history view when active', () => {
    mockUseDict.mockReturnValue({
      ...mockUseDict(),
      activeView: 'history',
    });
    render(<HomePage />);
    expect(screen.getByTestId('history')).toBeInTheDocument();
  });

  it('renders export view when active', () => {
    mockUseDict.mockReturnValue({
      ...mockUseDict(),
      activeView: 'export',
    });
    render(<HomePage />);
    expect(screen.getByTestId('export')).toBeInTheDocument();
  });

  it('renders settings view when active', () => {
    mockUseDict.mockReturnValue({
      ...mockUseDict(),
      activeView: 'settings',
    });
    render(<HomePage />);
    expect(screen.getByTestId('config')).toBeInTheDocument();
  });
});