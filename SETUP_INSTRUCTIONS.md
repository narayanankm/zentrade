# Zentrade Setup Instructions

## Issue: Dashboard Showing Zeros

The dashboard is showing zeros because the authentication is not set up correctly. Follow these steps to fix it:

## Step 1: Update Fyers Dashboard Configuration

1. Go to https://myapi.fyers.in/dashboard/
2. Log in to your Fyers account
3. Navigate to your app: **V3N9CQSGZB-100**
4. Update the **Redirect URI** to: `https://zentrade-silk.vercel.app/api/fyers/callback`
5. Save the changes

## Step 2: Environment Variables (Already Updated)

Your `.env` file has been updated with the correct redirect URI:
```
FYERS_REDIRECT_URI=https://zentrade-silk.vercel.app/api/fyers/callback
```

This must match EXACTLY what you configured in Step 1.

## Step 3: Deploy to Vercel

Once you've updated the redirect URI in the Fyers dashboard:

```bash
git add .env
git commit -m "Fix Fyers redirect URI for production"
git push
```

Vercel will automatically deploy with the correct configuration.

## Step 4: Test Authentication

1. Visit https://zentrade-silk.vercel.app
2. Click "Login with Fyers"
3. You'll be redirected to Fyers login page
4. After logging in, you'll be redirected back to your app
5. The dashboard should now show your actual portfolio data

## Why Was It Showing Zeros?

The redirect URI was set to `https://www.google.com/` which meant:
- After Fyers authentication, users were redirected to Google instead of your app
- The OAuth callback never completed
- No access token was stored
- API calls failed with "Not authenticated" error
- Dashboard displayed zeros as fallback values

## Troubleshooting

If you still see zeros after fixing the redirect URI:

1. **Check browser console** for errors (F12 → Console tab)
2. **Verify redirect URI** matches in both:
   - `.env` file
   - Fyers dashboard settings
3. **Clear cookies** and try logging in again
4. **Check server logs** in Vercel dashboard for API errors

## API Endpoints

- Auth URL: `/api/fyers/auth`
- Callback: `/api/fyers/callback`
- Session: `/api/fyers/session`
- Profile: `/api/fyers/profile`
- Positions: `/api/fyers/positions`
- Holdings: `/api/fyers/holdings`
- Funds: `/api/fyers/funds`

All these endpoints require authentication (except auth and callback).
