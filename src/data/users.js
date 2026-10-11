// src/data/users.js
// Mock user accounts used by LoginScreen for authentication simulation.
// In a real backend-connected app this file would not exist.

export const MOCK_USERS = [
  {
    id: 'u1',
    fullName: 'Ayesha Khan',
    email: 'customer@demo.com',
    password: 'Pass1234',
    role: 'customer',
  },
  {
    id: 'u2',
    fullName: 'Bilal Ahmed',
    email: 'manager@demo.com',
    password: 'Manage123',
    role: 'manager',
  },
  {
    id: 'u3',
    fullName: 'Sara Malik',
    email: 'sara@demo.com',
    password: 'Sara1234',
    role: 'customer',
  },
];

export function findUserByEmail(email) {
  return MOCK_USERS.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
}
