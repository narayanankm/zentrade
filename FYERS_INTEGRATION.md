# Fyers API v3 Integration Guide

This document provides a comprehensive guide to the Fyers API v3 integration in Zentrade.

## Table of Contents

1. [Setup](#setup)
2. [Architecture](#architecture)
3. [API Routes](#api-routes)
4. [React Hooks](#react-hooks)
5. [State Management](#state-management)
6. [Authentication Flow](#authentication-flow)
7. [Usage Examples](#usage-examples)
8. [Deployment](#deployment)

## Setup

### 1. Get Fyers API Credentials

1. Visit [Fyers API Dashboard](https://myapi.fyers.in/dashboard/)
2. Create a new app
3. Note down:
   - App ID (Client ID)
   - Secret Key
   - Set Redirect URI to:
     - Local: `http://localhost:3000/api/fyers/callback`
     - Production: `https://yourdomain.com/api/fyers/callback`

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Fill in your credentials:

```env
FYERS_APP_ID=your_app_id_here
FYERS_SECRET_KEY=your_secret_key_here
FYERS_REDIRECT_URI=http://localhost:3000/api/fyers/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=your_random_session_secret_here

# For paper trading (default)
FYERS_API_BASE_URL=https://api-t1.fyers.in

# For live trading
# FYERS_API_BASE_URL=https://api.fyers.in
```

### 3. Enable TOTP Authentication

Enable 2FA TOTP in your Fyers account:
- Visit [Fyers Account Settings](https://myaccount.fyers.in/ManageAccount)
- Enable "External 2FA TOTP"

### 4. Install Dependencies

Dependencies are already installed:
- `fyers-api-v3` - Fyers SDK
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management
- `zod` - Schema validation

## Architecture

### Directory Structure

```
zentrade/
├── app/
│   ├── api/fyers/              # API routes
│   │   ├── auth/               # Authentication
│   │   ├── callback/           # OAuth callback
│   │   ├── logout/             # Logout
│   │   ├── session/            # Session check
│   │   ├── quotes/             # Market quotes
│   │   ├── depth/              # Market depth
│   │   ├── history/            # Historical data
│   │   ├── orders/             # Order management
│   │   ├── positions/          # Positions
│   │   ├── holdings/           # Holdings
│   │   ├── funds/              # Funds
│   │   └── profile/            # User profile
│   └── dashboard/              # Trading dashboard (to be built)
├── lib/
│   ├── fyers/                  # Fyers integration
│   │   ├── types.ts            # TypeScript types
│   │   ├── client.ts           # SDK wrapper
│   │   ├── config.ts           # Configuration
│   │   ├── utils.ts            # Utilities
│   │   ├── server.ts           # Server-side helpers
│   │   ├── websocket.ts        # WebSocket client
│   │   └── index.ts            # Exports
│   ├── providers/              # React providers
│   │   └── query-provider.tsx  # TanStack Query
│   └── store/                  # Zustand stores
│       ├── websocket-store.ts  # WebSocket state
│       ├── ui-store.ts         # UI state
│       └── watchlist-store.ts  # Watchlist
└── hooks/                      # React hooks
    ├── use-fyers-auth.ts       # Authentication
    ├── use-fyers-quotes.ts     # Market data
    ├── use-fyers-orders.ts     # Orders
    └── use-fyers-portfolio.ts  # Portfolio
```

## API Routes

All API routes are server-side and secure. Access tokens are stored in httpOnly cookies.

### Authentication

- `GET /api/fyers/auth` - Generate auth URL
- `GET /api/fyers/callback` - OAuth callback
- `POST /api/fyers/logout` - Logout
- `GET /api/fyers/session` - Check session

### Market Data

- `GET /api/fyers/quotes?symbols=NSE:SBIN-EQ,NSE:RELIANCE-EQ` - Get quotes
- `GET /api/fyers/depth?symbol=NSE:SBIN-EQ` - Get market depth
- `GET /api/fyers/history?symbol=NSE:SBIN-EQ&resolution=D&from=2024-01-01&to=2024-12-31` - Get historical data

### Orders

- `GET /api/fyers/orders` - Get all orders
- `POST /api/fyers/orders` - Place order
- `GET /api/fyers/orders/[id]` - Get order by ID
- `PATCH /api/fyers/orders/[id]` - Modify order
- `DELETE /api/fyers/orders/[id]` - Cancel order

### Portfolio

- `GET /api/fyers/positions` - Get positions
- `GET /api/fyers/holdings` - Get holdings
- `GET /api/fyers/funds` - Get funds
- `GET /api/fyers/profile` - Get user profile

## React Hooks

### Authentication

```tsx
import { useFyersAuth, useFyersLogin, useFyersLogout } from '@/hooks/use-fyers-auth';

function MyComponent() {
  const { data: session, isLoading } = useFyersAuth();
  const login = useFyersLogin();
  const logout = useFyersLogout();

  if (session?.authenticated) {
    return <button onClick={() => logout.mutate()}>Logout</button>;
  }

  return <button onClick={() => login.mutate()}>Login with Fyers</button>;
}
```

### Market Data

```tsx
import { useFyersQuotes } from '@/hooks/use-fyers-quotes';

function Watchlist() {
  const symbols = ['NSE:SBIN-EQ', 'NSE:RELIANCE-EQ'];
  const { data, isLoading } = useFyersQuotes(symbols);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.d?.map((quote) => (
        <div key={quote.n}>
          {quote.v.short_name}: ₹{quote.v.lp}
        </div>
      ))}
    </div>
  );
}
```

### Orders

```tsx
import { usePlaceOrder, useFyersOrders } from '@/hooks/use-fyers-orders';
import { ORDER_SIDES, ORDER_TYPES } from '@/lib/fyers/config';

function OrderForm() {
  const placeOrder = usePlaceOrder();
  const { data: orders } = useFyersOrders();

  const handlePlaceOrder = () => {
    placeOrder.mutate({
      symbol: 'NSE:SBIN-EQ',
      qty: 10,
      type: ORDER_TYPES.LIMIT,
      side: ORDER_SIDES.BUY,
      productType: 'INTRADAY',
      limitPrice: 500,
    });
  };

  return <button onClick={handlePlaceOrder}>Place Order</button>;
}
```

### Portfolio

```tsx
import { useFyersPositions, useFyersHoldings } from '@/hooks/use-fyers-portfolio';

function Portfolio() {
  const { data: positions } = useFyersPositions();
  const { data: holdings } = useFyersHoldings();

  return (
    <div>
      <h2>Positions</h2>
      {positions?.netPositions?.map((pos) => (
        <div key={pos.id}>{pos.symbol}: {pos.netQty}</div>
      ))}

      <h2>Holdings</h2>
      {holdings?.holdings?.map((holding) => (
        <div key={holding.symbol}>{holding.symbol}: {holding.quantity}</div>
      ))}
    </div>
  );
}
```

## State Management

### Watchlist Store

```tsx
import { useWatchlistStore } from '@/lib/store/watchlist-store';

function WatchlistManager() {
  const { items, addSymbol, removeSymbol, isInWatchlist } = useWatchlistStore();

  return (
    <div>
      <button onClick={() => addSymbol('NSE:SBIN-EQ', 'SBI', 'NSE')}>
        Add SBI
      </button>
      {items.map((item) => (
        <div key={item.symbol}>
          {item.name}
          <button onClick={() => removeSymbol(item.symbol)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### WebSocket Store

```tsx
import { useWebSocketStore } from '@/lib/store/websocket-store';
import { createWebSocketClient } from '@/lib/fyers/websocket';

function WebSocketManager() {
  const { isConnected, setClient, updateQuote } = useWebSocketStore();

  useEffect(() => {
    const ws = createWebSocketClient(accessToken);
    setClient(ws);

    ws.connect().then(() => {
      ws.subscribe(['NSE:SBIN-EQ'], (data) => {
        updateQuote(data.symbol, data);
      });
    });

    return () => ws.disconnect();
  }, []);

  return <div>WebSocket: {isConnected ? 'Connected' : 'Disconnected'}</div>;
}
```

## Authentication Flow

1. User clicks "Login with Fyers"
2. App calls `GET /api/fyers/auth` to get authorization URL
3. User is redirected to Fyers login page
4. User authenticates with Fyers (username, password, TOTP)
5. Fyers redirects back to `/api/fyers/callback?auth_code=xxx`
6. Server exchanges auth_code for access token
7. Access token stored in httpOnly cookie
8. User redirected to `/dashboard`

## Deployment

### Vercel Configuration

1. Add environment variables in Vercel dashboard:
   - `FYERS_APP_ID`
   - `FYERS_SECRET_KEY`
   - `FYERS_REDIRECT_URI` (use production URL)
   - `NEXT_PUBLIC_APP_URL`
   - `SESSION_SECRET`
   - `FYERS_API_BASE_URL`

2. Update Fyers app redirect URI to production URL

3. Deploy:
```bash
vercel deploy
```

### Important Notes

- **Security**: Access tokens are stored in httpOnly cookies (not accessible via JavaScript)
- **Token Expiry**: Fyers tokens expire after 24 hours
- **Paper Trading**: Use `https://api-t1.fyers.in` for testing
- **Live Trading**: Use `https://api.fyers.in` for production
- **Rate Limits**: Fyers has rate limits (10 orders/sec, 2 quotes/sec, 1 history/sec)

## Next Steps

1. Build dashboard page with market data
2. Create order placement UI
3. Build portfolio visualization
4. Add charts for historical data
5. Implement WebSocket for real-time updates
6. Add error boundaries
7. Set up monitoring and logging

## Helpful Links

- [Fyers API Documentation](https://myapi.fyers.in/docsv3)
- [Fyers Dashboard](https://myapi.fyers.in/dashboard/)
- [Fyers Account Settings](https://myaccount.fyers.in/ManageAccount)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## Support

For issues or questions:
- Fyers API: support@fyers.in
- Project issues: Create an issue in the repository
