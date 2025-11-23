/**
 * Fyers Session Check Route
 * Validates current session and returns auth status
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/fyers/session
 * Check if user has valid session
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('fyers_access_token')?.value;
    const tokenExpiry = cookieStore.get('fyers_token_expiry')?.value;

    if (!accessToken || !tokenExpiry) {
      return NextResponse.json({
        authenticated: false,
        message: 'No active session',
      });
    }

    const expiryTime = parseInt(tokenExpiry, 10);
    const isExpired = Date.now() > expiryTime;

    if (isExpired) {
      // Clear expired cookies
      cookieStore.delete('fyers_access_token');
      cookieStore.delete('fyers_token_expiry');

      return NextResponse.json({
        authenticated: false,
        message: 'Session expired',
      });
    }

    return NextResponse.json({
      authenticated: true,
      expiresAt: expiryTime,
    });
  } catch (error) {
    console.error('Error checking session:', error);

    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Session check failed',
      },
      { status: 500 }
    );
  }
}
