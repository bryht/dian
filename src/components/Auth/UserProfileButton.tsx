import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserProfileButton.scss';

const UserProfileButton: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [showDetails, setShowDetails] = React.useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="user-profile-sidebar">
      <button 
        type="button" 
        className="btn btn-outline-secondary user-profile-btn"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="user-avatar-small">
          {user.picture ? (
            <img src={user.picture} alt={user.name || 'User'} />
          ) : (
            <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <span className="user-name-text">{user.name || 'User'}</span>
      </button>
      
      {showDetails && (
        <div className="user-details-panel">
          <div className="user-email">{user.email}</div>
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileButton;
