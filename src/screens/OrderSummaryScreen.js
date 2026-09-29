// src/screens/OrderSummaryScreen.js  (Question 8)
// Totals computed with useMemo, depending only on cart items + discount,
// so the maths never re-runs on unrelated re-renders.

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useTheme } from '../context/ThemeContext';
import { RATES } from '../theme';

export default function OrderSummaryScreen({ navigation }) {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { dispatch: ordersDispatch } = useOrders();
  const { colors } = useTheme();
  const [orderType, setOrderType] = useState('dine-in'); // useState (Q10 requirement)
  const styles = getStyles(colors);

  const totals = useMemo(() => {
    const subtotal = cartState.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discount = (subtotal * cartState.discountPercent) / 100;
    const afterDiscount = subtotal - discount;
    const serviceCharge = (afterDiscount * RATES.SERVICE_CHARGE_PCT) / 100;
    const tax = (afterDiscount * RATES.SALES_TAX_PCT) / 100;
    const grandTotal = afterDiscount + serviceCharge + tax;
    return { subtotal, discount, serviceCharge, tax, grandTotal };
  }, [cartState.items, cartState.discountPercent]);

  const placeOrder = () => {
    ordersDispatch({
      type: 'PLACE_ORDER',
      payload: {
        items: cartState.items,
        total: totals.grandTotal,
        orderType,
        table: orderType === 'dine-in' ? 'Table 3' : null,
        pickupTime: orderType === 'takeaway' ? '15 mins' : null,
      },
    });
    cartDispatch({ type: 'CLEAR_CART' });
    navigation.navigate('OrderTracking');
  };

  const Row = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>Rs {value.toFixed(0)}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.typeRow}>
        {['dine-in', 'takeaway'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeChip, orderType === t && styles.typeChipActive]}
            onPress={() => setOrderType(t)}
          >
            <Text style={{ color: orderType === t ? '#fff' : colors.text, textTransform: 'capitalize' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Row label="Subtotal" value={totals.subtotal} />
      {cartState.discountPercent > 0 && <Row label={`Promo discount (${cartState.discountPercent}%)`} value={-totals.discount} />}
      <Row label={`Service charge (${RATES.SERVICE_CHARGE_PCT}%)`} value={totals.serviceCharge} />
      <Row label={`Sales tax (${RATES.SALES_TAX_PCT}%)`} value={totals.tax} />
      <View style={styles.divider} />
      <Row label="Grand Total" value={totals.grandTotal} />

      <TouchableOpacity style={styles.placeBtn} onPress={placeOrder} disabled={cartState.items.length === 0}>
        <Text style={styles.placeBtnText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 16 },
    typeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    typeChip: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
    typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    rowLabel: { color: colors.subtext }, rowValue: { color: colors.text, fontWeight: '600' },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
    placeBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
    placeBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  });
