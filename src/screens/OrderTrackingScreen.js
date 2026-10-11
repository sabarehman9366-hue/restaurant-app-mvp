// src/screens/OrderTrackingScreen.js  (Question 10)
// Advances the most recent order's status automatically using
// setInterval inside useEffect, with a cleanup that clears every timer.

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOrders } from '../context/OrdersContext';
import { useTheme } from '../context/ThemeContext';

const STEPS = ['Pending', 'Preparing', 'Ready', 'Served'];
const TIMINGS_MS = { Preparing: 10000, Ready: 20000, Served: 30000 }; // demo timings

export default function OrderTrackingScreen() {
  const { state, dispatch } = useOrders();
  const { colors } = useTheme();
  const [elapsedSec, setElapsedSec] = useState(0);
  const styles = getStyles(colors);

  const activeOrder = state.orders[0]; // most recently placed

  // Auto-advance status: Pending -> Preparing -> Ready -> Served.
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'Served' || activeOrder.status === 'Cancelled') return;

    const timers = [];
    Object.entries(TIMINGS_MS).forEach(([status, delay]) => {
      // Only schedule steps still ahead of the current status.
      if (STEPS.indexOf(status) > STEPS.indexOf(activeOrder.status)) {
        timers.push(
          setTimeout(() => {
            dispatch({ type: 'UPDATE_STATUS', payload: { orderId: activeOrder.id, status } });
          }, delay)
        );
      }
    });

    return () => timers.forEach(clearTimeout); // cleanup on unmount / order change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrder?.id]);

  // Elapsed-time counter, ticking every second.
  useEffect(() => {
    if (!activeOrder) return;
    const interval = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - activeOrder.createdAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  const stepIndex = useMemo(
    () => (activeOrder ? STEPS.indexOf(activeOrder.status) : -1),
    [activeOrder]
  );

  if (!activeOrder) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.subtext }}>No active order to track.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.orderId}>Order #{activeOrder.id}</Text>
      <Text style={styles.elapsed}>{elapsedSec}s elapsed</Text>

      <View style={styles.progressRow}>
        {STEPS.map((step, idx) => (
          <View key={step} style={styles.stepWrap}>
            <View style={[styles.dot, idx <= stepIndex && { backgroundColor: colors.primary }]} />
            <Text style={[styles.stepLabel, idx <= stepIndex && { color: colors.primary, fontWeight: '700' }]}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.itemsCard}>
        {activeOrder.items.map((i) => (
          <Text key={i.menuItemId} style={styles.itemLine}>{i.quantity}× {i.name}</Text>
        ))}
        <Text style={styles.total}>Total: Rs {activeOrder.total.toFixed(0)}</Text>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    orderId: { fontSize: 18, fontWeight: '700', color: colors.text },
    elapsed: { color: colors.subtext, marginBottom: 24 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    stepWrap: { alignItems: 'center', flex: 1 },
    dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.border, marginBottom: 6 },
    stepLabel: { fontSize: 11, color: colors.subtext },
    itemsCard: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 14 },
    itemLine: { color: colors.text, marginBottom: 4 },
    total: { color: colors.text, fontWeight: '700', marginTop: 8 },
  });
