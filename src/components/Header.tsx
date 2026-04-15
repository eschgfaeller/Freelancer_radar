'use client';

import Link from 'next/link';

export default function Header() {
  const currentYear = new Date().getFullYear();

  return (
    <header className="sticky top-0 z-30 bg-emerald-600 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h1 className="text-lg font-bold tracking-tight">Earnings Radar</h1>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/year/${currentYear}`}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-emerald-500 active:bg-emerald-700 transition-colors"
            aria-label="Year Summary"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 20V10M12 20V4M6 20V14" />
            </svg>
          </Link>
          <Link
            href="/settings"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-emerald-500 active:bg-emerald-700 transition-colors"
            aria-label="Settings"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
