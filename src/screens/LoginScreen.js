// src/screens/LoginScreen.js  (Question 3, refactored in Q6 and Q9)
// Switches between Login / Signup modes; uses useForm (Q9) for controlled
// inputs + validation, and AuthContext (Q6) for the actual session.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*\d).{8,}$/; // 8+ chars, at least one digit

function validateLogin(values, mode) {
  const errors = {};
  if (!EMAIL_REGEX.test(values.email || '')) errors.email = 'Enter a valid email address.';
  if (!PASSWORD_REGEX.test(values.password || '')) {
    errors.password = 'Password needs 8+ characters and at least one digit.';
  }
  if (mode === 'signup') {
    if (!values.fullName || values.fullName.trim().length < 3) {
      errors.fullName = 'Enter your full name.';
    }
    if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (!values.role) errors.role = 'Select a role.';
  }
  return errors;
}

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { email: '', password: '', fullName: '', confirmPassword: '', role: 'customer' },
    (v) => validateLogin(v, mode)
  );

  const onSubmit = () => {
    handleSubmit(async (v) => {
      try {
        const user =
          mode === 'login'
            ? await login(v.email, v.password)
            : await signup(v);
        // Simulate the 1s network delay required by the assignment.
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigation.reset({
          index: 0,
          routes: [{ name: user.role === 'manager' ? 'ManagerDashboard' : 'MainTabs' }],
        });
      } catch (e) {
        Alert.alert('Authentication failed', e.message);
      }
    });
  };

  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Restaurant App</Text>
        <Text style={styles.subtitle}>{mode === 'login' ? 'Welcome back' : 'Create an account'}</Text>

        {mode === 'signup' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={colors.subtext}
              value={values.fullName}
              onChangeText={(t) => handleChange('fullName', t)}
            />
            {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.subtext}
          autoCapitalize="none"
          keyboardType="email-address"
          value={values.email}
          onChangeText={(t) => handleChange('email', t)}
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            placeholderTextColor={colors.subtext}
            secureTextEntry={!showPassword}
            value={values.password}
            onChangeText={(t) => handleChange('password', t)}
          />
          <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.showBtn}>
            <Text style={{ color: colors.primary }}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        {mode === 'signup' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={colors.subtext}
              secureTextEntry={!showPassword}
              value={values.confirmPassword}
              onChangeText={(t) => handleChange('confirmPassword', t)}
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

            <View style={styles.roleRow}>
              {['customer', 'manager'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleChip, values.role === r && styles.roleChipActive]}
                  onPress={() => handleChange('role', r)}
                >
                  <Text style={{ color: values.role === r ? '#fff' : colors.text, textTransform: 'capitalize' }}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          <Text style={styles.switchText}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Demo: customer@demo.com / Pass1234 · manager@demo.com / Manage123</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 28, fontWeight: '700', color: colors.primary, textAlign: 'center' },
    subtitle: { fontSize: 16, color: colors.subtext, textAlign: 'center', marginBottom: 24 },
    input: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 10,
      padding: 12, marginBottom: 6, color: colors.text, backgroundColor: colors.surface,
    },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    showBtn: { paddingHorizontal: 12 },
    error: { color: colors.danger, fontSize: 12, marginBottom: 8 },
    roleRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
    roleChip: {
      flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8,
      paddingVertical: 10, alignItems: 'center',
    },
    roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    submitBtn: {
      backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14,
      alignItems: 'center', marginTop: 8,
    },
    submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    switchText: { color: colors.primary, textAlign: 'center', marginTop: 16 },
    hint: { color: colors.subtext, fontSize: 11, textAlign: 'center', marginTop: 24 },
  });
