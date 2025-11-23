/**
 * Fyers Funds API Route
 * GET /api/fyers/funds - Get fund limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';

export async function GET(request: NextRequest) {
  try {
    const fyersClient = await getAuthenticatedFyersClient();
    const funds = await fyersClient.getFunds();

    return NextResponse.json({
      success: true,
      data: funds,
    });
  } catch (error) {
    console.error('Error fetching funds:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch funds',
      },
      { status: 500 }
    );
  }
}
