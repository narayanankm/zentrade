/**
 * Fyers Profile API Route
 * GET /api/fyers/profile - Get user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';

export async function GET(request: NextRequest) {
  try {
    console.log('[Profile API] Getting authenticated client...');
    const fyersClient = await getAuthenticatedFyersClient();

    console.log('[Profile API] Fetching profile from Fyers...');
    const profile = await fyersClient.getProfile();

    console.log('[Profile API] Profile fetched successfully:', profile);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('[Profile API] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      error
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      },
      { status: 500 }
    );
  }
}
