'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManualAuthPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Extract auth_code from the URL
      const urlObj = new URL(url);
      const authCode = urlObj.searchParams.get('auth_code');
      const state = urlObj.searchParams.get('state');

      if (!authCode) {
        throw new Error('No auth_code found in the URL');
      }

      // Call the callback API with the auth_code
      const callbackUrl = new URL('/api/fyers/callback', window.location.origin);
      callbackUrl.searchParams.set('auth_code', authCode);
      if (state) {
        callbackUrl.searchParams.set('state', state);
      }

      // Redirect to callback endpoint
      window.location.href = callbackUrl.toString();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL format');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Manual Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Paste the Google redirect URL here
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="auth-url" className="sr-only">
                Authentication URL
              </label>
              <textarea
                id="auth-url"
                name="auth-url"
                rows={4}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Paste the entire Google URL here (https://www.google.com/?s=ok&code=200&auth_code=...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Authentication'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <a
            href="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
