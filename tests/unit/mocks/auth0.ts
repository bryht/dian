import { vi } from 'vitest';

export interface MockAuth0User {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

export const defaultMockUser: MockAuth0User = {
  name: 'Test User',
  email: 'test@example.com',
  picture: 'https://example.com/avatar.png',
  sub: 'auth0|123456',
};

export const mockLoginWithRedirect = vi.fn();
export const mockLogout = vi.fn();

export function mockUseAuth0(overrides: {
  isAuthenticated?: boolean;
  isLoading?: boolean;
  user?: MockAuth0User | null;
} = {}) {
  const {
    isAuthenticated = false,
    isLoading = false,
    user = null,
  } = overrides;

  return {
    isAuthenticated,
    isLoading,
    user: isAuthenticated && user !== null ? (user ?? defaultMockUser) : (user ?? undefined),
    loginWithRedirect: mockLoginWithRedirect,
    logout: mockLogout,
    getAccessTokenSilently: vi.fn(),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithPopup: vi.fn(),
    handleRedirectCallback: vi.fn(),
  };
}

/**
 * Sets up the Auth0 mock for vi.mock('@auth0/auth0-react').
 * Call this in your test file's vi.mock callback.
 */
export function createAuth0Mock(overrides: Parameters<typeof mockUseAuth0>[0] = {}) {
  return {
    useAuth0: () => mockUseAuth0(overrides),
    Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
  };
}
