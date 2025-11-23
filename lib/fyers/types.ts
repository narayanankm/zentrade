/**
 * Fyers API v3 TypeScript Type Definitions
 */

// ============================================================================
// Authentication Types
// ============================================================================

export interface FyersAuthConfig {
  appId: string;
  secretKey: string;
  redirectUri: string;
}

export interface FyersAccessToken {
  access_token: string;
  expires_at: number; // Unix timestamp
}

export interface FyersAuthResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  access_token?: string;
}

// ============================================================================
// Market Data Types
// ============================================================================

export interface FyersQuote {
  n: string; // Symbol name
  s: 'ok' | 'error';
  v: {
    ch: number; // Change
    chp: number; // Change percentage
    lp: number; // Last traded price
    spread: number;
    ask: number;
    bid: number;
    open_price: number;
    high_price: number;
    low_price: number;
    prev_close_price: number;
    volume: number;
    short_name: string;
    exchange: string;
    description: string;
    original_name: string;
    symbol: string;
    fyToken: string;
    tt?: number; // Last traded time
  };
}

export interface FyersQuotesResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  d?: FyersQuote[];
}

export interface MarketDepth {
  price: number;
  volume: number;
  ord: number;
}

export interface FyersDepthResponse {
  s: 'ok' | 'error';
  code: number;
  d: {
    totalbuyqty: number;
    totalsellqty: number;
    bids: MarketDepth[];
    ask: MarketDepth[];
  };
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderSide = 1 | -1; // 1 = Buy, -1 = Sell
export type OrderType = 1 | 2 | 3 | 4; // 1=Limit, 2=Market, 3=Stop Loss, 4=Stop Loss Market
export type ProductType = 'INTRADAY' | 'CNC' | 'MARGIN' | 'CO' | 'BO';
export type OrderValidity = 'DAY' | 'IOC';
export type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1=Cancelled, 2=Traded, 3=Transit, 4=Rejected, 5=Pending, 6=Expired, 7=Inactive

export interface PlaceOrderRequest {
  symbol: string;
  qty: number;
  type: OrderType;
  side: OrderSide;
  productType: ProductType;
  limitPrice?: number;
  stopPrice?: number;
  validity?: OrderValidity;
  disclosedQty?: number;
  offlineOrder?: boolean;
  stopLoss?: number;
  takeProfit?: number;
}

export interface OrderResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  id?: string; // Order ID
}

export interface Order {
  id: string;
  fyToken: string;
  symbol: string;
  productType: string;
  side: OrderSide;
  type: OrderType;
  qty: number;
  remainingQuantity: number;
  filledQty: number;
  limitPrice: number;
  stopPrice: number;
  tradedPrice: number;
  status: OrderStatus;
  orderDateTime: string;
  orderValidity: string;
  orderTag?: string;
  message?: string;
}

export interface OrdersResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  orderBook?: Order[];
}

// ============================================================================
// Position Types
// ============================================================================

export interface Position {
  id: string;
  symbol: string;
  fyToken: string;
  productType: string;
  side: number;
  qty: number;
  avgPrice: number;
  netQty: number;
  buyQty: number;
  buyAvg: number;
  buyVal: number;
  sellQty: number;
  sellAvg: number;
  sellVal: number;
  realized_profit: number;
  unrealized_profit: number;
  pl: number;
  ltp: number;
  crossCurrency: string;
  rbiRefRate: number;
}

export interface PositionsResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  netPositions?: Position[];
  overall?: {
    count_total: number;
    count_open: number;
    pl_total: number;
    pl_realized: number;
    pl_unrealized: number;
  };
}

// ============================================================================
// Holdings Types
// ============================================================================

export interface Holding {
  fyToken: string;
  symbol: string;
  holdingType: string;
  quantity: number;
  remainingQuantity: number;
  costPrice: number;
  marketVal: number;
  pnl: number;
  ltp: number;
  isin: string;
  collateralQuantity?: number;
  collateralValue?: number;
}

export interface HoldingsResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  holdings?: Holding[];
  overall?: {
    count_total: number;
    pnl_perc: number;
    total_investment: number;
    total_current_value: number;
    total_pnl: number;
  };
}

// ============================================================================
// Funds Types
// ============================================================================

export interface FundsResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  fund_limit?: Array<{
    id: number;
    title: string;
    equityAmount: number;
    commodityAmount: number;
  }>;
}

// ============================================================================
// Historical Data Types
// ============================================================================

export type HistoricalResolution = '1' | '2' | '3' | '5' | '10' | '15' | '20' | '30' | '60' | '120' | '240' | 'D' | 'W' | 'M';

export interface HistoricalDataRequest {
  symbol: string;
  resolution: HistoricalResolution;
  date_format: '0' | '1'; // 0 = Unix timestamp, 1 = dd-MM-yyyy
  range_from: string;
  range_to: string;
  cont_flag?: '0' | '1'; // 0 = Adjust for corporate actions, 1 = Don't adjust
}

export interface Candle {
  datetime: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalDataResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  candles?: Candle[];
}

// ============================================================================
// WebSocket Types
// ============================================================================

export type WebSocketDataType = 'symbolData' | 'depthUpdate' | 'orderUpdate';

export interface WebSocketConfig {
  symbol: string[];
  dataType: WebSocketDataType;
  accessToken: string;
}

export interface WebSocketQuoteData {
  symbol: string;
  fycode: string;
  timestamp: number;
  fytoken: string;
  ltp: number;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  ch: number;
  chp: number;
  bid_price: number;
  ask_price: number;
  last_traded_qty: number;
  tot_buy_qty: number;
  tot_sell_qty: number;
  avg_trade_price: number;
  low_price_range: number;
  high_price_range: number;
  lower_ckt: number;
  upper_ckt: number;
  original_name: string;
}

// ============================================================================
// Profile & Account Types
// ============================================================================

export interface ProfileResponse {
  s: 'ok' | 'error';
  code: number;
  message?: string;
  data?: {
    fy_id: string;
    name: string;
    email_id: string;
    mobile_number: string;
    pan: string;
    pin: string;
    client_type: string;
    po_number: string;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export interface FyersAPIError {
  s: 'error';
  code: number;
  message: string;
}

export type FyersResponse<T> = T | FyersAPIError;
