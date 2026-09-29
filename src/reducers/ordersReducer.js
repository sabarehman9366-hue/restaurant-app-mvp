// src/reducers/ordersReducer.js  (Question 10)
// Pure reducer managing the list of placed orders and their statuses.

export const initialOrdersState = { orders: [] };

let orderCounter = 1000;

export function ordersReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { orders: action.payload.orders };

    case 'PLACE_ORDER': {
      const { items, total, orderType, table, pickupTime } = action.payload;
      const newOrder = {
        id: `ord-${orderCounter++}`,
        items,
        total,
        type: orderType, // 'dine-in' | 'takeaway'
        table: table ?? null,
        pickupTime: pickupTime ?? null,
        status: 'Pending',
        createdAt: Date.now(),
      };
      return { orders: [newOrder, ...state.orders] };
    }

    case 'UPDATE_STATUS':
      return {
        orders: state.orders.map((o) =>
          o.id === action.payload.orderId
            ? { ...o, status: action.payload.status }
            : o
        ),
      };

    default:
      return state;
  }
}
