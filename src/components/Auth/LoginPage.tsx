import React from 'react';
import LoginButton from './LoginButton';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome to Dian</h1>
          <p>Please log in to use the dictionary app</p>
        </div>
        <div className="login-content">
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
