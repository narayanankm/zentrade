/**
 * Fyers API Utility Functions
 */

import { ORDER_STATUS_LABELS, ORDER_SIDES, ORDER_TYPES } from './config';
import type { OrderSide, OrderType, OrderStatus } from './types';

/**
 * Format symbol for Fyers API (e.g., NSE:SBIN-EQ)
 */
export function formatSymbol(
  exchange: string,
  symbol: string,
  segment: string = 'EQ'
): string {
  return `${exchange.toUpperCase()}:${symbol.toUpperCase()}-${segment}`;
}

/**
 * Parse Fyers symbol to extract components
 */
export function parseSymbol(fyersSymbol: string): {
  exchange: string;
  symbol: string;
  segment: string;
} | null {
  const match = fyersSymbol.match(/^([^:]+):([^-]+)-(.+)$/);
  if (!match) return null;

  return {
    exchange: match[1],
    symbol: match[2],
    segment: match[3],
  };
}

/**
 * Get order status label from status code
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] || 'Unknown';
}

/**
 * Get order side label
 */
export function getOrderSideLabel(side: OrderSide): string {
  return side === ORDER_SIDES.BUY ? 'Buy' : 'Sell';
}

/**
 * Get order type label
 */
export function getOrderTypeLabel(type: OrderType): string {
  switch (type) {
    case ORDER_TYPES.LIMIT:
      return 'Limit';
    case ORDER_TYPES.MARKET:
      return 'Market';
    case ORDER_TYPES.STOP_LOSS:
      return 'Stop Loss';
    case ORDER_TYPES.STOP_LOSS_MARKET:
      return 'Stop Loss Market';
    default:
      return 'Unknown';
  }
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format currency value
 */
export function formatCurrency(
  value: number,
  currency: string = '₹',
  decimals: number = 2
): string {
  return `${currency}${value.toFixed(decimals)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers (K, L, Cr)
 */
export function formatLargeNumber(num: number): string {
  const absNum = Math.abs(num);

  if (absNum >= 10000000) {
    // Crore
    return `${(num / 10000000).toFixed(2)}Cr`;
  } else if (absNum >= 100000) {
    // Lakh
    return `${(num / 100000).toFixed(2)}L`;
  } else if (absNum >= 1000) {
    // Thousand
    return `${(num / 1000).toFixed(2)}K`;
  }

  return num.toFixed(2);
}

/**
 * Check if market is open (Indian market hours: 9:15 AM - 3:30 PM IST)
 */
export function isMarketOpen(): boolean {
  const now = new Date();
  const istTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );

  const day = istTime.getDay();
  // 0 = Sunday, 6 = Saturday
  if (day === 0 || day === 6) return false;

  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTime = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM

  return currentTime >= marketOpen && currentTime <= marketClose;
}

/**
 * Get market status
 */
export function getMarketStatus(): {
  isOpen: boolean;
  message: string;
  nextAction: string;
} {
  const now = new Date();
  const istTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );

  const day = istTime.getDay();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      message: 'Market is closed for the weekend',
      nextAction: 'Opens Monday at 9:15 AM',
    };
  }

  const currentTime = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;

  if (currentTime < marketOpen) {
    return {
      isOpen: false,
      message: 'Market is closed',
      nextAction: `Opens today at 9:15 AM`,
    };
  }

  if (currentTime > marketClose) {
    return {
      isOpen: false,
      message: 'Market is closed',
      nextAction: 'Opens tomorrow at 9:15 AM',
    };
  }

  return {
    isOpen: true,
    message: 'Market is open',
    nextAction: 'Closes at 3:30 PM',
  };
}

/**
 * Validate symbol format
 */
export function isValidSymbol(symbol: string): boolean {
  const pattern = /^[A-Z]+:[A-Z0-9]+-[A-Z]+$/;
  return pattern.test(symbol);
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(
  timestamp: number | string,
  includeTime: boolean = true
): string {
  let dateValue: number | string = timestamp;

  // Handle numeric timestamps - detect if in seconds or milliseconds
  if (typeof timestamp === 'number') {
    // Timestamps < 10000000000 are in seconds (before ~Nov 2286)
    // Timestamps >= 10000000000 are in milliseconds
    dateValue = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  }

  const date = new Date(dateValue);

  if (includeTime) {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
  });
}

/**
 * Calculate stop loss price
 */
export function calculateStopLoss(
  entryPrice: number,
  percentage: number,
  side: OrderSide
): number {
  if (side === ORDER_SIDES.BUY) {
    return entryPrice * (1 - percentage / 100);
  } else {
    return entryPrice * (1 + percentage / 100);
  }
}

/**
 * Calculate target price
 */
export function calculateTarget(
  entryPrice: number,
  percentage: number,
  side: OrderSide
): number {
  if (side === ORDER_SIDES.BUY) {
    return entryPrice * (1 + percentage / 100);
  } else {
    return entryPrice * (1 - percentage / 100);
  }
}

/**
 * Calculate position value
 */
export function calculatePositionValue(
  quantity: number,
  price: number
): number {
  return quantity * price;
}

/**
 * Calculate profit/loss
 */
export function calculatePnL(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  side: OrderSide
): number {
  if (side === ORDER_SIDES.BUY) {
    return (sellPrice - buyPrice) * quantity;
  } else {
    return (buyPrice - sellPrice) * quantity;
  }
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
