import React from 'react';
import LoginButton from './LoginButton';
import './LoginPage.scss';
import appIcon from '../../assets/icon.png';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">
            <img src={appIcon} alt="Dian" />
          </div>
          
          <div className="login-header">
            <h1>Dian</h1>
            <p className="tagline">Your Personal Dictionary Companion</p>
          </div>
          
          <div className="login-features">
            <div className="feature">
              <span className="feature-icon">🌍</span>
              <span>Multi-language support</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📚</span>
              <span>Save & organize words</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔊</span>
              <span>Audio pronunciation</span>
            </div>
          </div>
          
          <div className="login-content">
            <LoginButton />
            <p className="login-hint">Sign in to sync your vocabulary across devices</p>
          </div>
        </div>
        
        <p className="login-footer">
          Built with ❤️ for language learners
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
