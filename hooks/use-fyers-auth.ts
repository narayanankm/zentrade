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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/fyers/auth');
      if (!response.ok) {
        throw new Error('Failed to generate auth URL');
      }
      const data = await response.json();

      if (data.success && data.authUrl) {
        // Open Fyers auth URL in a new tab
        const authWindow = window.open(data.authUrl, '_blank', 'width=600,height=700');

        // Poll for authentication status
        const pollInterval = setInterval(async () => {
          try {
            const sessionResponse = await fetch('/api/fyers/session');
            const sessionData = await sessionResponse.json();

            if (sessionData.authenticated) {
              clearInterval(pollInterval);

              // Close the auth window if it's still open
              if (authWindow && !authWindow.closed) {
                authWindow.close();
              }

              // Invalidate queries to refresh data
              queryClient.invalidateQueries({ queryKey: ['fyers', 'session'] });

              // Redirect to dashboard
              window.location.href = '/dashboard';
            }
          } catch (error) {
            // Continue polling on error
            console.error('Error checking session:', error);
          }
        }, 2000); // Check every 2 seconds

        // Stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
        }, 5 * 60 * 1000);
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
