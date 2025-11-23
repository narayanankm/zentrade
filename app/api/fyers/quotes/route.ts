/**
 * Fyers Market Quotes API Route
 * GET /api/fyers/quotes?symbols=NSE:SBIN-EQ,NSE:RELIANCE-EQ
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbolsParam = searchParams.get('symbols');

    if (!symbolsParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'symbols parameter is required',
        },
        { status: 400 }
      );
    }

    const symbols = symbolsParam.split(',').map((s) => s.trim());

    if (symbols.length === 0 || symbols.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide between 1 and 50 symbols',
        },
        { status: 400 }
      );
    }

    const fyersClient = await getAuthenticatedFyersClient();
    const quotes = await fyersClient.getQuotes(symbols);

    return NextResponse.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch quotes',
      },
      { status: 500 }
    );
  }
}
