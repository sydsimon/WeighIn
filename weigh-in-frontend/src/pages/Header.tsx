import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Menu } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface HeaderProps {
  showProfileButton?: boolean;
  showHomeButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showProfileButton = true, 
  showHomeButton = true 
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-green-200 dark:bg-green-900 shadow-sm">
      <div className="flex items-center space-x-4">
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        <span 
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
          onClick={() => navigate('/')}
        >
          WeighIN
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {showHomeButton && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg
                         hover:bg-green-300 dark:hover:bg-green-800
                         transition-colors"
              >
                <Home className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                <span className="text-gray-700 dark:text-gray-200">Home</span>
              </button>
            )}
            {showProfileButton && (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg
                         hover:bg-green-300 dark:hover:bg-green-800
                         transition-colors"
              >
                <User className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                <span className="text-gray-700 dark:text-gray-200">{user.username}</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 
                         text-white rounded-md transition-colors"
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate("/login")} 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                       text-white rounded-md transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate("/create-account")} 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 
                       text-white rounded-md transition-colors"
            >
              Join Now
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;