import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockLoginWithRedirect } from './mocks/auth0';

const useAuth0Mock = vi.fn();

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => useAuth0Mock(),
}));

// Mock the image import
vi.mock('../../src/assets/icon.png', () => ({
  default: 'mock-icon.png',
}));

import LoginPage from '../../src/components/Auth/LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth0Mock.mockReturnValue({
      loginWithRedirect: mockLoginWithRedirect,
    });
  });

  it('renders the login page container', () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('.login-page')).toBeInTheDocument();
  });

  it('displays the app name "Dian"', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dian');
  });

  it('displays the tagline', () => {
    render(<LoginPage />);
    expect(screen.getByText('Your Personal Dictionary Companion')).toBeInTheDocument();
  });

  it('displays the app icon', () => {
    render(<LoginPage />);
    const img = screen.getByAltText('Dian');
    expect(img).toBeInTheDocument();
  });

  it('renders the three feature highlights', () => {
    render(<LoginPage />);
    expect(screen.getByText('Multi-language support')).toBeInTheDocument();
    expect(screen.getByText('Save & organize words')).toBeInTheDocument();
    expect(screen.getByText('Audio pronunciation')).toBeInTheDocument();
  });

  it('renders the login button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('displays the sign-in hint text', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in to sync your vocabulary across devices')).toBeInTheDocument();
  });

  it('displays the footer text', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Built with/)).toBeInTheDocument();
    expect(screen.getByText(/language learners/)).toBeInTheDocument();
  });

  it('renders background gradient orbs', () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('.orb-1')).toBeInTheDocument();
    expect(container.querySelector('.orb-2')).toBeInTheDocument();
    expect(container.querySelector('.orb-3')).toBeInTheDocument();
  });

  it('renders the login card', () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('.login-card')).toBeInTheDocument();
  });
});
