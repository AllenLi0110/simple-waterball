"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  username: string;
  gender?: string;
  nickname?: string;
  occupation?: string;
  birthday?: string;
  location?: string;
  githubLink?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userId: number, userData: Partial<User>) => Promise<void>;
  refreshUser: (userId: number) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Verify token from cookie on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Token is valid, user is authenticated
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
          } else {
            // Not authenticated (normal when user is not logged in)
            localStorage.removeItem('user');
          }
        } else {
          // Network or server error - clear localStorage
          localStorage.removeItem('user');
        }
      } catch (e) {
        // Network error - silently fallback to localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (parseError) {
            // Silent fail - invalid localStorage data
            localStorage.removeItem('user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [API_URL]);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    const userData = data.data.user;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (name: string, username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ name, username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    const userData = data.data.user;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
    } catch (e) {
      console.error('Logout API call failed:', e);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateUser = async (userId: number, userData: Partial<User>) => {
    console.log(`Updating user ${userId} with data:`, userData);
    console.log(`API URL: ${API_URL}/api/users/${userId}`);
    
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify(userData),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok || !data.success) {
      const errorMessage = data.message || `Update failed: ${response.status} ${response.statusText}`;
      console.error('Update failed:', errorMessage);
      throw new Error(errorMessage);
    }

    const updatedUser = data.data;
    console.log('Updated user:', updatedUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUser = async (userId: number) => {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      credentials: 'include', // Include cookies
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    const userData = data.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
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
