'use client';

import { useFyersAuth, useFyersLogout } from '@/hooks/use-fyers-auth';
import { useFyersProfile, useFyersPositions, useFyersHoldings, useFyersFunds } from '@/hooks/use-fyers-portfolio';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, isLoading: sessionLoading } = useFyersAuth();
  const { data: profile, error: profileError, isLoading: profileLoading } = useFyersProfile(session?.authenticated || false);
  const { data: positions, error: positionsError, isLoading: positionsLoading } = useFyersPositions(session?.authenticated || false);
  const { data: holdings, error: holdingsError, isLoading: holdingsLoading } = useFyersHoldings(session?.authenticated || false);
  const { data: funds, error: fundsError, isLoading: fundsLoading } = useFyersFunds(session?.authenticated || false);
  const logout = useFyersLogout();
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    if (session?.authenticated) {
      console.log('Dashboard data:', {
        profile,
        positions,
        holdings,
        funds,
        errors: { profileError, positionsError, holdingsError, fundsError }
      });
    }
  }, [session, profile, positions, holdings, funds, profileError, positionsError, holdingsError, fundsError]);

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Zentrade
            </h1>
            {profile?.data && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {profile.data.name} ({profile.data.fy_id})
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/trade"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Trade
            </Link>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Debug Panel - Show API errors */}
          {(profileError || positionsError || holdingsError || fundsError) && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                API Errors Detected
              </h3>
              <div className="text-xs space-y-1 text-red-700 dark:text-red-300">
                {profileError && <div>Profile: {String(profileError)}</div>}
                {positionsError && <div>Positions: {String(positionsError)}</div>}
                {holdingsError && <div>Holdings: {String(holdingsError)}</div>}
                {fundsError && <div>Funds: {String(fundsError)}</div>}
              </div>
            </div>
          )}

          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total P&L"
              value={formatCurrency((positions?.overall?.pl_total || 0) + (holdings?.overall?.total_pnl || 0))}
              change={(positions?.overall?.pl_total || 0) + (holdings?.overall?.total_pnl || 0)}
              icon="💰"
            />
            <SummaryCard
              title="Open Positions"
              value={positions?.overall?.count_open?.toString() || '0'}
              subtitle={`Unrealized: ${formatCurrency(positions?.overall?.pl_unrealized || 0)}`}
              icon="📊"
            />
            <SummaryCard
              title="Holdings Value"
              value={formatCurrency(holdings?.overall?.total_current_value || 0)}
              subtitle={`Investment: ${formatCurrency(holdings?.overall?.total_investment || 0)}`}
              icon="💼"
            />
            <SummaryCard
              title="Available Funds"
              value={formatCurrency(funds?.fund_limit?.[0]?.equityAmount || 0)}
              subtitle="Equity"
              icon="💵"
            />
          </div>

          {/* Positions Section */}
          <div className="p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Positions
            </h3>
            {positions?.netPositions && positions.netPositions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Symbol</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Qty</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Avg Price</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">LTP</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">P&L</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {positions.netPositions.map((position) => (
                      <tr key={position.id} className="text-zinc-900 dark:text-zinc-100">
                        <td className="py-3 font-medium">{position.symbol}</td>
                        <td className="py-3">{position.netQty}</td>
                        <td className="py-3">{formatCurrency(position.avgPrice)}</td>
                        <td className="py-3">{formatCurrency(position.ltp)}</td>
                        <td className={`py-3 font-medium ${position.pl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(position.pl)}
                        </td>
                        <td className="py-3 text-xs">
                          <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
                            {position.productType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                No open positions
              </div>
            )}
          </div>

          {/* Holdings Section */}
          <div className="p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Holdings
            </h3>
            {holdings?.holdings && holdings.holdings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Symbol</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Qty</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Avg Cost</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">LTP</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">Current Value</th>
                      <th className="pb-3 font-medium text-zinc-600 dark:text-zinc-400">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {holdings.holdings.map((holding) => (
                      <tr key={holding.fyToken} className="text-zinc-900 dark:text-zinc-100">
                        <td className="py-3 font-medium">{holding.symbol}</td>
                        <td className="py-3">{holding.quantity}</td>
                        <td className="py-3">{formatCurrency(holding.costPrice)}</td>
                        <td className="py-3">{formatCurrency(holding.ltp)}</td>
                        <td className="py-3">{formatCurrency(holding.marketVal)}</td>
                        <td className={`py-3 font-medium ${holding.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(holding.pnl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                No holdings
              </div>
            )}
          </div>

          {/* Funds Section */}
          {funds?.fund_limit && funds.fund_limit.length > 0 && (
            <div className="p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                Fund Limits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {funds.fund_limit.map((fund) => (
                  <div key={fund.id} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                    <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                      {fund.title}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">Equity:</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(fund.equityAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">Commodity:</span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(fund.commodityAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  change,
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  icon?: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{title}</div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-zinc-500 dark:text-zinc-500">{subtitle}</div>
      )}
      {change !== undefined && (
        <div className={`text-xs font-medium mt-1 ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}
        </div>
      )}
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
