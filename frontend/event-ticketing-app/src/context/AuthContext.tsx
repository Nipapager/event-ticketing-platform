import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface JWTPayload {
  userId: number;
  name: string;
  sub: string; // email
  roles: string[];
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user & token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        // Decode token to get fresh data including roles
        const decoded = jwtDecode<JWTPayload>(storedToken);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired, logout
          logout();
          return;
        }

        const userData = {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.sub,
          roles: decoded.roles || []
        };

        setToken(storedToken);
        setUser(userData as User);
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout();
      }
    }
  }, []);

  // Login function
  const login = (newToken: string, newUser: User) => {
    try {
      // Decode token to extract roles
      const decoded = jwtDecode<JWTPayload>(newToken);
      
      // Merge user data with roles from token
      const userData = {
        ...newUser,
        roles: decoded.roles || []
      };

      console.log('🔍 Login - Decoded Token:', decoded);
      console.log('👤 Login - User Data:', userData);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData as User);
    } catch (error) {
      console.error('Failed to decode token on login:', error);
      // Fallback to provided user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};