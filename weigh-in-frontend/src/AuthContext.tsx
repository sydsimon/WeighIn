import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userid: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  qualityControlPassed: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setQualityControlPassed: (passed: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  qualityControlPassed: false,
  login: () => {},
  logout: () => {},
  setQualityControlPassed: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [qualityControlPassed, setQualityControlPassed] = useState(() => {
    return localStorage.getItem('qualityControlPassed') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('qualityControlPassed');
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setQualityControlPassed(false);
    localStorage.removeItem('user');
    localStorage.removeItem('qualityControlPassed');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        qualityControlPassed,
        login, 
        logout,
        setQualityControlPassed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};