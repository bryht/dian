import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// Mock react-modal
vi.mock('react-modal', () => {
  const MockModal = ({ isOpen, children, onRequestClose }: any) => {
    if (!isOpen) return null;
    return <div data-testid="word-modal">{children}</div>;
  };
  MockModal.setAppElement = vi.fn();
  return { default: MockModal };
});

// Mock CloseButton
vi.mock('../../src/components/CloseButton/CloseButton', () => ({
  default: ({ close }: any) => <button data-testid="close-btn" onClick={close}>X</button>,
}));

// Mock cheerio
vi.mock('cheerio', () => ({
  load: (html: string) => ({
    html: () => html,
  }),
}));

import WordHtml, { getWordUrl, getWordHtml } from '../../src/components/WordDisplay/WordHtml';
import type { IWordHtmlRef } from '../../src/components/WordDisplay/WordHtml';

describe('getWordUrl', () => {
  it('replaces {{word}} placeholder in template', () => {
    expect(getWordUrl('hello', 'https://dict.com/{{word}}')).toBe('https://dict.com/hello');
  });

  it('handles template without placeholder', () => {
    expect(getWordUrl('hello', 'https://dict.com/')).toBe('https://dict.com/');
  });

  it('handles special characters in word', () => {
    expect(getWordUrl('café', 'https://dict.com/{{word}}')).toBe('https://dict.com/café');
  });
});

describe('getWordHtml', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns HTML from URL', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('<html><body>Definition</body></html>'),
    });

    const result = await getWordHtml('https://dict.com/word');
    expect(result).toContain('Definition');
    (global.fetch as any).mockRestore?.();
  });

  it('returns empty string on fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await getWordHtml('https://dict.com/word');
    expect(result).toBe('');
    consoleSpy.mockRestore();
    (global.fetch as any).mockRestore?.();
  });
});

describe('WordHtml component', () => {
  it('returns null when url is empty', () => {
    const { container } = render(<WordHtml url="" hideTop={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('is closed by default even with a url', () => {
    render(<WordHtml url="https://dict.com/hello" hideTop={160} />);
    expect(screen.queryByTestId('word-modal')).not.toBeInTheDocument();
  });

  it('opens when open() is called via ref', () => {
    const ref = React.createRef<IWordHtmlRef>();
    render(<WordHtml ref={ref} url="https://dict.com/hello" hideTop={160} />);

    act(() => {
      ref.current!.open();
    });

    expect(screen.getByTestId('word-modal')).toBeInTheDocument();
  });

  it('closes when close() is called via ref', () => {
    const ref = React.createRef<IWordHtmlRef>();
    render(<WordHtml ref={ref} url="https://dict.com/hello" hideTop={160} />);

    act(() => {
      ref.current!.open();
    });
    expect(screen.getByTestId('word-modal')).toBeInTheDocument();

    act(() => {
      ref.current!.close();
    });
    expect(screen.queryByTestId('word-modal')).not.toBeInTheDocument();
  });

  it('renders close button when open', () => {
    const ref = React.createRef<IWordHtmlRef>();
    render(<WordHtml ref={ref} url="https://dict.com/hello" hideTop={160} />);

    act(() => {
      ref.current!.open();
    });

    expect(screen.getByTestId('close-btn')).toBeInTheDocument();
  });
});
