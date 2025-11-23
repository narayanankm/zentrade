/**
 * Fyers Orders API Route
 * GET /api/fyers/orders - Get all orders
 * POST /api/fyers/orders - Place new order
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';
import { z } from 'zod';

// Validation schema for place order
const placeOrderSchema = z.object({
  symbol: z.string().min(1),
  qty: z.number().positive(),
  type: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  side: z.union([z.literal(1), z.literal(-1)]),
  productType: z.enum(['INTRADAY', 'CNC', 'MARGIN', 'CO', 'BO']),
  limitPrice: z.number().optional(),
  stopPrice: z.number().optional(),
  validity: z.enum(['DAY', 'IOC']).optional(),
  disclosedQty: z.number().optional(),
  offlineOrder: z.boolean().optional(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
});

/**
 * GET - Fetch all orders
 */
export async function GET(request: NextRequest) {
  try {
    const fyersClient = await getAuthenticatedFyersClient();
    const orders = await fyersClient.getOrders();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Place new order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = placeOrderSchema.parse(body);

    const fyersClient = await getAuthenticatedFyersClient();
    const result = await fyersClient.placeOrder(validatedData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error placing order:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order parameters',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to place order',
      },
      { status: 500 }
    );
  }
}
