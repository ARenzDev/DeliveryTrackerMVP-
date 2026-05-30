import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order } from '../hooks/useOrders';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // amber-500
      case 'in_transit':
        return '#3b82f6'; // blue-500
      case 'delivered':
        return '#10b981'; // emerald-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.badgeText}>{order.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.address}>📍 {order.deliveryAddress}</Text>
      <Text style={styles.date}>
        {new Date(order.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
