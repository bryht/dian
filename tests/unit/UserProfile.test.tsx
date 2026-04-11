import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defaultMockUser, mockLogout } from './mocks/auth0';

const useAuth0Mock = vi.fn();

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => useAuth0Mock(),
}));

import UserProfile from '../../src/components/Auth/UserProfile';

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when not authenticated', () => {
    useAuth0Mock.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    const { container } = render(<UserProfile />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when authenticated but user is undefined', () => {
    useAuth0Mock.mockReturnValue({
      user: undefined,
      isAuthenticated: true,
    });

    const { container } = render(<UserProfile />);
    expect(container.innerHTML).toBe('');
  });

  it('renders user avatar image when user has a picture', () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
    });

    render(<UserProfile />);
    const img = screen.getByAltText('Test User');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', defaultMockUser.picture);
  });

  it('renders avatar placeholder when user has no picture', () => {
    useAuth0Mock.mockReturnValue({
      user: { ...defaultMockUser, picture: undefined },
      isAuthenticated: true,
    });

    render(<UserProfile />);
    const placeholder = screen.getByText('T');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('user-avatar-placeholder');
  });

  it('renders "U" placeholder when user has no name or picture', () => {
    useAuth0Mock.mockReturnValue({
      user: { email: 'test@example.com' },
      isAuthenticated: true,
    });

    render(<UserProfile />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('does not show dropdown by default', () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
    });

    render(<UserProfile />);
    expect(screen.queryByText(defaultMockUser.name!)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultMockUser.email!)).not.toBeInTheDocument();
  });

  it('shows dropdown with user info when avatar is clicked', async () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<UserProfile />);

    const avatar = screen.getByAltText('Test User');
    await user.click(avatar);

    expect(screen.getByText(defaultMockUser.name!)).toBeInTheDocument();
    expect(screen.getByText(defaultMockUser.email!)).toBeInTheDocument();
  });

  it('hides dropdown when avatar is clicked again', async () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<UserProfile />);

    const avatar = screen.getByAltText('Test User');
    await user.click(avatar);
    expect(screen.getByText(defaultMockUser.name!)).toBeInTheDocument();

    await user.click(avatar);
    expect(screen.queryByText(defaultMockUser.name!)).not.toBeInTheDocument();
  });

  it('shows logout button in the dropdown', async () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<UserProfile />);

    const avatar = screen.getByAltText('Test User');
    await user.click(avatar);

    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });
});
