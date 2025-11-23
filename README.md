# Zentrade

A professional trading platform built with Next.js 16 and Fyers API v3.

## Features

✅ **Complete Fyers API v3 Integration**
- Secure OAuth authentication with httpOnly cookies
- Real-time market data (quotes, depth, historical)
- Order management (place, modify, cancel)
- Portfolio tracking (positions, holdings, funds)
- WebSocket support for live updates

✅ **Modern Tech Stack**
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: TanStack Query + Zustand
- **Validation**: Zod schemas
- **Deployment**: Vercel-optimized

✅ **Security First**
- HttpOnly cookies for tokens
- Server-side API routes
- Environment variable protection
- CSRF protection via state parameter

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Fyers trading account with API access

### 1. Installation

```bash
# Clone the repository
cd d:/algo/zentrade

# Install dependencies
pnpm install
```

### 2. Configuration

Copy environment template and fill in your Fyers API credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
FYERS_APP_ID=your_app_id
FYERS_SECRET_KEY=your_secret_key
FYERS_REDIRECT_URI=http://localhost:3000/api/fyers/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=your_random_32_char_secret
FYERS_API_BASE_URL=https://api-t1.fyers.in
```

### 3. Verify Setup

Check that all environment variables are configured:

```bash
pnpm check-env
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide from scratch to deployment
- **[FYERS_INTEGRATION.md](./FYERS_INTEGRATION.md)** - Detailed API integration documentation
- **[Fyers API Docs](https://myapi.fyers.in/docsv3)** - Official Fyers API documentation

## Project Structure

```
zentrade/
├── app/
│   ├── api/fyers/          # API routes for Fyers integration
│   ├── dashboard/          # Trading dashboard
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Home/login page
├── lib/
│   ├── fyers/             # Fyers SDK wrapper & utilities
│   ├── providers/         # React context providers
│   └── store/             # Zustand state stores
├── hooks/                 # Custom React hooks
├── components/            # (To be built) UI components
└── scripts/               # Utility scripts
```

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Utilities
pnpm lint             # Run ESLint
pnpm check-env        # Verify environment variables
```

## API Routes

### Authentication
- `GET /api/fyers/auth` - Initialize OAuth flow
- `GET /api/fyers/callback` - OAuth callback handler
- `POST /api/fyers/logout` - Logout and clear session
- `GET /api/fyers/session` - Check session status

### Market Data
- `GET /api/fyers/quotes?symbols=...` - Get real-time quotes
- `GET /api/fyers/depth?symbol=...` - Get market depth
- `GET /api/fyers/history?symbol=...&resolution=...&from=...&to=...` - Get historical data

### Trading
- `GET /api/fyers/orders` - Get all orders
- `POST /api/fyers/orders` - Place new order
- `PATCH /api/fyers/orders/[id]` - Modify order
- `DELETE /api/fyers/orders/[id]` - Cancel order

### Portfolio
- `GET /api/fyers/positions` - Get positions
- `GET /api/fyers/holdings` - Get holdings
- `GET /api/fyers/funds` - Get fund limits
- `GET /api/fyers/profile` - Get user profile

## Usage Examples

### Authentication

```tsx
import { useFyersAuth, useFyersLogin } from '@/hooks/use-fyers-auth';

function LoginButton() {
  const { data: session } = useFyersAuth();
  const login = useFyersLogin();

  if (session?.authenticated) {
    return <div>Logged in</div>;
  }

  return <button onClick={() => login.mutate()}>Login</button>;
}
```

### Market Data

```tsx
import { useFyersQuotes } from '@/hooks/use-fyers-quotes';

function StockQuote() {
  const { data } = useFyersQuotes(['NSE:SBIN-EQ']);

  return <div>Price: {data?.d?.[0]?.v?.lp}</div>;
}
```

### Place Order

```tsx
import { usePlaceOrder } from '@/hooks/use-fyers-orders';
import { ORDER_TYPES, ORDER_SIDES } from '@/lib/fyers/config';

function BuyButton() {
  const placeOrder = usePlaceOrder();

  const handleBuy = () => {
    placeOrder.mutate({
      symbol: 'NSE:SBIN-EQ',
      qty: 10,
      type: ORDER_TYPES.LIMIT,
      side: ORDER_SIDES.BUY,
      productType: 'INTRADAY',
      limitPrice: 500,
    });
  };

  return <button onClick={handleBuy}>Buy</button>;
}
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

### Environment Variables for Production

Required environment variables in Vercel:

```
FYERS_APP_ID
FYERS_SECRET_KEY
FYERS_REDIRECT_URI          # https://yourapp.vercel.app/api/fyers/callback
NEXT_PUBLIC_APP_URL         # https://yourapp.vercel.app
SESSION_SECRET
FYERS_API_BASE_URL          # https://api-t1.fyers.in or https://api.fyers.in
```

## Roadmap

### Phase 1: Core Integration ✅ (Complete)
- [x] Fyers API v3 integration
- [x] Authentication flow
- [x] API routes for all endpoints
- [x] React hooks for data fetching
- [x] State management setup
- [x] Basic UI (home + dashboard)

### Phase 2: Trading Interface (Next)
- [ ] Market watchlist component
- [ ] Order placement forms
- [ ] Portfolio visualization
- [ ] Order book display
- [ ] Positions table

### Phase 3: Advanced Features
- [ ] Real-time WebSocket integration
- [ ] Historical charts (candlestick, line)
- [ ] Technical indicators
- [ ] Alerts and notifications
- [ ] Multi-timeframe analysis

### Phase 4: Production Ready
- [ ] Error boundaries
- [ ] Loading skeletons
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Monitoring and logging

## Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- Never commit `.env.local` or any file containing secrets
- Always use environment variables for sensitive data
- Tokens are stored in httpOnly cookies (not accessible via JavaScript)
- Use paper trading (`https://api-t1.fyers.in`) for testing
- Switch to live trading only after thorough testing

## License

This project is for personal/educational use.

## Support

- **Fyers API Issues**: support@fyers.in
- **Project Issues**: Create an issue in the repository
- **Documentation**: See [SETUP.md](./SETUP.md) and [FYERS_INTEGRATION.md](./FYERS_INTEGRATION.md)

## Acknowledgments

- [Fyers](https://fyers.in) for providing the trading API
- [Vercel](https://vercel.com) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [TanStack Query](https://tanstack.com/query) for data fetching

---

**Made with ❤️ for traders**
