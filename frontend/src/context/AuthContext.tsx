import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  availableUsers: User[];
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Sarah Jenkins (Donor) for immediate demonstration
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('sharekind_active_user_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_USERS[0];
  });

  const [isDemoMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('sharekind_active_user_v1', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    // Find representative user for this role
    const rep = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(rep);
  };

  const switchUser = (userId: string) => {
    const match = INITIAL_USERS.find(u => u.id === userId);
    if (match) setCurrentUser(match);
  };

  const loginAsDemo = (role: UserRole) => {
    switchRole(role);
  };

  const logout = () => {
    // Reset to donor
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchRole,
        switchUser,
        availableUsers: INITIAL_USERS,
        loginAsDemo,
        logout,
        isDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
