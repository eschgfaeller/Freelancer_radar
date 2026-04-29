'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) {
      setError(authError.message);
      setGoogleLoading(false);
    }
  };

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
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-3 block">📧</span>
            <h2 className="text-lg font-bold text-blue-800 mb-1">
              Check your email
            </h2>
            <p className="text-sm text-blue-700">
              We sent a magic link to{' '}
              <span className="font-semibold">{email}</span>. Click it to sign
              in.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-blue-600 font-medium underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border-2 border-gray-200 text-gray-800 font-semibold text-base hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Magic link form */}
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
                  className="w-full text-lg text-gray-900 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading || !email}
                className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
