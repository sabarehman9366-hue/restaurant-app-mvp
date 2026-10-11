// src/context/AuthContext.js  (Question 6)
// Shares the logged-in user across the whole app without prop drilling.

import React, { createContext, useState, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findUserByEmail, MOCK_USERS } from '../data/users';

const AuthContext = createContext(undefined);
const AUTH_STORAGE_KEY = '@restaurant_app/auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Load any previously persisted session on app start (Question 10).
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (isMounted && raw) setUser(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to restore session', e);
      } finally {
        if (isMounted) setIsRestoring(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const found = findUserByEmail(email);
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password.');
    }
    const { password: _omit, ...safeUser } = found;
    setUser(safeUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  }, []);

  const signup = useCallback(async ({ fullName, email, password, role }) => {
    if (findUserByEmail(email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `u${MOCK_USERS.length + 1}`,
      fullName,
      email,
      password,
      role,
    };
    MOCK_USERS.push(newUser); // in-memory only, resets on reload
    const { password: _omit, ...safeUser } = newUser;
    setUser(safeUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = { user, login, signup, logout, isRestoring };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
