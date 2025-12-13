/**
 * Fyers Trading Hooks (Orders, Quotes)
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { OrdersResponse, FyersQuotesResponse, PlaceOrderRequest } from '@/lib/fyers/types';

/**
 * Hook to fetch orders
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
 * Hook to place order
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: PlaceOrderRequest) => {
      const response = await fetch('/api/fyers/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
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
      // Invalidate and refetch orders, positions, and funds
      queryClient.invalidateQueries({ queryKey: ['fyers', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['fyers', 'positions'] });
      queryClient.invalidateQueries({ queryKey: ['fyers', 'funds'] });
    },
  });
}

/**
 * Hook to fetch quotes for symbols
 */
export function useFyersQuotes(symbols: string[], enabled: boolean = true) {
  return useQuery<FyersQuotesResponse>({
    queryKey: ['fyers', 'quotes', symbols],
    queryFn: async () => {
      if (!symbols || symbols.length === 0) {
        throw new Error('No symbols provided');
      }

      const response = await fetch(`/api/fyers/quotes?symbols=${symbols.join(',')}`);

      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch quotes');
      }

      return data.data;
    },
    enabled: enabled && symbols.length > 0,
    refetchInterval: 3000, // Refresh every 3 seconds for real-time quotes
  });
}

/**
 * Hook to cancel order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
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
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['fyers', 'orders'] });
    },
  });
}
