'use client';

import { useEffect } from 'react';

export default function AuthSuccessPage() {
  useEffect(() => {
    // Close the window after a short delay
    const timer = setTimeout(() => {
      if (window.opener) {
        // If this is a popup, close it
        window.close();
      } else {
        // If not a popup, redirect to dashboard
        window.location.href = '/dashboard';
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="text-center space-y-4 p-8">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Authentication Successful!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          You can close this window now.
        </p>
        <div className="text-sm text-zinc-500">
          This window will close automatically...
        </div>
      </div>
    </div>
  );
}
