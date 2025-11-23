/**
 * Fyers Authentication API Route
 * Handles OAuth flow initialization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createFyersClient } from '@/lib/fyers';

/**
 * GET /api/fyers/auth
 * Generate Fyers authorization URL
 */
export async function GET(request: NextRequest) {
  try {
    const fyersClient = createFyersClient();

    // Generate auth URL
    const authUrl = fyersClient.generateAuthUrl('zentrade_auth_state');

    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate auth URL',
      },
      { status: 500 }
    );
  }
}
