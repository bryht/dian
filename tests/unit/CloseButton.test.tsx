import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock SVG import
vi.mock('assets/close.svg', () => ({
  ReactComponent: () => <svg data-testid="close-svg" />,
}));

import CloseButton from '../../src/components/CloseButton/CloseButton';

describe('CloseButton', () => {
  it('renders the close SVG icon', () => {
    render(<CloseButton close={() => {}} />);
    expect(screen.getByTestId('close-svg')).toBeInTheDocument();
  });

  it('calls close callback when clicked', async () => {
    const closeFn = vi.fn();
    const user = userEvent.setup();
    render(<CloseButton close={closeFn} />);

    const button = screen.getByTestId('close-svg').closest('.dict-close-button')!;
    await user.click(button);
    expect(closeFn).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<CloseButton close={() => {}} className="custom" />);
    expect(container.querySelector('.dict-close-button')).toHaveClass('custom');
  });

  it('has base dict-close-button class', () => {
    const { container } = render(<CloseButton close={() => {}} />);
    expect(container.querySelector('.dict-close-button')).toBeInTheDocument();
  });
});
