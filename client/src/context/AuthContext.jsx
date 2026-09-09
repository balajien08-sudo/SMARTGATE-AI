import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext.jsx';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('smartgate_token');
      const storedUser = localStorage.getItem('smartgate_user');
      
      if (token && storedUser) {
        try {
          const res = await authApi.getMe();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('smartgate_user', JSON.stringify(res.user));
          } else {
            setUser(null);
            localStorage.removeItem('smartgate_token');
            localStorage.removeItem('smartgate_user');
          }
        } catch (err) {
          setUser(null);
          localStorage.removeItem('smartgate_token');
          localStorage.removeItem('smartgate_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('smartgate_token', res.token);
        localStorage.setItem('smartgate_user', JSON.stringify(res.user));
        
        addToast({
          type: 'success',
          title: 'Login Successful',
          message: `Welcome back, ${res.user.name}`
        });
        return { success: true };
      } else {
        addToast({
          type: 'error',
          title: 'Authentication Failed',
          message: res.message || 'Invalid credentials'
        });
        return { success: false, message: res.message };
      }
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
      
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('smartgate_token', res.token);
        localStorage.setItem('smartgate_user', JSON.stringify(res.user));
        
        addToast({
          type: 'success',
          title: 'Account Created',
          message: `Welcome to SmartGate AI, ${res.user.name}!`
        });
        return { success: true };
      } else {
        addToast({
          type: 'error',
          title: 'Registration Error',
          message: res.message || 'Failed to create account'
        });
        return { success: false, message: res.message };
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Failed to create account'
      });
      return { success: false, message: err.message };
    }
  };

  const logout = async (showToast = true) => {
    setUser(null);
    localStorage.removeItem('smartgate_token');
    localStorage.removeItem('smartgate_user');
    
    if (showToast) {
      addToast({
        type: 'info',
        title: 'Session Ended',
        message: 'You have been successfully logged out.'
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
