/**
 * Fyers OAuth Callback Route
 * Handles the OAuth redirect and generates access token
 */

import { NextRequest, NextResponse } from 'next/server';
import { createFyersClient } from '@/lib/fyers';
import { cookies } from 'next/headers';

/**
 * GET /api/fyers/callback?auth_code=xxx
 * Handle OAuth callback and generate access token
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authCode = searchParams.get('auth_code');
    const state = searchParams.get('state');

    if (!authCode) {
      return NextResponse.redirect(
        new URL('/auth/error?message=No auth code received', request.url)
      );
    }

    // Verify state to prevent CSRF
    if (state !== 'zentrade_auth_state') {
      return NextResponse.redirect(
        new URL('/auth/error?message=Invalid state parameter', request.url)
      );
    }

    const fyersClient = createFyersClient();

    // Generate access token
    const tokenData = await fyersClient.generateAccessToken(authCode);

    // Store token in httpOnly cookie for security
    const cookieStore = await cookies();
    cookieStore.set('fyers_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    cookieStore.set('fyers_token_expiry', tokenData.expires_at.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    // Redirect to success page (which will close the popup or redirect to dashboard)
    return NextResponse.redirect(new URL('/auth/success', request.url));
  } catch (error) {
    console.error('Error in OAuth callback:', error);

    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
