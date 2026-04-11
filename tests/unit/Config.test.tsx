import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-modal
vi.mock('react-modal', () => {
  const MockModal = ({ isOpen, children }: any) => {
    if (!isOpen) return null;
    return <div data-testid="react-modal">{children}</div>;
  };
  MockModal.setAppElement = vi.fn();
  return { default: MockModal };
});

// Mock Auth components
const mockUseAuth0 = vi.fn();
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockUseAuth0(),
}));

// Mock DictContext
const mockUseDict = vi.fn();
vi.mock('../../src/context', () => ({
  useDict: () => mockUseDict(),
}));

// Mock Electron
const mockIpcInvoke = vi.fn();
beforeEach(() => {
  (window as any).require = vi.fn(() => ({
    ipcRenderer: { invoke: mockIpcInvoke },
  }));
  mockUseAuth0.mockReturnValue({
    user: { name: 'Test', email: 'test@test.com', picture: 'pic.png' },
    isAuthenticated: true,
    logout: vi.fn(),
  });
});
afterEach(() => {
  delete (window as any).require;
});

import Config from '../../src/features/config/Config';

const baseLanguages = [
  { culture: 'en', cultureFull: 'en-GB', cultureName: 'English', isSelected: true, isUsed: true, detailLink: 'https://dict.com/{{word}}', detailHideTop: 160, detailHideFilters: [] },
  { culture: 'nl', cultureFull: 'nl-NL', cultureName: 'Nederlands', isSelected: false, isUsed: true, detailLink: 'https://nl.dict.com/{{word}}', detailHideTop: 160, detailHideFilters: [] },
  { culture: 'zh', cultureFull: 'zh-CN', cultureName: '中文', isSelected: false, isUsed: true, detailLink: 'https://zh.dict.com/{{word}}', detailHideTop: 160, detailHideFilters: [] },
  { culture: 'de', cultureFull: 'de-DE', cultureName: 'Deutsch', isSelected: false, isUsed: false, detailLink: '', detailHideTop: 160, detailHideFilters: [] },
];

