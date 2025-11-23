/**
 * Fyers Profile API Route
 * GET /api/fyers/profile - Get user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';

export async function GET(request: NextRequest) {
  try {
    const fyersClient = await getAuthenticatedFyersClient();
    const profile = await fyersClient.getProfile();

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      },
      { status: 500 }
    );
  }
}
