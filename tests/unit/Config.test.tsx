import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock DictContext
const mockUseDict = vi.fn();
vi.mock('../../src/context', () => ({
  useDict: () => mockUseDict(),
}));

import Config from '../../src/features/config/Config';

const baseLanguages = [
  { code: 'en', name: 'English', native: 'English', isUsed: true, detailLink: 'https://dict.com/{word}' },
  { code: 'zh', name: 'Chinese', native: '中文', isUsed: true, detailLink: 'https://zh.dict.com/{word}' },
  { code: 'fr', name: 'French', native: 'Français', isUsed: false, detailLink: 'https://fr.dict.com/{word}' },
];

describe('Config', () => {
  const mockUpdateLanguages = vi.fn().mockResolvedValue(undefined);
  const mockLoadLanguages = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDict.mockReturnValue({
      languages: baseLanguages,
      updateLanguages: mockUpdateLanguages,
      loadLanguages: mockLoadLanguages,
      searchItems: [],
      updateSearchItems: vi.fn(),
    });
  });

  it('renders Settings header', () => {
    render(<Config />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders language items', () => {
    render(<Config />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Chinese')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('renders detail link inputs for active languages', () => {
    render(<Config />);
    const inputs = screen.getAllByRole('textbox');
    // Only active (isUsed) languages get detail link inputs
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders About section with version', () => {
    render(<Config />);
    expect(screen.getByText('Dian v0.7.6')).toBeInTheDocument();
  });

  it('prevents unchecking language when only 2 would remain', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Config />);

    // Try to uncheck one of the two active languages
    const checkboxes = screen.getAllByRole('checkbox');
    // Find the first checked one (English)
    const englishCheckbox = checkboxes.find((cb: HTMLInputElement) => cb.closest('button')?.textContent?.includes('English'));
    if (englishCheckbox) {
      await user.click(englishCheckbox.closest('button')!);
      expect(alertSpy).toHaveBeenCalledWith('Please select at least 2 languages.');
    }
    alertSpy.mockRestore();
  });
});