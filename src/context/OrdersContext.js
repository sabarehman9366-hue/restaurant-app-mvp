// src/context/OrdersContext.js  (Question 10)
// Holds all placed orders app-wide and persists them to AsyncStorage so
// the Manager Dashboard and the customer's Order Tracking screen share
// one source of truth, and data survives an app restart.

import React, { createContext, useReducer, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ordersReducer, initialOrdersState } from '../reducers/ordersReducer';

const OrdersContext = createContext(undefined);
const ORDERS_STORAGE_KEY = '@restaurant_app/orders';

export function OrdersProvider({ children }) {
  const [state, dispatch] = useReducer(ordersReducer, initialOrdersState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted orders once on mount.
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        if (isMounted && raw) {
          dispatch({ type: 'HYDRATE', payload: { orders: JSON.parse(raw) } });
        }
      } catch (e) {
        console.warn('Failed to load orders', e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Persist on every change, after the initial load completes.
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(state.orders)).catch((e) =>
      console.warn('Failed to persist orders', e)
    );
  }, [state.orders, isLoaded]);

  const value = useMemo(() => ({ state, dispatch, isLoaded }), [state, isLoaded]);
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (ctx === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return ctx;
}
