import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defaultMockUser, mockLogout } from './mocks/auth0';

const useAuth0Mock = vi.fn();

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => useAuth0Mock(),
}));

import UserProfileButton from '../../src/components/Auth/UserProfileButton';

describe('UserProfileButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when not authenticated', () => {
    useAuth0Mock.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
    });

    const { container } = render(<UserProfileButton />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when authenticated but user is undefined', () => {
    useAuth0Mock.mockReturnValue({
      user: undefined,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const { container } = render(<UserProfileButton />);
    expect(container.innerHTML).toBe('');
  });

  it('renders a button with user name when authenticated', () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(<UserProfileButton />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('renders avatar image when user has a picture', () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(<UserProfileButton />);
    const img = screen.getByAltText('Test User');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', defaultMockUser.picture);
  });

  it('renders initial letter when user has no picture', () => {
    useAuth0Mock.mockReturnValue({
      user: { ...defaultMockUser, picture: undefined },
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(<UserProfileButton />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders "U" when user has no name and no picture', () => {
    useAuth0Mock.mockReturnValue({
      user: { email: 'test@example.com' },
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(<UserProfileButton />);
    // The button text and avatar fallback
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('does not show details panel by default', () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(<UserProfileButton />);
    expect(screen.queryByText(defaultMockUser.email!)).not.toBeInTheDocument();
  });

  it('shows details panel with email when button is clicked', async () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<UserProfileButton />);

    const profileBtn = screen.getByRole('button', { name: /test user/i });
    await user.click(profileBtn);

    expect(screen.getByText(defaultMockUser.email!)).toBeInTheDocument();
  });

  it('shows logout button in details panel', async () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<UserProfileButton />);

    const profileBtn = screen.getByRole('button', { name: /test user/i });
    await user.click(profileBtn);

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', async () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<UserProfileButton />);

    const profileBtn = screen.getByRole('button', { name: /test user/i });
    await user.click(profileBtn);

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });

  it('hides details panel when button is clicked again', async () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<UserProfileButton />);

    const profileBtn = screen.getByRole('button', { name: /test user/i });
    await user.click(profileBtn);
    expect(screen.getByText(defaultMockUser.email!)).toBeInTheDocument();

    await user.click(profileBtn);
    expect(screen.queryByText(defaultMockUser.email!)).not.toBeInTheDocument();
  });

  it('falls back to initial letter when image fails to load', () => {
    useAuth0Mock.mockReturnValue({
      user: defaultMockUser,
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(<UserProfileButton />);
    const img = screen.getByAltText('Test User');

    // Simulate image load error
    fireEvent.error(img);

    // After error, should show the initial letter instead
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.queryByAltText('Test User')).not.toBeInTheDocument();
  });
});
