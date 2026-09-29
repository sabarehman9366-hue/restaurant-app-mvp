// src/reducers/cartReducer.js  (Question 7)
// Pure reducer — never mutates the previous state, always returns a new
// object/array so React can detect the change.

import { getPromoDiscount } from '../data/promoCodes';

export const initialCartState = {
  items: [],       // { menuItemId, name, price, quantity, note }
  promoCode: null,
  discountPercent: 0,
  promoError: null,
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem } = action.payload;
      const existing = state.items.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            note: '',
          },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.menuItemId !== action.payload.menuItemId),
      };

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItemId === action.payload.menuItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case 'DECREMENT': {
      const nextItems = state.items
        .map((i) =>
          i.menuItemId === action.payload.menuItemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0); // removes the item at zero
      return { ...state, items: nextItems };
    }

    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItemId === action.payload.menuItemId
            ? { ...i, note: action.payload.note }
            : i
        ),
      };

    case 'APPLY_PROMO': {
      const discount = getPromoDiscount(action.payload.code);
      if (discount == null) {
        return { ...state, promoError: 'Invalid promo code.' };
      }
      return {
        ...state,
        promoCode: action.payload.code.toUpperCase(),
        discountPercent: discount,
        promoError: null,
      };
    }

    case 'REMOVE_PROMO':
      return { ...state, promoCode: null, discountPercent: 0, promoError: null };

    case 'CLEAR_CART':
      return { ...initialCartState };

    default:
      return state;
  }
}
