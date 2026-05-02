import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock services
const mockTranslateWord = vi.fn();
const mockGetCulture = vi.fn();
const mockLoadWordsAsync = vi.fn();

vi.mock('../../src/services', () => ({
  translateWord: (...args: any[]) => mockTranslateWord(...args),
  getCulture: (...args: any[]) => mockGetCulture(...args),
  loadWordsAsync: (...args: any[]) => mockLoadWordsAsync(...args),
}));

// Mock Electron
const mockIpcSend = vi.fn();
const mockIpcInvoke = vi.fn();
beforeEach(() => {
  (window as any).require = vi.fn(() => ({
    ipcRenderer: { send: mockIpcSend, invoke: mockIpcInvoke },
  }));
});
afterEach(() => {
  delete (window as any).require;
});

// Mock DictContext
const mockUseDict = vi.fn();
vi.mock('../../src/context', () => ({
  useDict: () => mockUseDict(),
}));

import Search from '../../src/features/search/Search';

const mockLanguages = [
  { code: 'en', name: 'English', native: 'English', isUsed: true, detailLink: 'https://dict.com/{word}' },
  { code: 'zh', name: 'Chinese', native: '中文', isUsed: true, detailLink: 'https://zh.dict.com/{word}' },
  { code: 'fr', name: 'French', native: 'Français', isUsed: true, detailLink: 'https://fr.dict.com/{word}' },
];

const mockSearchItems = [
  {
    words: [
      { culture: 'en', text: 'hello' },
      { culture: 'zh', text: '你好' },
      { culture: 'fr', text: 'bonjour' },
    ],
    data: Date.now(),
  },
];

describe('Search', () => {
  const mockUpdateSearchItems = vi.fn().mockResolvedValue(undefined);
  const mockSetInputLang = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTranslateWord.mockResolvedValue('translated');
    mockGetCulture.mockResolvedValue(null);
    mockLoadWordsAsync.mockResolvedValue([]);
    mockUseDict.mockReturnValue({
      searchItems: mockSearchItems,
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: vi.fn(),
      inputLang: 'en',
      setInputLang: mockSetInputLang,
    });
  });

  it('renders search input with language badge', () => {
    render(<Search submitFromSummon={null} onSummonConsumed={vi.fn()} />);
    expect(screen.getByPlaceholderText(/type a word/i)).toBeInTheDocument();
  });

  it('shows empty state when no word submitted', () => {
    render(<Search submitFromSummon={null} onSummonConsumed={vi.fn()} />);
    expect(screen.getByText(/welcome to dian/i)).toBeInTheDocument();
  });

  it('displays try word buttons in empty state', () => {
    render(<Search submitFromSummon={null} onSummonConsumed={vi.fn()} />);
    expect(screen.getByText('serendipity')).toBeInTheDocument();
    expect(screen.getByText('wander')).toBeInTheDocument();
  });

  it('shows language badge for current input language', () => {
    render(<Search submitFromSummon={null} onSummonConsumed={vi.fn()} />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });
});