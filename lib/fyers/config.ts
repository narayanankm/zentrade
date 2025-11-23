/**
 * Fyers API Configuration and Constants
 */

export const FYERS_CONFIG = {
  // API Base URLs
  API_BASE_URL:
    process.env.FYERS_API_BASE_URL || 'https://api-t1.fyers.in', // Paper trading by default
  API_LIVE_URL: 'https://api.fyers.in',
  API_PAPER_URL: 'https://api-t1.fyers.in',

  // WebSocket URLs
  WS_URL: 'wss://api.fyers.in/socket/v2',
  WS_DATA_URL: 'wss://api-t1.fyers.in/socket/v2/dataSock',

  // Token expiry (24 hours in milliseconds)
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000,

  // Rate limiting
  RATE_LIMIT: {
    ORDERS_PER_SECOND: 10,
    QUOTES_PER_SECOND: 2,
    HISTORICAL_PER_SECOND: 1,
  },
};

/**
 * Fyers Exchange Codes
 */
export const EXCHANGES = {
  NSE: 'NSE',
  BSE: 'BSE',
  MCX: 'MCX',
  NFO: 'NFO', // NSE Futures & Options
  BFO: 'BFO', // BSE Futures & Options
  CDS: 'CDS', // Currency Derivatives
} as const;

/**
 * Common instrument symbols
 */
export const INSTRUMENTS = {
  NIFTY: 'NSE:NIFTY50-INDEX',
  BANKNIFTY: 'NSE:NIFTYBANK-INDEX',
  SENSEX: 'BSE:SENSEX-INDEX',
} as const;

/**
 * Order type mappings
 */
export const ORDER_TYPES = {
  LIMIT: 1,
  MARKET: 2,
  STOP_LOSS: 3,
  STOP_LOSS_MARKET: 4,
} as const;

/**
 * Order side mappings
 */
export const ORDER_SIDES = {
  BUY: 1,
  SELL: -1,
} as const;

/**
 * Product types
 */
export const PRODUCT_TYPES = {
  INTRADAY: 'INTRADAY',
  CNC: 'CNC', // Cash and Carry
  MARGIN: 'MARGIN',
  CO: 'CO', // Cover Order
  BO: 'BO', // Bracket Order
} as const;

/**
 * Order validity
 */
export const ORDER_VALIDITY = {
  DAY: 'DAY',
  IOC: 'IOC', // Immediate or Cancel
} as const;

/**
 * Order status codes
 */
export const ORDER_STATUS = {
  CANCELLED: 1,
  TRADED: 2,
  TRANSIT: 3,
  REJECTED: 4,
  PENDING: 5,
  EXPIRED: 6,
  INACTIVE: 7,
} as const;

/**
 * Order status labels
 */
export const ORDER_STATUS_LABELS: Record<number, string> = {
  1: 'Cancelled',
  2: 'Traded',
  3: 'In Transit',
  4: 'Rejected',
  5: 'Pending',
  6: 'Expired',
  7: 'Inactive',
};

/**
 * Historical data resolutions
 */
export const RESOLUTIONS = {
  '1MIN': '1',
  '2MIN': '2',
  '3MIN': '3',
  '5MIN': '5',
  '10MIN': '10',
  '15MIN': '15',
  '20MIN': '20',
  '30MIN': '30',
  '1HOUR': '60',
  '2HOUR': '120',
  '4HOUR': '240',
  DAILY: 'D',
  WEEKLY: 'W',
  MONTHLY: 'M',
} as const;

/**
 * API Response codes
 */
export const RESPONSE_CODES = {
  SUCCESS: 200,
  INVALID_APP_ID: -1001,
  INVALID_ACCESS_TOKEN: -1002,
  INVALID_INPUT: -1003,
  RATE_LIMIT_EXCEEDED: 429,
} as const;

/**
 * WebSocket event types
 */
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  QUOTE: 'quote',
  DEPTH: 'depth',
  ORDER_UPDATE: 'order_update',
} as const;

/**
 * Session storage keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'fyers_access_token',
  TOKEN_EXPIRY: 'fyers_token_expiry',
  USER_PROFILE: 'fyers_user_profile',
} as const;