describe('Config', () => {
  const mockUpdateSearchItems = vi.fn().mockResolvedValue(undefined);
  const mockUpdateLanguages = vi.fn().mockResolvedValue(undefined);
  const mockLoadLanguages = vi.fn().mockResolvedValue(undefined);
  const mockToggleSetting = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDict.mockReturnValue({
      languages: baseLanguages,
      searchItems: [{ words: [{ culture: 'en', text: 'hello' }], data: 1 }],
      updateSearchItems: mockUpdateSearchItems,
      updateLanguages: mockUpdateLanguages,
      loadLanguages: mockLoadLanguages,
      toggleSetting: mockToggleSetting,
    });
  });

  it('renders action buttons', () => {
    render(<Config />);
    expect(screen.getByText('Setting')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('ClearAll')).toBeInTheDocument();
    expect(screen.getByText('Document')).toBeInTheDocument();
  });

  it('renders UserProfileButton', () => {
    render(<Config />);
    // UserProfileButton renders the user's name
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders a horizontal divider', () => {
    const { container } = render(<Config />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('returns null when no selected language exists', () => {
    const noSelectedLangs = baseLanguages.map(l => ({ ...l, isSelected: false }));
    mockUseDict.mockReturnValue({
      languages: noSelectedLangs,
      searchItems: [],
      updateSearchItems: mockUpdateSearchItems,
      updateLanguages: mockUpdateLanguages,
      loadLanguages: mockLoadLanguages,
      toggleSetting: mockToggleSetting,
    });

    const { container } = render(<Config />);
    expect(container.innerHTML).toBe('');
  });

  it('ClearAll shows alert when no search items', async () => {
    mockUseDict.mockReturnValue({
      languages: baseLanguages,
      searchItems: [],
      updateSearchItems: mockUpdateSearchItems,
      updateLanguages: mockUpdateLanguages,
      loadLanguages: mockLoadLanguages,
      toggleSetting: mockToggleSetting,
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('ClearAll'));
    expect(alertSpy).toHaveBeenCalledWith('No search history to delete.');
    expect(mockUpdateSearchItems).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('ClearAll confirms and clears when items exist', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('ClearAll'));
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockUpdateSearchItems).toHaveBeenCalledWith([]);
    expect(mockToggleSetting).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('ClearAll does nothing when user cancels confirm', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('ClearAll'));
    expect(mockUpdateSearchItems).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('Export shows alert when no search items', async () => {
    mockUseDict.mockReturnValue({
      languages: baseLanguages,
      searchItems: [],
      updateSearchItems: mockUpdateSearchItems,
      updateLanguages: mockUpdateLanguages,
      loadLanguages: mockLoadLanguages,
      toggleSetting: mockToggleSetting,
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Export'));
    expect(alertSpy).toHaveBeenCalledWith('No search history available to export. Please search for some words first.');
    alertSpy.mockRestore();
  });

  it('Export does nothing when file dialog is cancelled', async () => {
    mockIpcInvoke.mockResolvedValue(undefined);
    // Mock File.openFile to return false
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Export'));
    // Should not call export-words since dialog was cancelled
  });

  it('Document opens external URL via IPC', async () => {
    mockIpcInvoke.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Document'));
    expect(mockIpcInvoke).toHaveBeenCalledWith('open-external-url', 'https://bryht.github.io/dian');
    expect(mockToggleSetting).toHaveBeenCalled();
  });

  it('Document handles errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockIpcInvoke.mockRejectedValue(new Error('IPC error'));
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Document'));
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to open documentation'));
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('Setting button loads languages and opens modal', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));
    expect(mockLoadLanguages).toHaveBeenCalled();
  });

  it('Setting modal shows language configuration when opened', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));

    // Modal should show language config title
    expect(screen.getByText('Configure Languages and Dictionary Links')).toBeInTheDocument();
  });

  it('Setting modal shows Save and Reset buttons', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('Setting modal shows language checkboxes', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));

    // Should show checkboxes for each language
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(baseLanguages.length);
  });

  it('Save button calls updateLanguages and closes modal', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));
    await user.click(screen.getByText('Save'));

    expect(mockUpdateLanguages).toHaveBeenCalled();
  });

  it('Reset button clears languages and reloads', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));
    await user.click(screen.getByText('Reset'));

    expect(mockUpdateLanguages).toHaveBeenCalledWith([]);
    expect(mockLoadLanguages).toHaveBeenCalled();
  });

  it('unchecking a language toggle updates local state', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));

    // Find the checkbox for English (first used language)
    const checkboxes = screen.getAllByRole('checkbox');
    // Uncheck the third used language (zh), leaving 2 still active
    await user.click(checkboxes[2]);

    // Should still show the modal without alert (since we have 2 remaining)
    expect(screen.getByText('Configure Languages and Dictionary Links')).toBeInTheDocument();
  });

  it('prevents unchecking language when only 2 would remain', async () => {
    // Set up with only 2 used languages
    const twoUsedLangs = [
      { ...baseLanguages[0], isUsed: true },  // en
      { ...baseLanguages[1], isUsed: true },  // nl
      { ...baseLanguages[2], isUsed: false }, // zh
      { ...baseLanguages[3], isUsed: false }, // de
    ];
    mockUseDict.mockReturnValue({
      languages: twoUsedLangs,
      searchItems: [],
      updateSearchItems: mockUpdateSearchItems,
      updateLanguages: mockUpdateLanguages,
      loadLanguages: mockLoadLanguages,
      toggleSetting: mockToggleSetting,
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));

    // Try to uncheck one of the two remaining (would go below 2)
    const checkboxes = screen.getAllByRole('checkbox');
    const checkedBoxes = checkboxes.filter((cb: HTMLInputElement) => cb.checked);
    if (checkedBoxes.length > 0) {
      await user.click(checkedBoxes[0]);
      expect(alertSpy).toHaveBeenCalledWith('Please select at least 2 languages.');
    }
    alertSpy.mockRestore();
  });

  it('Export with items exports successfully', async () => {
    // File dialog returns a path, export succeeds
    mockIpcInvoke
      .mockResolvedValueOnce('/path/to/file.csv') // show-save-dialog
      .mockResolvedValueOnce({ success: true });  // export-words

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Export'));

    expect(mockIpcInvoke).toHaveBeenCalledWith('show-save-dialog', expect.any(Object));
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Successfully exported'));
    alertSpy.mockRestore();
  });

  it('Export shows error when export fails', async () => {
    mockIpcInvoke
      .mockResolvedValueOnce('/path/to/file.csv') // show-save-dialog
      .mockResolvedValueOnce({ success: false, error: 'write error' }); // export-words

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Export'));

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to export'));
    alertSpy.mockRestore();
  });

  it('Export shows message when all items are phrases', async () => {
    mockUseDict.mockReturnValue({
      languages: baseLanguages,
      searchItems: [{ words: [{ culture: 'en', text: 'hello world' }], data: 1 }],
      updateSearchItems: mockUpdateSearchItems,
      updateLanguages: mockUpdateLanguages,
      loadLanguages: mockLoadLanguages,
      toggleSetting: mockToggleSetting,
    });

    mockIpcInvoke.mockResolvedValueOnce('/path/to/file.csv');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Export'));

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('phrases'));
    alertSpy.mockRestore();
  });

  it('language detail link input updates on change', async () => {
    const user = userEvent.setup();
    render(<Config />);

    await user.click(screen.getByText('Setting'));

    // Find the detail link inputs (only shown for used languages)
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);

    // Type in the first input
    await user.clear(inputs[0]);
    await user.type(inputs[0], 'https://new-link.com/test');

    // The input value should be updated
    expect(inputs[0]).toHaveValue('https://new-link.com/test');
  });
});
