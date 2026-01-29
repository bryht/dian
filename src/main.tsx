import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { HomePage } from './features/home';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';
import Modal from 'react-modal';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config';
import { LoginPage } from './components/Auth';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <HomePage /> : <LoginPage />;
};

// Wait longer for Electron to fully initialize before rendering
setTimeout(() => {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={{
          redirect_uri: auth0Config.redirectUri
        }}
        cacheLocation={auth0Config.cacheLocation}
        useRefreshTokens={auth0Config.useRefreshTokens}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
}, 300);

