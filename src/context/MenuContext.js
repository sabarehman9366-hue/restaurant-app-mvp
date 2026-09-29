// src/context/MenuContext.js  (supports Question 4 + Question 10)
// Single shared source of truth for menu items. MenuScreen reads from it;
// ManagerDashboard's "Menu Management" tab writes to it — so an edited
// price or toggled availability appears on the customer menu immediately,
// with no extra plumbing.

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MENU_ITEMS as SEED_MENU_ITEMS } from '../data/menu';

const MenuContext = createContext(undefined);
const MENU_STORAGE_KEY = '@restaurant_app/menu_overrides';

// Simulated network fetch, per Question 4 (1.5s resolve).
function fetchMenuFromNetwork() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(SEED_MENU_ITEMS), 1500);
  });
}

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetchMenuFromNetwork()
      .then(async (items) => {
        // Apply any persisted manager edits on top of the seed data.
        const raw = await AsyncStorage.getItem(MENU_STORAGE_KEY);
        if (raw) {
          const overrides = JSON.parse(raw);
          const merged = items.map((i) => ({ ...i, ...(overrides[i.id] || {}) }));
          setMenuItems([...merged, ...overrides.__added ?? []]);
        } else {
          setMenuItems(items);
        }
      })
      .catch(() => setError('Could not load the menu. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const persistOverrides = useCallback(async (nextItems) => {
    // Store only the diff-relevant fields keyed by id, plus any newly added items.
    const overrides = {};
    const added = [];
    nextItems.forEach((item) => {
      const seed = SEED_MENU_ITEMS.find((s) => s.id === item.id);
      if (!seed) {
        added.push(item);
      } else if (seed.price !== item.price || seed.isAvailable !== item.isAvailable) {
        overrides[item.id] = { price: item.price, isAvailable: item.isAvailable };
      }
    });
    overrides.__added = added;
    await AsyncStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(overrides));
  }, []);

  const updatePrice = useCallback((itemId, newPrice) => {
    setMenuItems((prev) => {
      const next = prev.map((i) => (i.id === itemId ? { ...i, price: newPrice } : i));
      persistOverrides(next);
      return next;
    });
  }, [persistOverrides]);

  const toggleAvailability = useCallback((itemId) => {
    setMenuItems((prev) => {
      const next = prev.map((i) => (i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i));
      persistOverrides(next);
      return next;
    });
  }, [persistOverrides]);

  const addItem = useCallback((newItem) => {
    setMenuItems((prev) => {
      const next = [...prev, newItem];
      persistOverrides(next);
      return next;
    });
  }, [persistOverrides]);

  const value = { menuItems, isLoading, error, reload: load, updatePrice, toggleAvailability, addItem };
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (ctx === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return ctx;
}
