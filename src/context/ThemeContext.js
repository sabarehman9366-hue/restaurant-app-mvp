// src/context/ThemeContext.js  (Question 6)
// Exposes the active palette (light/dark) and a toggler to the whole tree.

import React, { createContext, useState, useCallback, useContext, useMemo } from 'react';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  // useMemo so consumers only re-render when isDark actually flips,
  // not on every ThemeProvider re-render.
  const value = useMemo(
    () => ({ isDark, toggleTheme, colors: isDark ? darkTheme : lightTheme }),
    [isDark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
