import React from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, View } from 'react-native';
import { CreateOrderScreen } from './src/screens/CreateOrderScreen';
import { OrdersListScreen } from './src/screens/OrdersListScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.formWrapper}>
          <CreateOrderScreen onSuccess={() => {}} />
        </View>
        <OrdersListScreen />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  formWrapper: {
    marginBottom: 8,
  },
});
