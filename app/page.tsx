'use client';

import { useFyersAuth, useFyersLogin } from '@/hooks/use-fyers-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, isLoading } = useFyersAuth();
  const login = useFyersLogin();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (session?.authenticated) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8 px-6 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
            Zentrade
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Professional Trading Platform
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Powered by Fyers API v3
          </p>
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={() => login.mutate()}
            disabled={login.isPending}
            className="w-full h-12 px-6 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {login.isPending ? 'Authenticating...' : 'Login with Fyers'}
          </button>

          {login.isPending && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm text-center">
              Please complete authentication in the popup window
            </div>
          )}

          <a
            href="/auth/manual"
            className="w-full h-12 px-6 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
          >
            Manual Authentication
          </a>

          {login.isError && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {login.error?.message || 'Failed to login. Please try again.'}
            </div>
          )}
        </div>

        <div className="space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Features
            </h2>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
              <li>• Real-time market data</li>
              <li>• Live order placement</li>
              <li>• Portfolio tracking</li>
              <li>• Historical charts</li>
              <li>• WebSocket updates</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Secure authentication with httpOnly cookies
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
              Using paper trading environment by default
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
