# Restaurant App MVP (Frontend Only) — React Native

A frontend-only React Native prototype for browsing a restaurant menu,
booking a table, placing an order, and tracking it live — with a
role-restricted Manager Dashboard. No backend, no external API, no
third-party state-management library (only React's own hooks + Context).

## Installation

**Requirements:** Node.js 18 LTS or newer, npm 9+, and the Expo Go app
(iOS/Android) or an emulator.

```bash
git clone https://github.com/<your-username>/restaurant-app-mvp.git
cd restaurant-app-mvp
npm install
npx expo start
```

- Scan the QR code with **Expo Go** on a physical phone, **or**
- press `a` for an Android emulator / `i` for an iOS simulator (macOS only) in the terminal that `expo start` opens.

## Demo login credentials

| Role     | Email               | Password   |
|----------|---------------------|------------|
| Customer | customer@demo.com   | Pass1234   |
| Manager  | manager@demo.com    | Manage123  |

## Hooks used, by screen

| Screen / File                  | Hooks used                                                   |
|---------------------------------|---------------------------------------------------------------|
| LoginScreen.js                  | useState, useForm (custom)                                    |
| MenuScreen.js                   | useState, useEffect, useRef, useMemo, useCallback, useDebounce (custom) |
| MenuItemCard.js                 | React.memo                                                     |
| ProfileScreen.js                | useContext (Auth, Theme)                                       |
| CartScreen.js                   | useContext, useReducer (via CartContext)                       |
| OrderSummaryScreen.js           | useMemo, useState                                               |
| ReservationScreen.js            | useReservation (custom, wraps useState/useMemo/useCallback)     |
| OrderTrackingScreen.js          | useEffect (setInterval/setTimeout), useMemo                     |
| ManagerDashboardScreen.js       | useState, useContext (Orders, Menu)                             |
| AuthContext / ThemeContext / CartContext / OrdersContext / MenuContext | createContext, useReducer, useEffect, useMemo, useCallback |

## Why Context instead of prop drilling (Question 6)

Auth and theme data are needed by almost every screen in the tree —
Login, every tab, the dashboard — so passing them down as props would
mean threading `user` and `colors` through components that don't
otherwise care about them, several levels deep. Context lets any
component subscribe directly with `useAuth()`/`useTheme()` regardless of
nesting depth, which keeps intermediate components clean. The trade-off:
**every consumer of a context re-renders whenever that context's value
changes** — toggling dark mode re-renders every themed screen at once,
even ones the user isn't currently looking at, so it isn't free.

## useReducer vs useState for the cart (Question 7)

The cart has several fields (items, promo code, discount) that change
together and in dependent ways — removing the last unit of an item must
also remove it from the array, applying a promo must validate against a
lookup table, and so on. `useReducer` centralises those transitions in
one pure function, so every possible mutation is documented, testable,
and impossible to perform incorrectly from a component. `useState` would
have been enough if the cart only ever held a flat, independent value
(e.g. just a boolean "is cart open" flag) — for a handful of loosely
related pieces of state with no shared transition logic, separate
`useState` calls are simpler and avoid the reducer's ceremony.

## Cart reducer test cases

| # | Action | Initial state (relevant fields) | Expected state |
|---|--------|----------------------------------|-----------------|
| 1 | `ADD_ITEM` (new item) | `items: []` | `items: [{ id, quantity: 1 }]` |
| 2 | `ADD_ITEM` (existing item) | `items: [{ id: 'm1', quantity: 1 }]` | `items: [{ id: 'm1', quantity: 2 }]` |
| 3 | `DECREMENT` (quantity 1 → 0) | `items: [{ id: 'm1', quantity: 1 }]` | `items: []` (item removed) |
| 4 | `REMOVE_ITEM` | `items: [{ id: 'm1' }, { id: 'm2' }]` | `items: [{ id: 'm2' }]` |
| 5 | `APPLY_PROMO` ("WELCOME10") | `discountPercent: 0` | `discountPercent: 10, promoCode: 'WELCOME10'` |
| 6 | `APPLY_PROMO` ("BADCODE") | `promoError: null` | `promoError: 'Invalid promo code.'`, state otherwise unchanged |
| 7 | `CLEAR_CART` | any non-empty state | reset to `initialCartState` |

*(Jest tests for `cartReducer.js` are a good next step for bonus marks — not included in this MVP submission.)*

## What happens if the Question 4 filtering effect's dependency array is left empty

If `useEffect(() => { setFilteredItems(...) }, [])` had an empty array,
the filter would run exactly once, right after `menuItems` first loads
(or even before, if it ran before the fetch resolved) — and never again.
Selecting a different category chip would update `selectedCategory`'s
state correctly, but the effect wouldn't re-fire, so `filteredItems`
would stay frozen at its very first computed value. The UI would look
broken: category chips would highlight as selected, but the list below
would never actually change. This is exactly why Question 8 replaces the
effect+state pair with a single `useMemo` — its dependency array is
checked on every render, so it can never go stale the way a
forgotten/incomplete effect dependency array can.

## Why a ref doesn't trigger a re-render but state does

`useState`'s setter schedules a re-render because React needs to
reconcile the new value into the UI — that's the whole point of state.
`useRef` returns a plain mutable object (`{ current: ... }`) that React
keeps around between renders but never inspects; mutating `.current` is
just a normal object mutation, invisible to React's reconciler. That's
exactly why refs are used for the render counter, the debounce timer id,
and the "previous search" tracker in Question 5 — those values need to
persist and be readable across renders, but changing them should never,
by itself, cause the component to re-render.

## Notes on `useMemo` / `useCallback` (Question 8)

They should **not** be used for cheap computations (a single arithmetic
expression, a short string concatenation) — the memoisation bookkeeping
itself (storing the previous deps, comparing them) can cost more than
just recomputing the value, and it adds a layer of indirection that
makes the code harder to read for no measurable benefit. `useCallback`
is only worth it when the function is passed to a memoised child
(`React.memo`) or listed in another hook's dependency array — wrapping
every handler "just in case" bloats the component without preventing
any actual re-render, since without a memoised consumer downstream the
new/old function reference makes no difference at all.

## Project structure

```
src/
  components/   MenuItemCard.js
  screens/      LoginScreen, MenuScreen, ProfileScreen, CartScreen,
                OrderSummaryScreen, ReservationScreen,
                OrderTrackingScreen, ManagerDashboardScreen
  context/      AuthContext, ThemeContext, CartContext, MenuContext, OrdersContext
  reducers/     cartReducer.js, ordersReducer.js
  hooks/        useForm.js, useDebounce.js, useReservation.js
  data/         users.js, menu.js, tables.js, promoCodes.js
  navigation/   AppNavigator.js
```

## Demo video

_Link to a ≤3 minute screen recording of the full flow (signup → browse
→ search → cart → promo → reserve → order → track → manager updates
the same order) goes here once recorded: `<add your link>`._

## Screenshots

_Add screenshots here as required by each question's deliverable list
(validation errors, successful login, render counter, memo console
output, disabled time slot, etc.)._
