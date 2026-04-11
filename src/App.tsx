import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { HomePage } from './features/home';
import { LoginPage } from './components/Auth';

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

export default App;
