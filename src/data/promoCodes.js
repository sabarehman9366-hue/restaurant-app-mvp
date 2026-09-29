// src/data/promoCodes.js
// Mock promo code table consulted by cartReducer's APPLY_PROMO action.

export const PROMO_CODES = {
  WELCOME10: 10,
  FEAST20: 20,
  STUDENT5: 5,
};

export function getPromoDiscount(code) {
  return PROMO_CODES[String(code).toUpperCase()] ?? null;
}
