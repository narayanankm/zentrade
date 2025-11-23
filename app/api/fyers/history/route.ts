/**
 * Fyers Historical Data API Route
 * GET /api/fyers/history?symbol=NSE:SBIN-EQ&resolution=D&from=2024-01-01&to=2024-12-31
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';
import type { HistoricalResolution } from '@/lib/fyers/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') as HistoricalResolution;
    const rangeFrom = searchParams.get('from');
    const rangeTo = searchParams.get('to');

    if (!symbol || !resolution || !rangeFrom || !rangeTo) {
      return NextResponse.json(
        {
          success: false,
          error: 'symbol, resolution, from, and to parameters are required',
        },
        { status: 400 }
      );
    }

    const fyersClient = await getAuthenticatedFyersClient();
    const history = await fyersClient.getHistoricalData({
      symbol,
      resolution,
      date_format: '0', // Unix timestamp
      range_from: rangeFrom,
      range_to: rangeTo,
      cont_flag: '1',
    });

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch historical data',
      },
      { status: 500 }
    );
  }
}
