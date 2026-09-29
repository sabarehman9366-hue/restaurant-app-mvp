// src/screens/ProfileScreen.js  (Question 6)
// Reads the user from AuthContext and the palette/toggle from ThemeContext.

import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const styles = getStyles(colors);

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.fullName?.charAt(0) ?? '?'}</Text>
      </View>
      <Text style={styles.name}>{user?.fullName}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{user?.role}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Dark mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 48, paddingHorizontal: 24 },
    avatar: {
      width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary,
      justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
    name: { fontSize: 20, fontWeight: '700', color: colors.text },
    email: { fontSize: 14, color: colors.subtext, marginTop: 2 },
    roleBadge: {
      marginTop: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4,
    },
    roleText: { color: colors.text, textTransform: 'capitalize', fontSize: 12 },
    row: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      width: '100%', marginTop: 32, paddingVertical: 12, borderTopWidth: 1, borderColor: colors.border,
    },
    label: { color: colors.text, fontSize: 16 },
    logoutBtn: {
      marginTop: 40, borderWidth: 1, borderColor: colors.danger, borderRadius: 10,
      paddingVertical: 12, paddingHorizontal: 32,
    },
    logoutText: { color: colors.danger, fontWeight: '600' },
  });
