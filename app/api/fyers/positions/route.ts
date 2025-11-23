/**
 * Fyers Positions API Route
 * GET /api/fyers/positions - Get all positions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';

export async function GET(request: NextRequest) {
  try {
    const fyersClient = await getAuthenticatedFyersClient();
    const positions = await fyersClient.getPositions();

    return NextResponse.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    console.error('Error fetching positions:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch positions',
      },
      { status: 500 }
    );
  }
}
