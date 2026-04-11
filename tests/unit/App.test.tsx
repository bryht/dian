import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const useAuth0Mock = vi.fn();

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => useAuth0Mock(),
  Auth0Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock child pages so we can detect which renders
vi.mock('../../src/components/Auth', () => ({
  LoginPage: () => <div data-testid="login-page">LoginPage</div>,
}));

vi.mock('../../src/features/home', () => ({
  HomePage: () => <div data-testid="home-page">HomePage</div>,
}));

import App from '../../src/App';

describe('App (auth routing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while Auth0 is initializing', () => {
    useAuth0Mock.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders LoginPage when user is not authenticated', () => {
    useAuth0Mock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
  });

  it('renders HomePage when user is authenticated', () => {
    useAuth0Mock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('does not show loading text when not loading', () => {
    useAuth0Mock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<App />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('loading state has centered layout styles', () => {
    useAuth0Mock.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(<App />);
    const loadingDiv = screen.getByText('Loading...').closest('div');
    expect(loadingDiv).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    });
  });
});
