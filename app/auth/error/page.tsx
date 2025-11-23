'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get('message') || 'An error occurred during authentication';

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md px-6">
        <div className="rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="text-4xl">⚠️</div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Authentication Error
            </h1>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400">{message}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full h-12 px-6 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Back to Home
            </button>

            <button
              onClick={() => router.back()}
              className="w-full h-12 px-6 rounded-lg border border-zinc-200 dark:border-zinc-800 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Go Back
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              If the problem persists, please check:
            </p>
            <ul className="text-sm text-zinc-500 dark:text-zinc-500 mt-2 space-y-1">
              <li>• Your Fyers API credentials are correct</li>
              <li>• TOTP authentication is enabled</li>
              <li>• Redirect URI matches your app settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
