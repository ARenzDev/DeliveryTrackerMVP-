import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { socket } from '../services/socket';

export interface Order {
  _id: string;
  customerName: string;
  deliveryAddress: string;
  status: string;
  createdAt: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    socket.on('orderCreated', (newOrder: Order) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    socket.on('orderUpdated', (updatedOrder: Order) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off('orderCreated');
      socket.off('orderUpdated');
    };
  }, [fetchOrders]);

  const createOrder = async (orderData: Partial<Order>) => {
    try {
      await api.post('/orders', orderData);
      // The socket listener will automatically append the new order to the list
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  return { orders, loading, createOrder, refetch: fetchOrders };
};
