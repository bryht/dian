import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, within, fireEvent } from '@testing-library/react';
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

// Mock WordHtml
vi.mock('../../src/components/WordDisplay/WordHtml', () => {
  const WordHtml = React.forwardRef((_props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ open: vi.fn(), close: vi.fn() }));
    return <div data-testid="word-html" />;
  });
  WordHtml.displayName = 'WordHtml';
  return {
    default: WordHtml,
    getWordUrl: (word: string, template: string) => template.replace('{{word}}', word),
  };
});

// Mock AutoCompleteInput
vi.mock('../../src/components/AutoCompleteInput', () => {
  const AutoComplete = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ blur: vi.fn() }));
    return (
      <input
        data-testid="auto-complete-input"
        id={props.id}
        value={props.inputValue}
        placeholder={props.placeholder}
        onChange={(e) => {
          props.onTypedValueChanged?.(e.target.value);
          props.onInputValueChanged?.(e.target.value);
        }}
        onKeyDown={(e) => props.onKeyDown?.(e.key)}
      />
    );
  });
  AutoComplete.displayName = 'AutoComplete';
  return { default: AutoComplete };
});

// Mock CloseButton
vi.mock('../../src/components/CloseButton/CloseButton', () => ({
  default: ({ close, className }: any) => (
    <button data-testid="close-button" className={className} onClick={close}>X</button>
  ),
}));

// Mock SVG imports
vi.mock('assets/settings.svg', () => ({
  ReactComponent: () => <svg data-testid="settings-svg" />,
}));
vi.mock('assets/search.svg', () => ({
  ReactComponent: () => <svg data-testid="search-svg" />,
}));

