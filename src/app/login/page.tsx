'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">$</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Freelancer Radar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter the password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-lg text-gray-900 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
