// src/screens/ReservationScreen.js  (Question 9)
// Pure UI — ALL business logic lives in useReservation(). This screen
// only renders inputs and calls the hook's functions.

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useReservation } from '../hooks/useReservation';

export default function ReservationScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const {
    date, setDate, time, setTime, partySize, setPartySize,
    tableId, setTableId, contactPhone, setContactPhone, error,
    timeSlots, availableTables, slotDisabled, createReservation,
    cancelReservation, myReservations,
  } = useReservation(user?.id);

  const [showConfirm, setShowConfirm] = useState(false);
  const styles = getStyles(colors);

  const onReviewBooking = () => {
    if (!tableId) {
      Alert.alert('Select a table', 'Please choose an available table first.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    const result = createReservation();
    setShowConfirm(false);
    if (result.ok) {
      Alert.alert('Reservation confirmed', `Table booked for ${date} at ${time}.`);
    } else {
      Alert.alert('Could not book', result.error);
    }
  };

  const handleCancel = (id) => {
    Alert.alert('Cancel reservation?', 'This cannot be undone.', [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: () => cancelReservation(id) },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book a Table</Text>

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2026-09-30" placeholderTextColor={colors.subtext} value={date} onChangeText={setDate} />

      <Text style={styles.label}>Time slot</Text>
      <View style={styles.slotsRow}>
        {timeSlots.map((slot) => {
          const disabled = slotDisabled(slot);
          return (
            <TouchableOpacity
              key={slot}
              disabled={disabled}
              style={[styles.slotChip, time === slot && styles.slotChipActive, disabled && styles.slotChipDisabled]}
              onPress={() => setTime(slot)}
            >
              <Text style={{ color: disabled ? colors.disabled : time === slot ? '#fff' : colors.text }}>{slot}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Party size</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity onPress={() => setPartySize((p) => Math.max(1, p - 1))}><Text style={styles.stepBtn}>−</Text></TouchableOpacity>
        <Text style={styles.stepValue}>{partySize}</Text>
        <TouchableOpacity onPress={() => setPartySize((p) => Math.min(12, p + 1))}><Text style={styles.stepBtn}>+</Text></TouchableOpacity>
      </View>

      <Text style={styles.label}>Available tables</Text>
      <View style={styles.slotsRow}>
        {availableTables.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.slotChip, tableId === t.id && styles.slotChipActive]}
            onPress={() => setTableId(t.id)}
          >
            <Text style={{ color: tableId === t.id ? '#fff' : colors.text }}>{t.label} ({t.seats})</Text>
          </TouchableOpacity>
        ))}
        {availableTables.length === 0 && <Text style={{ color: colors.subtext }}>No tables free for this size/time.</Text>}
      </View>

      <Text style={styles.label}>Contact phone (03XX-XXXXXXX)</Text>
      <TextInput style={styles.input} placeholder="0301-1234567" placeholderTextColor={colors.subtext} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.bookBtn} onPress={onReviewBooking}>
        <Text style={styles.bookBtnText}>Review Booking</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Reservations</Text>
      {myReservations.length === 0 && <Text style={{ color: colors.subtext }}>No upcoming reservations.</Text>}
      {myReservations.map((r) => (
        <View key={r.id} style={styles.resCard}>
          <Text style={{ color: colors.text }}>{r.date} · {r.time} · {r.partySize} guests</Text>
          <TouchableOpacity onPress={() => handleCancel(r.id)}><Text style={{ color: colors.danger }}>Cancel</Text></TouchableOpacity>
        </View>
      ))}

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Reservation</Text>
            <Text style={styles.modalLine}>Date: {date}</Text>
            <Text style={styles.modalLine}>Time: {time}</Text>
            <Text style={styles.modalLine}>Party size: {partySize}</Text>
            <Text style={styles.modalLine}>Phone: {contactPhone}</Text>
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setShowConfirm(false)}><Text style={{ color: colors.subtext }}>Edit</Text></TouchableOpacity>
              <TouchableOpacity onPress={confirmBooking}><Text style={{ color: colors.primary, fontWeight: '700' }}>Confirm</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { padding: 20, paddingBottom: 60 },
    title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 16 },
    label: { color: colors.subtext, fontSize: 12, marginTop: 14, marginBottom: 6 },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text },
    slotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    slotChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
    slotChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    slotChipDisabled: { opacity: 0.4 },
    stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    stepBtn: { fontSize: 22, color: colors.primary },
    stepValue: { fontSize: 16, color: colors.text },
    error: { color: colors.danger, marginTop: 10 },
    bookBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
    bookBtnText: { color: '#fff', fontWeight: '700' },
    sectionTitle: { color: colors.text, fontWeight: '700', fontSize: 16, marginTop: 32, marginBottom: 8 },
    resCard: { flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, marginBottom: 8 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 32 },
    modalCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 20 },
    modalTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 10 },
    modalLine: { color: colors.subtext, marginBottom: 4 },
    modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 16 },
  });
