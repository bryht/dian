// Auth0 Configuration
// You need to create an Auth0 application and replace these values
// Visit: https://manage.auth0.com/

// Determine the redirect URI based on environment
const getRedirectUri = (): string => {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  if (isDevelopment) {
    // Development: use Vite dev server
    return window.location.origin;
  } else {
    // Production: use Electron app protocol
    return 'electron://app/callback';
  }
};

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
  redirectUri: getRedirectUri(),
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
};
