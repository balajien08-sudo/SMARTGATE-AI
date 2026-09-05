import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Restore session from localStorage if available
    const savedUser = localStorage.getItem('smartgate_user');
    const savedToken = localStorage.getItem('smartgate_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify with backend silently
        authApi.getMe()
          .then(res => {
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('smartgate_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {
            // Token might be expired
            logout(false);
          });
      } catch (e) {
        logout(false);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('smartgate_token', res.token);
        localStorage.setItem('smartgate_user', JSON.stringify(res.user));
        setUser(res.user);
        addToast({
          type: 'success',
          title: 'Login Successful',
          message: `Welcome back, ${res.user.name} (${res.user.role})`
        });
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message || 'Invalid credentials'
      });
      return { success: false, message: err.message };
    }
  };

  const loginDemo = async () => {
    return login('balajien08@gmail.com', '3329');
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res.success && res.token) {
        localStorage.setItem('smartgate_token', res.token);
        localStorage.setItem('smartgate_user', JSON.stringify(res.user));
        setUser(res.user);
        addToast({
          type: 'success',
          title: 'Account Created',
          message: `Welcome to SmartGate AI, ${res.user.name}!`
        });
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Failed to create account'
      });
      return { success: false, message: err.message };
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('smartgate_token');
    localStorage.removeItem('smartgate_user');
    setUser(null);
    if (showToast) {
      addToast({
        type: 'info',
        title: 'Session Ended',
        message: 'You have been safely logged out.'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, loginDemo, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
