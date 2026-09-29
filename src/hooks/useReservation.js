// src/hooks/useReservation.js  (Question 9)
// Owns ALL reservation business logic so ReservationScreen.js stays
// presentation-only: selected date/time/party size/table/contact,
// availability checks, createReservation, cancelReservation.

import { useState, useCallback, useMemo } from 'react';
import { MOCK_TABLES, MOCK_RESERVATIONS, TIME_SLOTS } from '../data/tables';

const PK_PHONE_REGEX = /^03\d{2}-\d{7}$/;

function isTableFreeAt(tableId, date, time, reservations) {
  return !reservations.some(
    (r) => r.tableId === tableId && r.date === date && r.time === time && r.status !== 'cancelled'
  );
}

export function useReservation(userId) {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [tableId, setTableId] = useState(null);
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState(null);

  // A table is "available" for the chosen date/time only if it seats
  // enough people AND nothing else already occupies it then.
  const availableTables = useMemo(() => {
    return MOCK_TABLES.filter(
      (t) => t.seats >= partySize && isTableFreeAt(t.id, date, time, reservations)
    );
  }, [date, time, partySize, reservations]);

  const slotDisabled = useCallback(
    (slot) => {
      if (!date) return false;
      const suitable = MOCK_TABLES.filter((t) => t.seats >= partySize);
      return !suitable.some((t) => isTableFreeAt(t.id, date, slot, reservations));
    },
    [date, partySize, reservations]
  );

  function validate() {
    const now = new Date();
    const chosen = date && time ? new Date(`${date}T${time}:00`) : null;

    if (!date || chosen < new Date(now.toDateString())) {
      return 'Reservation date cannot be in the past.';
    }
    if (partySize < 1 || partySize > 12) {
      return 'Party size must be between 1 and 12.';
    }
    if (!PK_PHONE_REGEX.test(contactPhone)) {
      return 'Phone must match the format 03XX-XXXXXXX.';
    }
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (chosen < oneHourFromNow) {
      return 'Bookings must be made at least one hour in advance.';
    }
    if (!tableId) {
      return 'Please select a table.';
    }
    return null;
  }

  const createReservation = useCallback(() => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return { ok: false, error: validationError };
    }
    const newReservation = {
      id: `r${Date.now()}`,
      userId,
      tableId,
      date,
      time,
      partySize,
      contactPhone,
      status: 'confirmed',
    };
    setReservations((prev) => [...prev, newReservation]);
    setError(null);
    return { ok: true, reservation: newReservation };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time, partySize, tableId, contactPhone, userId]);

  const cancelReservation = useCallback((reservationId) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
  }, []);

  const myReservations = useMemo(
    () => reservations.filter((r) => r.userId === userId && r.status !== 'cancelled'),
    [reservations, userId]
  );

  return {
    date, setDate,
    time, setTime,
    partySize, setPartySize,
    tableId, setTableId,
    contactPhone, setContactPhone,
    error,
    timeSlots: TIME_SLOTS,
    availableTables,
    slotDisabled,
    createReservation,
    cancelReservation,
    myReservations,
  };
}
