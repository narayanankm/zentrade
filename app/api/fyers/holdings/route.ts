/**
 * Fyers Holdings API Route
 * GET /api/fyers/holdings - Get all holdings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';

export async function GET(request: NextRequest) {
  try {
    const fyersClient = await getAuthenticatedFyersClient();
    const holdings = await fyersClient.getHoldings();

    return NextResponse.json({
      success: true,
      data: holdings,
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch holdings',
      },
      { status: 500 }
    );
  }
}
