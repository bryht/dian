import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

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
      <span data-testid="items-count">{ctx.searchItems.length}</span>
      <span data-testid="languages-count">{ctx.languages.length}</span>
      <span data-testid="active-view">{ctx.activeView}</span>
      <span data-testid="input-lang">{ctx.inputLang}</span>
      <span data-testid="is-dark">{String(ctx.isDark)}</span>
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
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('active-view')).toHaveTextContent('translate');
    expect(screen.getByTestId('input-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
  });

  it('setActiveView changes the active view', async () => {
    renderWithProvider();
    await act(async () => {
      latestCtx.setActiveView('settings');
    });
    expect(screen.getByTestId('active-view')).toHaveTextContent('settings');
  });

  it('toggleDark toggles isDark', async () => {
    renderWithProvider();
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');

    await act(async () => {
      latestCtx.toggleDark();
    });
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');

    await act(async () => {
      latestCtx.toggleDark();
    });
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
  });

  it('setInputLang changes the input language', async () => {
    renderWithProvider();
    await act(async () => {
      latestCtx.setInputLang('zh');
    });
    expect(screen.getByTestId('input-lang')).toHaveTextContent('zh');
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

  it('loadLanguages loads from storage', async () => {
    const langs = [
      { code: 'en', name: 'English', native: 'English', isUsed: true, detailLink: '' },
      { code: 'zh', name: 'Chinese', native: '中文', isUsed: true, detailLink: '' },
    ];
    mockGet.mockResolvedValue(langs);

    renderWithProvider();
    await act(async () => {
      await latestCtx.loadLanguages();
    });

    expect(screen.getByTestId('languages-count')).toHaveTextContent('2');
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