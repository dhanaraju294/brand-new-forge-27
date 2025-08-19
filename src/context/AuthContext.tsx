import React, { createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  onAuthSuccess: (user: User) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  value: AuthContextType;
}> = ({ children, value }) => {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};