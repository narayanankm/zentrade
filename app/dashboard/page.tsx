'use client';

import { useFyersAuth, useFyersLogout } from '@/hooks/use-fyers-auth';
import { useFyersProfile } from '@/hooks/use-fyers-portfolio';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, isLoading: sessionLoading } = useFyersAuth();
  const { data: profile } = useFyersProfile(session?.authenticated || false);
  const logout = useFyersLogout();
  const router = useRouter();

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

          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {logout.isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <div className="p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
              Welcome to Zentrade
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your Fyers API v3 integration is ready! Here's what you can do next:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              title="Market Data"
              description="View real-time quotes, market depth, and historical data for stocks and indices."
              status="Ready"
            />
            <FeatureCard
              title="Order Placement"
              description="Place, modify, and cancel orders with market and limit order types."
              status="Ready"
            />
            <FeatureCard
              title="Portfolio"
              description="Track your positions, holdings, and fund limits in real-time."
              status="Ready"
            />
            <FeatureCard
              title="Watchlist"
              description="Create and manage your personalized watchlist of symbols."
              status="Pending"
            />
            <FeatureCard
              title="Charts"
              description="View historical price charts with multiple timeframes."
              status="Pending"
            />
            <FeatureCard
              title="WebSocket"
              description="Get real-time updates via WebSocket connection."
              status="Pending"
            />
          </div>

          {/* API Status */}
          <div className="p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              API Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Environment:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  Paper Trading
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Session Status:</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></span>
                  Active
                </span>
              </div>
              {session.expiresAt && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Expires:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(session.expiresAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 text-white">
            <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">1.</span>
                <span>Build UI components for market data display (watchlist, quotes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">2.</span>
                <span>Create order placement forms with validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">3.</span>
                <span>Add portfolio visualization (positions, holdings, P&L)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">4.</span>
                <span>Integrate WebSocket for real-time updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400">5.</span>
                <span>Add charts using a charting library (e.g., lightweight-charts)</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: 'Ready' | 'Pending';
}) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            status === 'Ready'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
