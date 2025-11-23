/**
 * Fyers Market Depth API Route
 * GET /api/fyers/depth?symbol=NSE:SBIN-EQ
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        {
          success: false,
          error: 'symbol parameter is required',
        },
        { status: 400 }
      );
    }

    const fyersClient = await getAuthenticatedFyersClient();
    const depth = await fyersClient.getMarketDepth(symbol);

    return NextResponse.json({
      success: true,
      data: depth,
    });
  } catch (error) {
    console.error('Error fetching market depth:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market depth',
      },
      { status: 500 }
    );
  }
}
