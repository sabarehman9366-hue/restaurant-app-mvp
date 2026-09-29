// src/navigation/AppNavigator.js
// Bottom tabs nested inside a stack, with role-based restriction: the
// Manager Dashboard tab only appears when user.role === 'manager'
// (Question 6 requirement).

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import MenuScreen from '../screens/MenuScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import ReservationScreen from '../screens/ReservationScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import ManagerDashboardScreen from '../screens/ManagerDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user } = useAuth();
  const { colors } = useTheme();
  return (
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Reservations" component={ReservationScreen} />
      <Tab.Screen name="Tracking" component={OrderTrackingScreen} options={{ title: 'Order Tracking' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {user?.role === 'manager' && (
        <Tab.Screen name="Dashboard" component={ManagerDashboardScreen} options={{ title: 'Manager Dashboard' }} />
      )}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isRestoring } = useAuth();
  const { colors } = useTheme();

  if (isRestoring) return null; // App.js shows the loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: 'Order Summary' }} />
            <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} options={{ title: 'Manager Dashboard' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
