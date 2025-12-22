import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import './UserProfile.scss';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [showDropdown, setShowDropdown] = React.useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div 
        className="user-avatar"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.picture ? (
          <img src={user.picture} alt={user.name || 'User'} />
        ) : (
          <div className="user-avatar-placeholder">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>
      
      {showDropdown && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <div className="user-actions">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
