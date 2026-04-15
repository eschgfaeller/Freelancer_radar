'use client';

import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useSettings';
import { formatCHF } from '@/lib/calculations';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useSettings();

  const dailyNet = settings.dailyRate * settings.netRatio;

  const updateSetting = (key: keyof typeof settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-emerald-600 text-white px-4 pt-safe pb-3 shadow-lg">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-emerald-500 active:bg-emerald-700 transition-colors"
            aria-label="Go back"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Daily Rate */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Daily Rate (CHF)
          </label>
          <input
            type="number"
            value={settings.dailyRate}
            onChange={(e) =>
              updateSetting('dailyRate', parseFloat(e.target.value) || 0)
            }
            className="w-full text-3xl font-bold text-gray-900 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
            min={0}
            step={50}
          />
        </div>

        {/* Net Ratio */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Net Ratio (%)
          </label>
          <input
            type="number"
            value={Math.round(settings.netRatio * 100)}
            onChange={(e) =>
              updateSetting(
                'netRatio',
                (parseFloat(e.target.value) || 0) / 100
              )
            }
            className="w-full text-3xl font-bold text-gray-900 bg-gray-50 rounded-xl px-4 py-3 border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
            min={0}
            max={100}
            step={1}
          />
          <p className="text-sm text-gray-500 mt-2">
            Percentage you keep after taxes, social insurance, and other
            deductions.
          </p>
        </div>

        {/* Computed Daily Net */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💰</span>
            <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">
              Your Daily Net
            </p>
          </div>
          <p className="text-3xl font-bold text-emerald-700">
            {formatCHF(dailyNet)}
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            {formatCHF(settings.dailyRate)} ×{' '}
            {Math.round(settings.netRatio * 100)}% = {formatCHF(dailyNet)}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5">ℹ️</span>
            <p className="text-sm text-blue-800">
              These settings affect all calculations across the app. Changes are
              saved automatically to your device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
