/**
 * Watchlist State Management Store
 * Manages user's watchlist of symbols
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistItem {
  symbol: string;
  name: string;
  exchange: string;
  addedAt: number;
}

interface WatchlistStore {
  items: WatchlistItem[];

  // Actions
  addSymbol: (symbol: string, name: string, exchange: string) => void;
  removeSymbol: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  getSymbols: () => string[];
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],

      // Actions
      addSymbol: (symbol, name, exchange) =>
        set((state) => {
          // Don't add if already exists
          if (state.items.some((item) => item.symbol === symbol)) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                symbol,
                name,
                exchange,
                addedAt: Date.now(),
              },
            ],
          };
        }),

      removeSymbol: (symbol) =>
        set((state) => ({
          items: state.items.filter((item) => item.symbol !== symbol),
        })),

      isInWatchlist: (symbol) =>
        get().items.some((item) => item.symbol === symbol),

      getSymbols: () => get().items.map((item) => item.symbol),

      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: 'zentrade-watchlist',
    }
  )
);
