import { useState, useEffect, useRef, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { OrderResponse, OrderStatus } from '@/types/order';

export function useOrderPolling(orderId: number, interval: number = 30000) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const orderData = await orderService.getOrder(orderId);
      setOrder(orderData);
      setError(null);
      
      // Stop polling if order is completed or cancelled
      if (
        orderData.orderStatus === OrderStatus.COMPLETED || 
        orderData.orderStatus === OrderStatus.CANCELLED
      ) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();

    if (
      order?.orderStatus !== OrderStatus.COMPLETED &&
      order?.orderStatus !== OrderStatus.CANCELLED
    ) {
      intervalRef.current = setInterval(fetchOrder, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchOrder, interval, order?.orderStatus]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchOrder, interval);
    }
  }, [fetchOrder, interval]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
    stopPolling,
    startPolling,
  };
}
