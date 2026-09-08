import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext.jsx';
import { 
  supabase, 
  signInWithSupabase, 
  signUpWithSupabase, 
  signOutWithSupabase 
} from '../services/supabaseClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Map Supabase user format to our app format
        const appUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0],
          email: session.user.email,
          role: session.user.user_metadata?.role || 'Administrator'
        };
        setUser(appUser);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0],
          email: session.user.email,
          role: session.user.user_metadata?.role || 'Administrator'
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await signInWithSupabase(email, password);
      
      const appUser = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        email: data.user.email,
        role: data.user.user_metadata?.role || 'Administrator'
      };
      
      setUser(appUser);
      addToast({
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${appUser.name}`
      });
      return { success: true };
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
      const data = await signUpWithSupabase(email, password, { name, role });
      
      const appUser = {
        id: data.user.id,
        name: data.user.user_metadata?.name || name,
        email: data.user.email,
        role: data.user.user_metadata?.role || role
      };
      
      setUser(appUser);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to SmartGate AI, ${appUser.name}!`
      });
      return { success: true };
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
    try {
      await signOutWithSupabase();
      setUser(null);
      if (showToast) {
        addToast({
          type: 'info',
          title: 'Session Ended',
          message: 'You have been safely logged out from Supabase.'
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
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
