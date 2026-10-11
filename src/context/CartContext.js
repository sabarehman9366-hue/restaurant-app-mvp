// src/context/CartContext.js  (Question 7)
// Wraps useReducer and exposes { state, dispatch } plus a useCart() hook.

import React, { createContext, useReducer, useContext, useMemo } from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
