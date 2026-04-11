import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock storage utilities
const mockGet = vi.fn();
const mockSet = vi.fn();

vi.mock('../../src/utils', () => ({
  get: (...args: any[]) => mockGet(...args),
  set: (...args: any[]) => mockSet(...args),
  Consts: {
    searchItems: 'searchItems',
    languages: 'languages',
    storage: 'storage',
    defaultCulture: 'en-GB',
  },
}));

import { DictProvider, useDict } from '../../src/context/DictContext';

// Test helper that exposes context values
function TestConsumer({ onRender }: { onRender: (ctx: ReturnType<typeof useDict>) => void }) {
  const ctx = useDict();
  onRender(ctx);
  return (
    <div>
      <span data-testid="setting-opened">{String(ctx.isSettingOpened)}</span>
      <span data-testid="items-count">{ctx.searchItems.length}</span>
      <span data-testid="languages-count">{ctx.languages.length}</span>
    </div>
  );
}

describe('DictContext', () => {
  let latestCtx: ReturnType<typeof useDict>;

  const renderWithProvider = () => {
    return render(
      <DictProvider>
        <TestConsumer onRender={(ctx) => { latestCtx = ctx; }} />
      </DictProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockResolvedValue([]);
    mockSet.mockResolvedValue(undefined);
  });

  it('provides default context values', () => {
    renderWithProvider();
    expect(screen.getByTestId('setting-opened')).toHaveTextContent('false');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  it('toggleSetting toggles isSettingOpened', async () => {
    renderWithProvider();
    expect(screen.getByTestId('setting-opened')).toHaveTextContent('false');

    await act(async () => {
      latestCtx.toggleSetting();
    });
    expect(screen.getByTestId('setting-opened')).toHaveTextContent('true');

    await act(async () => {
      latestCtx.toggleSetting();
    });
    expect(screen.getByTestId('setting-opened')).toHaveTextContent('false');
  });

  it('loadSearchItems loads items from storage', async () => {
    const items = [{ words: [{ culture: 'en', text: 'hello' }], data: 1 }];
    mockGet.mockResolvedValue(items);

    renderWithProvider();
    await act(async () => {
      await latestCtx.loadSearchItems();
    });

    expect(mockGet).toHaveBeenCalledWith('searchItems', []);
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
  });

  it('loadSearchItems sets empty array on null result', async () => {
    mockGet.mockResolvedValue(null);

    renderWithProvider();
    await act(async () => {
      await latestCtx.loadSearchItems();
    });

    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  it('loadSearchItems handles errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGet.mockRejectedValue(new Error('storage error'));

    renderWithProvider();
    await act(async () => {
      await latestCtx.loadSearchItems();
    });

    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    consoleSpy.mockRestore();
  });

  it('updateSearchItems saves to storage and updates state', async () => {
    const items = [{ words: [{ culture: 'en', text: 'world' }], data: 2 }];

    renderWithProvider();
    await act(async () => {
      await latestCtx.updateSearchItems(items);
    });

    expect(mockSet).toHaveBeenCalledWith('searchItems', items);
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
  });

  it('updateSearchItems handles errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSet.mockRejectedValue(new Error('write error'));

    renderWithProvider();
    await act(async () => {
      await latestCtx.updateSearchItems([]);
    });

    consoleSpy.mockRestore();
  });

  it('loadLanguages loads from storage', async () => {
    const langs = [
      { culture: 'en', cultureFull: 'en-GB', cultureName: 'English', isSelected: true, isUsed: true, detailLink: '', detailHideTop: 0, detailHideFilters: [] },
      { culture: 'nl', cultureFull: 'nl-NL', cultureName: 'Nederlands', isSelected: false, isUsed: true, detailLink: '', detailHideTop: 0, detailHideFilters: [] },
    ];
    mockGet.mockResolvedValue(langs);

    renderWithProvider();
    await act(async () => {
      await latestCtx.loadLanguages();
    });

    expect(mockGet).toHaveBeenCalledWith('languages', []);
    expect(screen.getByTestId('languages-count')).toHaveTextContent('2');
  });

  it('loadLanguages falls back to defaults when storage returns empty', async () => {
    mockGet.mockResolvedValue([]);

    renderWithProvider();
    await act(async () => {
      await latestCtx.loadLanguages();
    });

    // Should fall back to the default languages array (11 languages)
    expect(Number(screen.getByTestId('languages-count').textContent)).toBeGreaterThan(0);
  });

  it('loadLanguages handles errors and falls back to defaults', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGet.mockRejectedValue(new Error('read error'));

    renderWithProvider();
    await act(async () => {
      await latestCtx.loadLanguages();
    });

    expect(Number(screen.getByTestId('languages-count').textContent)).toBeGreaterThan(0);
    consoleSpy.mockRestore();
  });

  it('updateLanguages saves and updates state', async () => {
    const langs = [
      { culture: 'de', cultureFull: 'de-DE', cultureName: 'Deutsch', isSelected: true, isUsed: true, detailLink: '', detailHideTop: 0, detailHideFilters: [] },
    ];

    renderWithProvider();
    await act(async () => {
      await latestCtx.updateLanguages(langs);
    });

    expect(mockSet).toHaveBeenCalledWith('languages', langs);
    expect(screen.getByTestId('languages-count')).toHaveTextContent('1');
  });

  it('updateLanguages handles errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSet.mockRejectedValue(new Error('write error'));

    renderWithProvider();
    await act(async () => {
      await latestCtx.updateLanguages([]);
    });

    consoleSpy.mockRestore();
  });

  it('throws when useDict is used outside DictProvider', () => {
    const ThrowingComponent = () => {
      useDict();
      return null;
    };

    expect(() => render(<ThrowingComponent />)).toThrow(
      'useDict must be used within a DictProvider'
    );
  });
});
