// src/screens/CartScreen.js  (Question 7)
// Reads/dispatches through useCart(); a quantity stepper, remove button,
// per-item note field, and promo code entry.

import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen({ navigation }) {
  const { state, dispatch } = useCart();
  const { colors } = useTheme();
  const [promoInput, setPromoInput] = useState('');
  const styles = getStyles(colors);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const applyPromo = () => {
    if (!promoInput.trim()) return;
    dispatch({ type: 'APPLY_PROMO', payload: { code: promoInput.trim() } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={state.items}
        keyExtractor={(i) => i.menuItemId}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: colors.subtext }}>Your cart is empty.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Rs {item.price} each</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Special instructions (e.g. no onions)"
                placeholderTextColor={colors.subtext}
                value={item.note}
                onChangeText={(t) => dispatch({ type: 'UPDATE_NOTE', payload: { menuItemId: item.menuItemId, note: t } })}
              />
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => dispatch({ type: 'DECREMENT', payload: { menuItemId: item.menuItemId } })}>
                <Text style={styles.stepBtn}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => dispatch({ type: 'INCREMENT', payload: { menuItemId: item.menuItemId } })}>
                <Text style={styles.stepBtn}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => dispatch({ type: 'REMOVE_ITEM', payload: { menuItemId: item.menuItemId } })}>
              <Text style={styles.removeBtn}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {state.items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Promo code"
              placeholderTextColor={colors.subtext}
              autoCapitalize="characters"
              value={promoInput}
              onChangeText={setPromoInput}
            />
            <TouchableOpacity style={styles.promoBtn} onPress={applyPromo}>
              <Text style={{ color: '#fff' }}>Apply</Text>
            </TouchableOpacity>
          </View>
          {state.promoError && <Text style={styles.error}>{state.promoError}</Text>}
          {state.promoCode && (
            <View style={styles.promoAppliedRow}>
              <Text style={{ color: colors.success }}>{state.promoCode} applied (-{state.discountPercent}%)</Text>
              <TouchableOpacity onPress={() => dispatch({ type: 'REMOVE_PROMO' })}>
                <Text style={{ color: colors.danger }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.subtotal}>Subtotal: Rs {subtotal.toFixed(0)}</Text>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('OrderSummary')}>
            <Text style={styles.checkoutText}>Review Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
    itemCard: {
      flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface,
      borderRadius: 10, borderWidth: 1, borderColor: colors.border, padding: 10, marginBottom: 10, gap: 8,
    },
    itemName: { fontWeight: '600', color: colors.text },
    itemPrice: { fontSize: 12, color: colors.subtext, marginBottom: 4 },
    noteInput: { fontSize: 12, borderBottomWidth: 1, borderColor: colors.border, color: colors.text, paddingVertical: 2 },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    stepBtn: { fontSize: 20, color: colors.primary, paddingHorizontal: 6 },
    qty: { color: colors.text, minWidth: 18, textAlign: 'center' },
    removeBtn: { color: colors.danger, fontSize: 12 },
    footer: { borderTopWidth: 1, borderColor: colors.border, padding: 16 },
    promoRow: { flexDirection: 'row', gap: 8 },
    promoInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text },
    promoBtn: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
    promoAppliedRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    error: { color: colors.danger, fontSize: 12, marginTop: 6 },
    subtotal: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 },
    checkoutBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
    checkoutText: { color: '#fff', fontWeight: '700' },
  });
