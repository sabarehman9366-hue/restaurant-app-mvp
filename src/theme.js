// src/theme.js
// Single source of truth for light/dark palettes. Every screen reads its
// colours from useTheme() (see ThemeContext) so the toggle in Question 6
// updates the whole app instantly, with no per-screen state.

export const lightTheme = {
  mode: 'light',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  primary: '#D9534F',
  text: '#1C1C1E',
  subtext: '#6B6B70',
  border: '#E4E4E7',
  success: '#2E7D32',
  warning: '#B8860B',
  danger: '#C0392B',
  disabled: '#BDBDBD',
};

export const darkTheme = {
  mode: 'dark',
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#FF6B61',
  text: '#F2F2F2',
  subtext: '#A0A0A5',
  border: '#333333',
  success: '#66BB6A',
  warning: '#FFC107',
  danger: '#EF5350',
  disabled: '#555555',
};

export const RATES = {
  SERVICE_CHARGE_PCT: 5,
  SALES_TAX_PCT: 15,
};
