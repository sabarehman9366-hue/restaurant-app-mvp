// src/screens/ManagerDashboardScreen.js  (Question 10)
// Three tabs: Incoming Orders, Reservations, Menu Management. Visible to
// the Manager role only (enforced in navigation/AppNavigator.js).

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Switch, Alert, StyleSheet } from 'react-native';
import { useOrders } from '../context/OrdersContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';

const TABS = ['Incoming Orders', 'Reservations', 'Menu Management'];
const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

export default function ManagerDashboardScreen() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={{ color: activeTab === tab ? '#fff' : colors.text, fontSize: 12 }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Incoming Orders' && <IncomingOrdersTab colors={colors} />}
      {activeTab === 'Reservations' && <ReservationsTab colors={colors} />}
      {activeTab === 'Menu Management' && <MenuManagementTab colors={colors} />}
    </View>
  );
}

function IncomingOrdersTab({ colors }) {
  const { state, dispatch } = useOrders();
  return (
    <FlatList
      data={state.orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 12 }}
      ListEmptyComponent={<Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 40 }}>No orders yet.</Text>}
      renderItem={({ item }) => (
        <View style={[localStyles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>#{item.id} · {item.type}</Text>
          <Text style={{ color: colors.subtext, marginBottom: 6 }}>Rs {item.total.toFixed(0)} · {item.status}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {ORDER_STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[localStyles.statusChip, { borderColor: colors.border }, item.status === s && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => dispatch({ type: 'UPDATE_STATUS', payload: { orderId: item.id, status: s } })}
              >
                <Text style={{ fontSize: 11, color: item.status === s ? '#fff' : colors.text }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    />
  );
}

function ReservationsTab({ colors }) {
  // Demo-scoped: reservations created via useReservation live in that
  // hook's local state (per-user), so the manager view here shows the
  // seeded reservation set as a representative sample to accept/decline.
  const [reservations, setReservations] = useState([
    { id: 'r1', date: '2026-09-26', time: '19:00', partySize: 3, status: 'pending' },
    { id: 'r2', date: '2026-09-27', time: '20:00', partySize: 5, status: 'pending' },
  ]);
  const setStatus = (id, status) => setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <FlatList
      data={reservations}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <View style={[localStyles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text }}>{item.date} · {item.time} · {item.partySize} guests</Text>
          <Text style={{ color: colors.subtext, marginBottom: 6, textTransform: 'capitalize' }}>{item.status}</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => setStatus(item.id, 'accepted')}>
              <Text style={{ color: colors.success }}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStatus(item.id, 'declined')}>
              <Text style={{ color: colors.danger }}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

function MenuManagementTab({ colors }) {
  const { menuItems, updatePrice, toggleAvailability, addItem } = useMenu();
  const [editingId, setEditingId] = useState(null);
  const [priceDraft, setPriceDraft] = useState('');

  const startEdit = (item) => { setEditingId(item.id); setPriceDraft(String(item.price)); };
  const savePrice = (id) => {
    const parsed = Number(priceDraft);
    if (!parsed || parsed <= 0) { Alert.alert('Invalid price'); return; }
    updatePrice(id, parsed);
    setEditingId(null);
  };

  const quickAddItem = () => {
    addItem({
      id: `m${Date.now()}`,
      name: 'New Dish',
      description: 'Newly added by manager — edit details later.',
      price: 500,
      category: 'Mains',
      image: 'https://picsum.photos/seed/newdish/300/200',
      isSpecial: false,
      isAvailable: true,
    });
  };

  return (
    <FlatList
      data={menuItems}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 12 }}
      ListHeaderComponent={
        <TouchableOpacity style={[localStyles.addBtn, { backgroundColor: colors.primary }]} onPress={quickAddItem}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>+ Add Menu Item</Text>
        </TouchableOpacity>
      }
      renderItem={({ item }) => (
        <View style={[localStyles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 10 }}>
            {editingId === item.id ? (
              <>
                <TextInput
                  style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 6, padding: 4, width: 80, color: colors.text }}
                  keyboardType="numeric"
                  value={priceDraft}
                  onChangeText={setPriceDraft}
                />
                <TouchableOpacity onPress={() => savePrice(item.id)}><Text style={{ color: colors.success }}>Save</Text></TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={{ color: colors.primary }}>Rs {item.price} (edit)</Text>
              </TouchableOpacity>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
              <Text style={{ color: colors.subtext, fontSize: 12 }}>Available</Text>
              <Switch value={item.isAvailable} onValueChange={() => toggleAvailability(item.id)} />
            </View>
          </View>
        </View>
      )}
    />
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1 },
    tabRow: { flexDirection: 'row', padding: 10, gap: 8 },
    tab: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  });

const localStyles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 },
  statusChip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  addBtn: { borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: 12 },
});
