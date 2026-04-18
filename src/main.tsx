import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';
import Modal from 'react-modal';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config';
import App from './App';

Modal.setAppElement('#root');

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

