import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock child pages
vi.mock('../../src/features/home', () => ({
  HomePage: () => <div data-testid="home-page">HomePage</div>,
}));

import App from '../../src/App';

describe('App', () => {
  it('renders HomePage directly (no auth)', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});