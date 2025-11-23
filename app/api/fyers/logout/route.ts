/**
 * Fyers Logout Route
 * Clears authentication cookies
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/fyers/logout
 * Clear authentication cookies and logout
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Clear auth cookies
    cookieStore.delete('fyers_access_token');
    cookieStore.delete('fyers_token_expiry');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during logout:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      },
      { status: 500 }
    );
  }
}
