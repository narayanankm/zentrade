# Zentrade Setup Guide

Complete step-by-step guide to get Zentrade running locally and deploy to production.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Fyers trading account
- Git installed

## Step 1: Fyers API Setup

### 1.1 Create Fyers API Application

1. Go to [Fyers API Dashboard](https://myapi.fyers.in/dashboard/)
2. Log in with your Fyers credentials
3. Click "Create App" or "Add App"
4. Fill in the details:
   - **App Name**: Zentrade (or any name)
   - **App Type**: Web App
   - **Redirect URL**:
     - For local: `http://localhost:3000/api/fyers/callback`
     - For production: `https://yourdomain.vercel.app/api/fyers/callback`
   - **Description**: Trading platform
5. Click "Create"
6. Note down your **App ID** and **Secret Key**

### 1.2 Enable TOTP Authentication

1. Go to [Fyers Account Settings](https://myaccount.fyers.in/ManageAccount)
2. Find "Security" or "2FA Settings"
3. Enable **"External 2FA TOTP"**
4. Follow the setup instructions to configure TOTP

## Step 2: Local Development Setup

### 2.1 Clone and Install

```bash
cd d:/algo/zentrade
pnpm install
```

### 2.2 Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and fill in your credentials:

```env
# Fyers API Credentials (from Step 1.1)
FYERS_APP_ID=your_app_id_here
FYERS_SECRET_KEY=your_secret_key_here
FYERS_REDIRECT_URI=http://localhost:3000/api/fyers/callback

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Generate a random secret (use: openssl rand -base64 32)
SESSION_SECRET=your_random_32_char_secret_here

# API Environment (paper trading by default)
FYERS_API_BASE_URL=https://api-t1.fyers.in
```

### 2.3 Generate Session Secret

Generate a secure session secret:

```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output and paste it as `SESSION_SECRET` in `.env.local`.

### 2.4 Start Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 3: Testing the Integration

### 3.1 Test Authentication

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Login with Fyers"
3. You'll be redirected to Fyers login page
4. Enter your credentials and TOTP code
5. Grant permissions to the app
6. You'll be redirected back to `/dashboard`

### 3.2 Test API Endpoints

Open your browser console and test API calls:

```javascript
// Check session
fetch('/api/fyers/session').then(r => r.json()).then(console.log)

// Get profile
fetch('/api/fyers/profile').then(r => r.json()).then(console.log)

// Get quotes
fetch('/api/fyers/quotes?symbols=NSE:SBIN-EQ').then(r => r.json()).then(console.log)

// Get positions
fetch('/api/fyers/positions').then(r => r.json()).then(console.log)
```

## Step 4: Production Deployment (Vercel)

### 4.1 Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Fyers API integration"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/zentrade.git
git branch -M main
git push -u origin main
```

### 4.2 Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from `.env.local`:
     ```
     FYERS_APP_ID=your_app_id
     FYERS_SECRET_KEY=your_secret_key
     FYERS_REDIRECT_URI=https://yourapp.vercel.app/api/fyers/callback
     NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
     SESSION_SECRET=your_random_secret
     FYERS_API_BASE_URL=https://api-t1.fyers.in
     ```

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
pnpm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

### 4.3 Update Fyers App Redirect URI

1. Go back to [Fyers API Dashboard](https://myapi.fyers.in/dashboard/)
2. Edit your app
3. Update **Redirect URL** to: `https://yourapp.vercel.app/api/fyers/callback`
4. Save changes

### 4.4 Test Production Deployment

1. Visit your production URL: `https://yourapp.vercel.app`
2. Test login flow
3. Verify all features work

## Step 5: Switch to Live Trading (Optional)

**⚠️ Warning**: Live trading uses real money. Test thoroughly in paper trading first!

1. Update environment variable:
   ```env
   FYERS_API_BASE_URL=https://api.fyers.in
   ```

2. Redeploy the application

## Troubleshooting

### Issue: "Not authenticated" error

**Solution**:
- Check that cookies are enabled in browser
- Verify `SESSION_SECRET` is set
- Check that redirect URI matches exactly

### Issue: "Invalid credentials" during login

**Solution**:
- Verify `FYERS_APP_ID` and `FYERS_SECRET_KEY` are correct
- Check that TOTP is enabled in Fyers account
- Ensure redirect URI is registered in Fyers dashboard

### Issue: Build fails on Vercel

**Solution**:
- Ensure all dependencies are in `package.json`
- Check that environment variables are set in Vercel
- Review build logs for specific errors

### Issue: API calls return 500 error

**Solution**:
- Check Vercel logs: `vercel logs`
- Verify all environment variables are set correctly
- Ensure Fyers API is accessible from Vercel's servers

## Development Tips

### 1. Hot Reload
The dev server supports hot reload. Changes to files will automatically refresh.

### 2. Type Safety
The project uses TypeScript. Check types with:
```bash
pnpm tsc --noEmit
```

### 3. Linting
Run linter:
```bash
pnpm lint
```

### 4. Testing API Routes
Use tools like:
- Browser DevTools Network tab
- Postman
- curl

Example:
```bash
curl http://localhost:3000/api/fyers/session \
  -H "Cookie: fyers_access_token=your_token"
```

## Next Steps

Now that the integration is complete, you can:

1. ✅ Build UI components for market data
2. ✅ Create order placement forms
3. ✅ Add portfolio visualization
4. ✅ Integrate WebSocket for real-time data
5. ✅ Add charting library for historical data
6. ✅ Implement error boundaries
7. ✅ Add loading skeletons
8. ✅ Create mobile-responsive design

Refer to [FYERS_INTEGRATION.md](./FYERS_INTEGRATION.md) for detailed API documentation and usage examples.

## Support Resources

- **Fyers API Documentation**: https://myapi.fyers.in/docsv3
- **Fyers Support**: support@fyers.in
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Documentation**: https://vercel.com/docs

## Security Best Practices

1. ✅ Never commit `.env.local` to git (already in `.gitignore`)
2. ✅ Use httpOnly cookies for tokens (implemented)
3. ✅ Keep dependencies updated: `pnpm update`
4. ✅ Use environment variables for all secrets
5. ✅ Enable HTTPS in production (Vercel does this automatically)
6. ✅ Implement rate limiting if needed
7. ✅ Monitor API usage and logs

## License

This project is for personal/educational use. Ensure compliance with Fyers API terms of service.
