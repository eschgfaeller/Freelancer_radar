'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
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
            Sign in to track your earnings
          </p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-3 block">📧</span>
            <h2 className="text-lg font-bold text-emerald-800 mb-1">
              Check your email
            </h2>
            <p className="text-sm text-emerald-700">
              We sent a magic link to{' '}
              <span className="font-semibold">{email}</span>. Click it to sign
              in.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-emerald-600 font-medium underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              disabled={loading || !email}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
