/**
 * Server-side Fyers utilities
 * For use in API routes and Server Components
 */

import { cookies } from 'next/headers';
import { createFyersClient, FyersClient } from './client';

/**
 * Get authenticated Fyers client from session
 * Throws error if not authenticated
 */
export async function getAuthenticatedFyersClient(): Promise<FyersClient> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('fyers_access_token')?.value;
  const tokenExpiry = cookieStore.get('fyers_token_expiry')?.value;

  if (!accessToken || !tokenExpiry) {
    throw new Error('Not authenticated. Please login first.');
  }

  const expiryTime = parseInt(tokenExpiry, 10);
  if (Date.now() > expiryTime) {
    throw new Error('Session expired. Please login again.');
  }

  const fyersClient = createFyersClient();
  fyersClient.setAccessToken(accessToken, expiryTime);

  return fyersClient;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('fyers_access_token')?.value;
    const tokenExpiry = cookieStore.get('fyers_token_expiry')?.value;

    if (!accessToken || !tokenExpiry) {
      return false;
    }

    const expiryTime = parseInt(tokenExpiry, 10);
    return Date.now() < expiryTime;
  } catch {
    return false;
  }
}

/**
 * Get current access token
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('fyers_access_token')?.value;
    const tokenExpiry = cookieStore.get('fyers_token_expiry')?.value;

    if (!accessToken || !tokenExpiry) {
      return null;
    }

    const expiryTime = parseInt(tokenExpiry, 10);
    if (Date.now() > expiryTime) {
      return null;
    }

    return accessToken;
  } catch {
    return null;
  }
}
