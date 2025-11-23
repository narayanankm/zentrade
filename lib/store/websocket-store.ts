/**
 * WebSocket State Management Store
 * Manages WebSocket connection and real-time data
 */

'use client';

import { create } from 'zustand';
import type { FyersWebSocketClient, WebSocketQuoteData } from '@/lib/fyers/websocket';

interface WebSocketStore {
  // Connection state
  isConnected: boolean;
  client: FyersWebSocketClient | null;
  error: string | null;

  // Real-time quotes
  quotes: Map<string, WebSocketQuoteData>;

  // Actions
  setClient: (client: FyersWebSocketClient) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  updateQuote: (symbol: string, data: WebSocketQuoteData) => void;
  getQuote: (symbol: string) => WebSocketQuoteData | undefined;
  clearQuotes: () => void;
  reset: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  // Initial state
  isConnected: false,
  client: null,
  error: null,
  quotes: new Map(),

  // Actions
  setClient: (client) => set({ client }),

  setConnected: (connected) => set({ isConnected: connected }),

  setError: (error) => set({ error }),

  updateQuote: (symbol, data) =>
    set((state) => {
      const newQuotes = new Map(state.quotes);
      newQuotes.set(symbol, data);
      return { quotes: newQuotes };
    }),

  getQuote: (symbol) => get().quotes.get(symbol),

  clearQuotes: () => set({ quotes: new Map() }),

  reset: () =>
    set({
      isConnected: false,
      client: null,
      error: null,
      quotes: new Map(),
    }),
}));