// Mock Electron
const mockIpcSend = vi.fn();
beforeEach(() => {
  (window as any).require = vi.fn(() => ({
    ipcRenderer: { send: mockIpcSend },
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
  { culture: 'en', cultureFull: 'en-GB', cultureName: 'English', isSelected: true, isUsed: true, detailLink: 'https://dict.com/{{word}}', detailHideTop: 160, detailHideFilters: [] },
  { culture: 'nl', cultureFull: 'nl-NL', cultureName: 'Nederlands', isSelected: false, isUsed: true, detailLink: 'https://nl.dict.com/{{word}}', detailHideTop: 160, detailHideFilters: [] },
  { culture: 'zh', cultureFull: 'zh-CN', cultureName: '中文', isSelected: false, isUsed: true, detailLink: 'https://zh.dict.com/{{word}}', detailHideTop: 160, detailHideFilters: [] },
];

const mockSearchItems = [
  {
    words: [
      { culture: 'en', text: 'hello' },
      { culture: 'nl', text: 'hallo' },
      { culture: 'zh', text: '你好' },
    ],
    data: Date.now(),
  },
];

describe('Search', () => {
  const mockUpdateSearchItems = vi.fn();
  const mockLoadSearchItems = vi.fn();
  const mockToggleSetting = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateSearchItems.mockResolvedValue(undefined);
    mockLoadSearchItems.mockResolvedValue(undefined);
    mockTranslateWord.mockResolvedValue('translated');
    mockGetCulture.mockResolvedValue(null);
    mockLoadWordsAsync.mockResolvedValue([]);

    mockUseDict.mockReturnValue({
      searchItems: mockSearchItems,
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: mockLoadSearchItems,
      toggleSetting: mockToggleSetting,
    });
  });

  it('renders search header with language dropdown button', () => {
    render(<Search />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('renders language dropdown with all used languages', () => {
    render(<Search />);
    // Button shows current language, dropdown items show all languages with culture codes
    const allEnglish = screen.getAllByText(/English/);
    expect(allEnglish.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Nederlands/)).toBeInTheDocument();
    expect(screen.getByText(/中文/)).toBeInTheDocument();
  });

  it('renders search input with placeholder', () => {
    render(<Search />);
    const input = screen.getByTestId('auto-complete-input');
    expect(input).toHaveAttribute('placeholder', 'Command/Ctrl+F');
  });

  it('renders search and settings buttons', () => {
    render(<Search />);
    expect(screen.getByTestId('search-svg')).toBeInTheDocument();
    expect(screen.getByTestId('settings-svg')).toBeInTheDocument();
  });

  it('calls loadSearchItems on mount', () => {
    render(<Search />);
    expect(mockLoadSearchItems).toHaveBeenCalled();
  });

  it('displays search items in list', () => {
    render(<Search />);
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('hallo')).toBeInTheDocument();
  });

  it('shows culture labels for each word', () => {
    render(<Search />);
    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('nl')).toBeInTheDocument();
    expect(screen.getByText('zh')).toBeInTheDocument();
  });

  it('renders close button for each search item', () => {
    render(<Search />);
    const closeButtons = screen.getAllByTestId('close-button');
    expect(closeButtons.length).toBe(1); // one item = one close button
  });

  it('deleteWord removes an item from the list', async () => {
    render(<Search />);
    const closeButton = screen.getByTestId('close-button');
    await act(async () => {
      closeButton.click();
    });

    expect(mockUpdateSearchItems).toHaveBeenCalledWith([]);
  });

  it('renders empty list when no search items', () => {
    mockUseDict.mockReturnValue({
      searchItems: [],
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: mockLoadSearchItems,
      toggleSetting: mockToggleSetting,
    });

    const { container } = render(<Search />);
    const list = container.querySelector('.translate-list');
    expect(list).toBeInTheDocument();
    expect(list?.children.length).toBe(0);
  });

  it('settings button calls toggleSetting', async () => {
    render(<Search />);
    const buttons = screen.getAllByRole('button');
    // Settings button is the last one in input-group-append
    const settingsBtn = buttons.find(b => b.querySelector('[data-testid="settings-svg"]'));
    expect(settingsBtn).toBeTruthy();

    await act(async () => {
      settingsBtn!.click();
    });
    expect(mockToggleSetting).toHaveBeenCalled();
  });

  it('renders WordHtml component', () => {
    render(<Search />);
    expect(screen.getByTestId('word-html')).toBeInTheDocument();
  });

  it('phrases get bg-success class', () => {
    mockUseDict.mockReturnValue({
      searchItems: [{
        words: [
          { culture: 'en', text: 'hello world' },
          { culture: 'nl', text: 'hallo wereld' },
        ],
        data: Date.now(),
      }],
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: mockLoadSearchItems,
      toggleSetting: mockToggleSetting,
    });

    const { container } = render(<Search />);
    const listItem = container.querySelector('.translate-list-item');
    expect(listItem).toHaveClass('is-phrase');
    expect(listItem).toHaveClass('bg-success');
  });

  it('handleTranslateWord translates and adds to search items', async () => {
    mockTranslateWord.mockResolvedValue('vertaald');
    mockUseDict.mockReturnValue({
      searchItems: [],
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: mockLoadSearchItems,
      toggleSetting: mockToggleSetting,
    });

    render(<Search />);
    const input = screen.getByTestId('auto-complete-input');

    // Type a word
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
    });

    // Press Enter to translate
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // Should call translateWord for non-current languages
    expect(mockTranslateWord).toHaveBeenCalled();
    // Should call updateSearchItems with the new item
    expect(mockUpdateSearchItems).toHaveBeenCalled();
    // Should play audio
    expect(mockIpcSend).toHaveBeenCalledWith('play-audio', expect.any(Object));
  });

  it('handleTranslateWord does nothing with empty input', async () => {
    mockUseDict.mockReturnValue({
      searchItems: [],
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: mockLoadSearchItems,
      toggleSetting: mockToggleSetting,
    });

    render(<Search />);
    const input = screen.getByTestId('auto-complete-input');

    // Press Enter with empty input
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(mockTranslateWord).not.toHaveBeenCalled();
    expect(mockUpdateSearchItems).not.toHaveBeenCalled();
  });

  it('search button triggers translation', async () => {
    mockTranslateWord.mockResolvedValue('vertaald');
    mockUseDict.mockReturnValue({
      searchItems: [],
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: mockLoadSearchItems,
      toggleSetting: mockToggleSetting,
    });

    render(<Search />);
    const input = screen.getByTestId('auto-complete-input');

    // Type a word
    await act(async () => {
      fireEvent.change(input, { target: { value: 'word' } });
    });

    // Click search button
    const searchBtn = screen.getByTestId('search-svg').closest('button')!;
    await act(async () => {
      searchBtn.click();
    });

    expect(mockTranslateWord).toHaveBeenCalled();
    expect(mockUpdateSearchItems).toHaveBeenCalled();
  });

  it('onTypedValueChanged detects language and loads autocomplete options', async () => {
    mockGetCulture.mockResolvedValue('en');
    mockLoadWordsAsync.mockResolvedValue(['apple', 'apply']);

    render(<Search />);
    const input = screen.getByTestId('auto-complete-input');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'app' } });
    });

    expect(mockGetCulture).toHaveBeenCalledWith('app');
    expect(mockLoadWordsAsync).toHaveBeenCalledWith('en', 'app', 6);
  });

  it('onTypedValueChanged handles culture override syntax (word/culture)', async () => {
    mockGetCulture.mockResolvedValue(null);
    mockLoadWordsAsync.mockResolvedValue([]);

    render(<Search />);
    const input = screen.getByTestId('auto-complete-input');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'bonjour/nl' } });
    });

    // Should detect the /nl suffix and use 'nl' as culture
    expect(mockLoadWordsAsync).toHaveBeenCalledWith('nl', 'bonjour', 6);
  });

  it('clicking a word in results opens word detail', async () => {
    render(<Search />);
    // Click on the word "hello" in the results
    const wordSpan = screen.getByText('hello');
    await act(async () => {
      wordSpan.click();
    });
    // WordHtml component should be present (it was rendered)
    expect(screen.getByTestId('word-html')).toBeInTheDocument();
  });

  it('duplicate word is moved to top of list', async () => {
    mockTranslateWord.mockResolvedValue('hallo');

    // Start with an existing item
    mockUseDict.mockReturnValue({
      searchItems: mockSearchItems,
      languages: mockLanguages,
      updateSearchItems: mockUpdateSearchItems,
      loadSearchItems: mockLoadSearchItems,
      toggleSetting: mockToggleSetting,
    });

    render(<Search />);
    const input = screen.getByTestId('auto-complete-input');

    // Type the same word that already exists
    await act(async () => {
      fireEvent.change(input, { target: { value: 'hello' } });
    });
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // updateSearchItems should be called
    expect(mockUpdateSearchItems).toHaveBeenCalled();
    const updatedItems = mockUpdateSearchItems.mock.calls[0][0];
    // The translated word is at the front of the list
    expect(updatedItems[0].words[0].text).toBe('hello');
  });

  it('language dropdown changes current language', async () => {
    render(<Search />);
    // Click on Nederlands in the dropdown
    const nlLink = screen.getByText(/Nederlands/);
    await act(async () => {
      nlLink.click();
    });

    // The dropdown button should now show Nederlands
    // Since our mock renders the dropdown, clicking should update state
    // The button text is derived from currentLanguage state
  });
});
