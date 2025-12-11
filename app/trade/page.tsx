'use client';

import { useFyersAuth } from '@/hooks/use-fyers-auth';
import { usePlaceOrder, useFyersQuotes, useFyersOrders } from '@/hooks/use-fyers-trading';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TradePage() {
  const { data: session, isLoading: sessionLoading } = useFyersAuth();
  const { data: orders } = useFyersOrders(session?.authenticated || false);
  const placeOrder = usePlaceOrder();
  const router = useRouter();

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState<1 | 2>(2); // 1=Limit, 2=Market
  const [side, setSide] = useState<1 | -1>(1); // 1=Buy, -1=Sell
  const [productType, setProductType] = useState<'INTRADAY' | 'CNC' | 'MARGIN'>('INTRADAY');
  const [limitPrice, setLimitPrice] = useState('');
  const [showQuote, setShowQuote] = useState(false);

  // Fetch quote for the symbol
  const { data: quotes } = useFyersQuotes(
    showQuote && symbol ? [symbol] : [],
    showQuote && !!symbol
  );

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      router.push('/');
    }
  }, [session, sessionLoading, router]);

  if (sessionLoading || !session?.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await placeOrder.mutateAsync({
        symbol,
        qty: parseInt(quantity),
        type: orderType,
        side,
        productType,
        limitPrice: orderType === 1 ? parseFloat(limitPrice) : undefined,
        validity: 'DAY',
      });

      // Reset form on success
      setSymbol('');
      setQuantity('');
      setLimitPrice('');
      setShowQuote(false);

      alert('Order placed successfully!');
    } catch (error) {
      alert(`Error placing order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const currentQuote = quotes?.d?.[0];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Trade
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Form */}
          <div className="p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Place Order
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Symbol */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Symbol
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="e.g., NSE:SBIN-EQ"
                    className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowQuote(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Get Quote
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Format: EXCHANGE:SYMBOL-TYPE (e.g., NSE:RELIANCE-EQ, NSE:NIFTY50-INDEX)
                </p>
              </div>

              {/* Quote Display */}
              {currentQuote && currentQuote.s === 'ok' && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {currentQuote.v.short_name}
                      </div>
                      <div className="text-xs text-zinc-500">{currentQuote.v.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        ₹{currentQuote.v.lp.toFixed(2)}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          currentQuote.v.ch >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {currentQuote.v.ch >= 0 ? '+' : ''}
                        {currentQuote.v.ch.toFixed(2)} ({currentQuote.v.chp.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy/Sell */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Action
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSide(1)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      side === 1
                        ? 'bg-green-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide(-1)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      side === -1
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="1"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType(2)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      orderType === 2
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    Market
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType(1)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      orderType === 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {/* Limit Price (only for limit orders) */}
              {orderType === 1 && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Limit Price
                  </label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder="Enter limit price"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Product Type
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as 'INTRADAY' | 'CNC' | 'MARGIN')}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INTRADAY">Intraday (MIS)</option>
                  <option value="CNC">Delivery (CNC)</option>
                  <option value="MARGIN">Margin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={placeOrder.isPending}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  side === 1
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {placeOrder.isPending
                  ? 'Placing Order...'
                  : `Place ${side === 1 ? 'Buy' : 'Sell'} Order`}
              </button>

              {placeOrder.isError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {placeOrder.error?.message || 'Failed to place order'}
                </div>
              )}
            </form>
          </div>

          {/* Recent Orders */}
          <div className="p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Recent Orders
            </h2>
            {orders?.orderBook && orders.orderBook.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {orders.orderBook.slice(0, 10).map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {order.symbol}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {new Date(order.orderDateTime).toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === 2
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : order.status === 1
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {order.status === 2
                          ? 'Traded'
                          : order.status === 1
                          ? 'Cancelled'
                          : order.status === 5
                          ? 'Pending'
                          : 'Other'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-zinc-500">Side:</span>{' '}
                        <span
                          className={`font-medium ${
                            order.side === 1
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {order.side === 1 ? 'Buy' : 'Sell'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Qty:</span>{' '}
                        <span className="text-zinc-900 dark:text-zinc-100">{order.qty}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Type:</span>{' '}
                        <span className="text-zinc-900 dark:text-zinc-100">
                          {order.type === 1 ? 'Limit' : order.type === 2 ? 'Market' : 'Other'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Product:</span>{' '}
                        <span className="text-zinc-900 dark:text-zinc-100">
                          {order.productType}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                No orders yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
