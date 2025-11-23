/**
 * Fyers Market Data Hooks
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import type { FyersQuotesResponse, FyersDepthResponse, HistoricalDataResponse } from '@/lib/fyers/types';

/**
 * Hook to fetch quotes for symbols
 */
export function useFyersQuotes(symbols: string[], enabled: boolean = true) {
  return useQuery<FyersQuotesResponse>({
    queryKey: ['fyers', 'quotes', symbols],
    queryFn: async () => {
      const symbolsParam = symbols.join(',');
      const response = await fetch(`/api/fyers/quotes?symbols=${encodeURIComponent(symbolsParam)}`);

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
    refetchInterval: 3000, // Refresh every 3 seconds
  });
}

/**
 * Hook to fetch market depth for a symbol
 */
export function useFyersDepth(symbol: string, enabled: boolean = true) {
  return useQuery<FyersDepthResponse>({
    queryKey: ['fyers', 'depth', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/fyers/depth?symbol=${encodeURIComponent(symbol)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch market depth');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch market depth');
      }

      return data.data;
    },
    enabled: enabled && !!symbol,
    refetchInterval: 2000, // Refresh every 2 seconds
  });
}

/**
 * Hook to fetch historical data
 */
export function useFyersHistory(
  symbol: string,
  resolution: string,
  from: string,
  to: string,
  enabled: boolean = true
) {
  return useQuery<HistoricalDataResponse>({
    queryKey: ['fyers', 'history', symbol, resolution, from, to],
    queryFn: async () => {
      const params = new URLSearchParams({
        symbol,
        resolution,
        from,
        to,
      });

      const response = await fetch(`/api/fyers/history?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch historical data');
      }

      return data.data;
    },
    enabled: enabled && !!symbol && !!from && !!to,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
