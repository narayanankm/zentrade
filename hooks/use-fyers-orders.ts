/**
 * Fyers Orders Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { OrdersResponse, PlaceOrderRequest, OrderResponse } from '@/lib/fyers/types';

/**
 * Hook to fetch all orders
 */
export function useFyersOrders(enabled: boolean = true) {
  return useQuery<OrdersResponse>({
    queryKey: ['fyers', 'orders'],
    queryFn: async () => {
      const response = await fetch('/api/fyers/orders');

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      return data.data;
    },
    enabled,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

/**
 * Hook to place an order
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, PlaceOrderRequest>({
    mutationFn: async (orderRequest) => {
      const response = await fetch('/api/fyers/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      return data.data;
    },
    onSuccess: () => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: ['fyers', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['fyers', 'positions'] });
      queryClient.invalidateQueries({ queryKey: ['fyers', 'funds'] });
    },
  });
}

/**
 * Hook to modify an order
 */
export function useModifyOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    OrderResponse,
    Error,
    { orderId: string; modifications: Partial<PlaceOrderRequest> }
  >({
    mutationFn: async ({ orderId, modifications }) => {
      const response = await fetch(`/api/fyers/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifications),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to modify order');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to modify order');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fyers', 'orders'] });
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, string>({
    mutationFn: async (orderId) => {
      const response = await fetch(`/api/fyers/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel order');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel order');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fyers', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['fyers', 'positions'] });
      queryClient.invalidateQueries({ queryKey: ['fyers', 'funds'] });
    },
  });
}
