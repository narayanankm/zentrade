/**
 * Fyers Single Order API Route
 * GET /api/fyers/orders/[id] - Get order by ID
 * PATCH /api/fyers/orders/[id] - Modify order
 * DELETE /api/fyers/orders/[id] - Cancel order
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedFyersClient } from '@/lib/fyers/server';
import { z } from 'zod';

// Validation schema for modify order
const modifyOrderSchema = z.object({
  qty: z.number().positive().optional(),
  type: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  limitPrice: z.number().optional(),
  stopPrice: z.number().optional(),
});

/**
 * GET - Fetch order by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fyersClient = await getAuthenticatedFyersClient();
    const order = await fyersClient.getOrderById(id);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Modify order
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = modifyOrderSchema.parse(body);

    const fyersClient = await getAuthenticatedFyersClient();
    const result = await fyersClient.modifyOrder(id, validatedData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error modifying order:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid modification parameters',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to modify order',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Cancel order
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fyersClient = await getAuthenticatedFyersClient();
    const result = await fyersClient.cancelOrder(id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel order',
      },
      { status: 500 }
    );
  }
}
