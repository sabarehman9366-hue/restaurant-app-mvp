// src/data/tables.js
// Mock physical tables used by useReservation to check availability.

export const MOCK_TABLES = [
  { id: 't1', label: 'Table 1', seats: 2 },
  { id: 't2', label: 'Table 2', seats: 2 },
  { id: 't3', label: 'Table 3', seats: 4 },
  { id: 't4', label: 'Table 4', seats: 4 },
  { id: 't5', label: 'Table 5', seats: 6 },
  { id: 't6', label: 'Table 6 (Family)', seats: 8 },
  { id: 't7', label: 'Table 7', seats: 4 },
  { id: 't8', label: 'Table 8 (Booth)', seats: 12 },
];

// Seed reservations so "availability" has something to check against on
// first run, before the user creates any bookings of their own.
export const MOCK_RESERVATIONS = [
  {
    id: 'r1',
    userId: 'u1',
    tableId: 't3',
    date: '2026-09-26',
    time: '19:00',
    partySize: 3,
    contactPhone: '0301-1234567',
    status: 'confirmed',
  },
];

export const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];
