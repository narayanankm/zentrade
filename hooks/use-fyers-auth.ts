/**
 * Fyers Authentication Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SessionData {
  authenticated: boolean;
  expiresAt?: number;
  message?: string;
}

/**
 * Hook to check authentication status
 */
export function useFyersAuth() {
  return useQuery<SessionData>({
    queryKey: ['fyers', 'session'],
    queryFn: async () => {
      const response = await fetch('/api/fyers/session');
      if (!response.ok) {
        throw new Error('Failed to check session');
      }
      return response.json();
    },
    refetchInterval: 1000 * 60 * 5, // Check every 5 minutes
  });
}

/**
 * Hook to initiate login
 */
export function useFyersLogin() {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/fyers/auth');
      if (!response.ok) {
        throw new Error('Failed to generate auth URL');
      }
      const data = await response.json();

      if (data.success && data.authUrl) {
        // Redirect to Fyers auth URL
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || 'Failed to initiate login');
      }
    },
  });
}

/**
 * Hook to logout
 */
export function useFyersLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/fyers/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all queries
      queryClient.clear();

      // Redirect to home
      window.location.href = '/';
    },
  });
}
