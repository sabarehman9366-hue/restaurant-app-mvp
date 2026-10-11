// App.js
// Composes every provider (order matters: Theme/Auth are independent;
// Cart/Menu/Orders can sit inside). Shows a loading screen until the
// persisted session/orders finish restoring, so the app never flashes
// empty data (Question 10 requirement).

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { MenuProvider } from './src/context/MenuContext';
import { OrdersProvider, useOrders } from './src/context/OrdersContext';
import AppNavigator from './src/navigation/AppNavigator';

function Gate({ children }) {
  const { isRestoring } = useAuth();
  const { isLoaded } = useOrders();
  const { colors } = useTheme();

  if (isRestoring || !isLoaded) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.subtext, marginTop: 10 }}>Loading Restaurant App…</Text>
      </View>
    );
  }
  return children;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MenuProvider>
            <CartProvider>
              <OrdersProvider>
                <Gate>
                  <AppNavigator />
                </Gate>
              </OrdersProvider>
            </CartProvider>
          </MenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
