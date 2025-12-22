// Auth0 Configuration
// You need to create an Auth0 application and replace these values
// Visit: https://manage.auth0.com/

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
  redirectUri: window.location.origin,
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
};
