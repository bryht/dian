import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLoginWithRedirect } from './mocks/auth0';

const useAuth0Mock = vi.fn();

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => useAuth0Mock(),
}));

import LoginButton from '../../src/components/Auth/LoginButton';

describe('LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth0Mock.mockReturnValue({
      loginWithRedirect: mockLoginWithRedirect,
    });
  });

  it('renders a "Log In" button', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /log in/i });
    expect(button).toBeInTheDocument();
  });

  it('has the correct CSS classes', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /log in/i });
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-md');
  });

  it('calls loginWithRedirect when clicked', async () => {
    const user = userEvent.setup();
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /log in/i });

    await user.click(button);

    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('calls loginWithRedirect each time the button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: /log in/i });

    await user.click(button);
    await user.click(button);

    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(2);
  });
});
