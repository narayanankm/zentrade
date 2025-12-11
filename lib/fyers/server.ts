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
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('fyers_access_token')?.value;
    const tokenExpiry = cookieStore.get('fyers_token_expiry')?.value;

    console.log('[Auth] Checking authentication:', {
      hasToken: !!accessToken,
      hasExpiry: !!tokenExpiry,
      tokenLength: accessToken?.length
    });

    if (!accessToken || !tokenExpiry) {
      throw new Error('Not authenticated. Please login first.');
    }

    const expiryTime = parseInt(tokenExpiry, 10);
    const now = Date.now();
    console.log('[Auth] Token expiry check:', {
      expiryTime,
      now,
      isExpired: now > expiryTime,
      timeUntilExpiry: expiryTime - now
    });

    if (now > expiryTime) {
      throw new Error('Session expired. Please login again.');
    }

    console.log('[Auth] Creating Fyers client...');
    const fyersClient = createFyersClient();
    fyersClient.setAccessToken(accessToken, expiryTime);

    console.log('[Auth] Fyers client created successfully');
    return fyersClient;
  } catch (error) {
    console.error('[Auth] Error getting authenticated client:', error);
    throw error;
  }
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
