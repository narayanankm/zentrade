/**
 * Fyers Portfolio Hooks (Positions, Holdings, Funds)
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import type { PositionsResponse, HoldingsResponse, FundsResponse, ProfileResponse } from '@/lib/fyers/types';

/**
 * Hook to fetch positions
 */
export function useFyersPositions(enabled: boolean = true) {
  return useQuery<PositionsResponse>({
    queryKey: ['fyers', 'positions'],
    queryFn: async () => {
      const response = await fetch('/api/fyers/positions');

      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch positions');
      }

      return data.data;
    },
    enabled,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

/**
 * Hook to fetch holdings
 */
export function useFyersHoldings(enabled: boolean = true) {
  return useQuery<HoldingsResponse>({
    queryKey: ['fyers', 'holdings'],
    queryFn: async () => {
      const response = await fetch('/api/fyers/holdings');

      if (!response.ok) {
        throw new Error('Failed to fetch holdings');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch holdings');
      }

      return data.data;
    },
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Hook to fetch funds
 */
export function useFyersFunds(enabled: boolean = true) {
  return useQuery<FundsResponse>({
    queryKey: ['fyers', 'funds'],
    queryFn: async () => {
      const response = await fetch('/api/fyers/funds');

      if (!response.ok) {
        throw new Error('Failed to fetch funds');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch funds');
      }

      return data.data;
    },
    enabled,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Hook to fetch user profile
 */
export function useFyersProfile(enabled: boolean = true) {
  return useQuery<ProfileResponse>({
    queryKey: ['fyers', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/fyers/profile');

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      return data.data;
    },
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
