/**
 * UI State Management Store
 * Manages UI-related state like modals, alerts, etc.
 */

'use client';

import { create } from 'zustand';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface UIStore {
  // Order placement modal
  isOrderModalOpen: boolean;
  orderModalSymbol: string | null;

  // Toasts/Alerts
  toasts: Toast[];

  // Market status
  showMarketStatus: boolean;

  // Actions
  openOrderModal: (symbol?: string) => void;
  closeOrderModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setShowMarketStatus: (show: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isOrderModalOpen: false,
  orderModalSymbol: null,
  toasts: [],
  showMarketStatus: true,

  // Actions
  openOrderModal: (symbol) =>
    set({
      isOrderModalOpen: true,
      orderModalSymbol: symbol || null,
    }),

  closeOrderModal: () =>
    set({
      isOrderModalOpen: false,
      orderModalSymbol: null,
    }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: Math.random().toString(36).substring(7),
        },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setShowMarketStatus: (show) => set({ showMarketStatus: show }),
}));
