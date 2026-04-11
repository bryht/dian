import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLogout } from './mocks/auth0';

const useAuth0Mock = vi.fn();

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => useAuth0Mock(),
}));

import LogoutButton from '../../src/components/Auth/LogoutButton';

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth0Mock.mockReturnValue({
      logout: mockLogout,
    });
  });

  it('renders a "Log Out" button', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /log out/i });
    expect(button).toBeInTheDocument();
  });

  it('has the correct CSS classes', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /log out/i });
    expect(button).toHaveClass('btn', 'btn-outline-secondary', 'btn-sm');
  });

  it('calls logout with returnTo when clicked', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /log out/i });

    await user.click(button);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });
});
