/**
 * Fyers WebSocket Client for Real-time Data
 * Client-side only
 */

'use client';

import { fyersDataSocket } from 'fyers-api-v3';
import type { WebSocketQuoteData } from './types';

// Re-export WebSocketQuoteData so it's available to consumers
export type { WebSocketQuoteData };

export type WebSocketCallback = (data: WebSocketQuoteData) => void;
export type WebSocketErrorCallback = (error: Error) => void;

export class FyersWebSocketClient {
  private socket: any = null;
  private accessToken: string;
  private isConnected: boolean = false;
  private subscribedSymbols: Set<string> = new Set();
  private callbacks: Map<string, Set<WebSocketCallback>> = new Map();
  private errorCallbacks: Set<WebSocketErrorCallback> = new Set();

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Connect to Fyers WebSocket
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.socket = new fyersDataSocket.FyersDataSocket(this.accessToken);

      // Set up event listeners
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.isConnected = true;

        // Resubscribe to symbols if reconnecting
        if (this.subscribedSymbols.size > 0) {
          const symbols = Array.from(this.subscribedSymbols);
          this.socket.subscribe(symbols);
          this.socket.mode(this.socket.LiteMode);
        }
      });

      this.socket.on('message', (message: any) => {
        this.handleMessage(message);
      });

      this.socket.on('error', (error: any) => {
        console.error('WebSocket error:', error);
        this.errorCallbacks.forEach((callback) => callback(new Error(error)));
      });

      this.socket.on('close', () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
      });

      // Connect
      this.socket.connect();
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.socket && this.isConnected) {
      this.socket.disconnect();
      this.isConnected = false;
      this.subscribedSymbols.clear();
      this.callbacks.clear();
    }
  }

  /**
   * Subscribe to symbols
   */
  subscribe(symbols: string[], callback: WebSocketCallback): void {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }

    symbols.forEach((symbol) => {
      this.subscribedSymbols.add(symbol);

      // Add callback for this symbol
      if (!this.callbacks.has(symbol)) {
        this.callbacks.set(symbol, new Set());
      }
      this.callbacks.get(symbol)?.add(callback);
    });

    // Subscribe via Fyers WebSocket
    this.socket.subscribe(symbols);
    this.socket.mode(this.socket.LiteMode);
  }

  /**
   * Unsubscribe from symbols
   */
  unsubscribe(symbols: string[], callback?: WebSocketCallback): void {
    symbols.forEach((symbol) => {
      if (callback) {
        // Remove specific callback
        this.callbacks.get(symbol)?.delete(callback);

        // If no more callbacks for this symbol, unsubscribe completely
        if (this.callbacks.get(symbol)?.size === 0) {
          this.subscribedSymbols.delete(symbol);
          this.callbacks.delete(symbol);
        }
      } else {
        // Remove all callbacks for this symbol
        this.subscribedSymbols.delete(symbol);
        this.callbacks.delete(symbol);
      }
    });

    // Unsubscribe via Fyers WebSocket
    if (this.socket && this.isConnected) {
      this.socket.unsubscribe(symbols);
    }
  }

  /**
   * Register error callback
   */
  onError(callback: WebSocketErrorCallback): void {
    this.errorCallbacks.add(callback);
  }

  /**
   * Remove error callback
   */
  offError(callback: WebSocketErrorCallback): void {
    this.errorCallbacks.delete(callback);
  }

  /**
   * Get connection status
   */
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get subscribed symbols
   */
  getSubscribedSymbols(): string[] {
    return Array.from(this.subscribedSymbols);
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(message: any): void {
    try {
      // Fyers WebSocket sends data in a specific format
      // Parse and distribute to callbacks
      const symbol = message.symbol || message.n;

      if (symbol && this.callbacks.has(symbol)) {
        const callbacks = this.callbacks.get(symbol);
        const data: WebSocketQuoteData = this.parseMessage(message);

        callbacks?.forEach((callback) => {
          try {
            callback(data);
          } catch (error) {
            console.error('Error in WebSocket callback:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Parse WebSocket message to standard format
   */
  private parseMessage(message: any): WebSocketQuoteData {
    return {
      symbol: message.symbol || message.n || '',
      fycode: message.fycode || '',
      timestamp: message.timestamp || message.tt || Date.now(),
      fytoken: message.fytoken || '',
      ltp: message.ltp || message.v?.lp || 0,
      open_price: message.open_price || message.v?.open_price || 0,
      high_price: message.high_price || message.v?.high_price || 0,
      low_price: message.low_price || message.v?.low_price || 0,
      close_price: message.close_price || message.v?.prev_close_price || 0,
      volume: message.volume || message.v?.volume || 0,
      ch: message.ch || message.v?.ch || 0,
      chp: message.chp || message.v?.chp || 0,
      bid_price: message.bid_price || message.v?.bid || 0,
      ask_price: message.ask_price || message.v?.ask || 0,
      last_traded_qty: message.last_traded_qty || 0,
      tot_buy_qty: message.tot_buy_qty || 0,
      tot_sell_qty: message.tot_sell_qty || 0,
      avg_trade_price: message.avg_trade_price || 0,
      low_price_range: message.low_price_range || 0,
      high_price_range: message.high_price_range || 0,
      lower_ckt: message.lower_ckt || 0,
      upper_ckt: message.upper_ckt || 0,
      original_name: message.original_name || message.v?.original_name || '',
    };
  }
}

/**
 * Create WebSocket client instance
 */
export function createWebSocketClient(accessToken: string): FyersWebSocketClient {
  return new FyersWebSocketClient(accessToken);
}
