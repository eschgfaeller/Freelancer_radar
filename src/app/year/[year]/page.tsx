'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';
import { useYearData } from '@/hooks/useYearData';
import {
  getMonthStats,
  getDailyNet,
  formatCHF,
  getMonthDays,
  formatDateKey,
  isWeekend,
} from '@/lib/calculations';
import { getSwissHolidays } from '@/lib/holidays';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const VACATION_ALLOWANCE = 25; // Swiss standard: 5 weeks

export default function YearPage() {
  const router = useRouter();
  const params = useParams();
  const year = parseInt(params.year as string) || new Date().getFullYear();

  const [settings] = useSettings();
  const monthsData = useYearData(year);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const isCurrentYear = year === currentYear;
  const isFuture = year > currentYear;

  const dailyNet = getDailyNet(settings);

  // Per-month stats (reuses the same engine as the monthly view)
  const monthStats = useMemo(
    () => monthsData.map((data, m) => getMonthStats(year, m, data, settings)),
    [year, monthsData, settings]
  );

  // Aggregated year totals
  const yr = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let worked = 0;
    let vacation = 0;
    let sick = 0;
    let holidays = 0;
    let free = 0;
    let earned = 0;
    let expected = 0;
    let bestIdx = 0;
    let bestEarned = 0;

    monthStats.forEach((s, i) => {
      worked += s.workedDays;
      vacation += s.vacationDays;
      sick += s.sickDays;
      holidays += s.holidayDays;
      free += s.freeDays;
      earned += s.totalEarned;
      expected += s.expectedTotal;
      if (s.totalEarned > bestEarned) {
        bestEarned = s.totalEarned;
        bestIdx = i;
      }
    });

    // Available workdays in the full year and elapsed portion
    const swissHolidays = getSwissHolidays(year);
    let elapsedAvail = 0;
    let totalAvail = 0;
    const cutoff = isCurrentYear
      ? today
      : new Date(year, 11, 31, 23, 59, 59);

    for (let m = 0; m < 12; m++) {
      for (const day of getMonthDays(year, m)) {
        const key = formatDateKey(day);
        const avail = !isWeekend(day) && !swissHolidays.includes(key);
        if (avail) {
          totalAvail++;
          if (day <= cutoff) elapsedAvail++;
        }
      }
    }

    const utilization =
      elapsedAvail > 0 ? (worked / elapsedAvail) * 100 : 0;
    const monthsElapsed = isCurrentYear ? currentMonth + 1 : 12;
    const avgMonthly = monthsElapsed > 0 ? earned / monthsElapsed : 0;
    const gross = worked * settings.dailyRate;

    return {
      worked,
      vacation,
      sick,
      holidays,
      free,
      earned,
      expected,
      utilization,
      avgMonthly,
      gross,
      totalAvail,
      elapsedAvail,
      bestIdx,
      bestEarned,
    };
  }, [monthStats, year, isCurrentYear, currentMonth, settings.dailyRate]);

  // Bar chart normalization
  const maxBar = useMemo(
    () => Math.max(...monthStats.map((s) => s.expectedTotal), 1),
    [monthStats]
  );

  const goYear = (y: number) => router.replace(`/year/${y}`);

  const fmtCompact = (n: number): string => {
    if (n === 0) return '\u2014';
    return Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  const vacUsed = yr.vacation;
  const vacRemaining = Math.max(0, VACATION_ALLOWANCE - vacUsed);
  const vacPct = Math.min(100, (vacUsed / VACATION_ALLOWANCE) * 100);
  const vacOver = vacUsed > VACATION_ALLOWANCE;

  const showForecast = isCurrentYear || isFuture;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-emerald-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-emerald-500 active:bg-emerald-700 transition-colors"
            aria-label="Back to dashboard"
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
          </Link>
          <h1 className="text-lg font-bold">Year Summary</h1>
        </div>
      </header>

      {/* ── Year Selector ── */}
      <div className="flex items-center justify-between px-6 py-3 max-w-lg mx-auto">
        <button
          onClick={() => goYear(year - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Previous year"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">{year}</h2>
        <button
          onClick={() => goYear(year + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Next year"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <main className="max-w-lg mx-auto px-4 space-y-4">
        {/* ── Hero: Total Earned ── */}
        <div className="text-center py-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {showForecast ? 'Earned So Far' : 'Year Earnings'}
          </p>
          <p className="text-5xl font-extrabold text-gray-900 tracking-tight">
            {formatCHF(yr.earned)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {yr.worked} day{yr.worked !== 1 ? 's' : ''} worked
          </p>
        </div>

        {/* ── Forecast Card ── */}
        {showForecast && yr.expected > yr.earned && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📈</span>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Expected Year Total
              </h3>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {formatCHF(yr.expected)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              If you work all {yr.totalAvail - yr.elapsedAvail + (monthStats[currentMonth]?.remainingWorkdays || 0) > 0
                ? `${yr.totalAvail - (yr.elapsedAvail - (isCurrentYear ? monthStats[currentMonth]?.remainingWorkdays || 0 : 0))} remaining`
                : yr.totalAvail}{' '}
              workdays at {formatCHF(dailyNet)}/day
            </p>
            {/* Year progress bar */}
            {isCurrentYear && (
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Jan</span>
                  <span>{Math.round((yr.earned / yr.expected) * 100)}% earned</span>
                  <span>Dec</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (yr.earned / yr.expected) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Vacation Balance ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏖️</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Vacation Balance
            </h3>
          </div>
          <div className="flex justify-between items-end mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {vacUsed}{' '}
              <span className="text-base font-normal text-gray-400">
                / {VACATION_ALLOWANCE} days
              </span>
            </p>
            <p className={`text-sm font-medium ${
              vacOver ? 'text-red-500' : 'text-blue-600'
            }`}>
              {vacOver
                ? `${vacUsed - VACATION_ALLOWANCE} over`
                : `${vacRemaining} remaining`}
            </p>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                vacOver ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${vacPct}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Based on 5 weeks (25 days) Swiss standard allowance
          </p>
        </div>

        {/* ── Year Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '💼', value: yr.worked, label: 'Worked', color: 'text-emerald-600' },
            { icon: '🏖️', value: yr.vacation, label: 'Vacation', color: 'text-blue-600' },
            { icon: '🤒', value: yr.sick, label: 'Sick', color: 'text-red-600' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-center"
            >
              <span className="text-lg">{s.icon}</span>
              <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🎉', value: yr.holidays, label: 'Holidays', color: 'text-purple-600' },
            {
              icon: '📈',
              value: `${Math.round(yr.utilization)}%`,
              label: 'Utilization',
              color: yr.utilization >= 80 ? 'text-emerald-600' : yr.utilization >= 50 ? 'text-amber-600' : 'text-red-600',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-center"
            >
              <span className="text-lg">{s.icon}</span>
              <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Monthly Breakdown ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📅</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Monthly Breakdown
            </h3>
          </div>

          <div className="space-y-1.5">
            {monthStats.map((s, i) => {
              const isPastMonth =
                year < currentYear || (isCurrentYear && i < currentMonth);
              const isThisMonth = isCurrentYear && i === currentMonth;
              const isFutureMonth =
                year > currentYear || (isCurrentYear && i > currentMonth);

              const actualPct = (s.totalEarned / maxBar) * 100;
              const forecastPct =
                ((s.expectedTotal - s.totalEarned) / maxBar) * 100;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
                    isThisMonth
                      ? 'bg-emerald-50 ring-1 ring-emerald-200'
                      : ''
                  }`}
                >
                  <span className="w-7 text-[11px] font-bold text-gray-500 shrink-0">
                    {MONTHS[i]}
                  </span>

                  {/* Stacked bar */}
                  <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden flex">
                    {actualPct > 0 && (
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${actualPct}%` }}
                      />
                    )}
                    {forecastPct > 0 && (
                      <div
                        className="h-full bg-emerald-200"
                        style={{ width: `${forecastPct}%` }}
                      />
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-bold text-right w-[60px] shrink-0 ${
                      isFutureMonth ? 'text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {fmtCompact(s.expectedTotal)}
                  </span>
                  <span className="text-[10px] text-gray-400 text-right w-5 shrink-0">
                    {isPastMonth || isThisMonth
                      ? `${s.workedDays}d`
                      : isFutureMonth && s.expectedTotal > 0
                        ? `~${s.remainingWorkdays}d`
                        : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-[11px] text-gray-500">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-200" />
              <span className="text-[11px] text-gray-500">Forecast</span>
            </div>
          </div>
        </div>

        {/* ── Insights ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💡</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Insights
            </h3>
          </div>

          <div className="space-y-3">
            {/* Average Monthly */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Monthly Net</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCHF(yr.avgMonthly)}
              </span>
            </div>
            <div className="border-t border-gray-50" />

            {/* Best Month */}
            {yr.bestEarned > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Month</span>
                  <span className="text-sm font-bold text-gray-900">
                    {MONTHS_FULL[yr.bestIdx]} ({formatCHF(yr.bestEarned)})
                  </span>
                </div>
                <div className="border-t border-gray-50" />
              </>
            )}

            {/* Gross Invoiced */}
            {yr.gross > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Gross Invoiced
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCHF(yr.gross)}
                  </span>
                </div>
                <div className="border-t border-gray-50" />
              </>
            )}

            {/* Available Workdays */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Available Workdays
              </span>
              <span className="text-sm font-bold text-gray-900">
                {yr.totalAvail} days
              </span>
            </div>
            <div className="border-t border-gray-50" />

            {/* Max Potential */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Year Potential</span>
              <span className="text-sm font-bold text-emerald-600">
                {formatCHF(yr.totalAvail * dailyNet)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Tax Hint ── */}
        {yr.gross > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🧾</span>
              <div>
                <p className="text-sm font-medium text-blue-800">Tax Reminder</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  You invoiced{' '}
                  <span className="font-bold">{formatCHF(yr.gross)}</span>{' '}
                  gross this year. After your {Math.round(settings.netRatio * 100)}%
                  net ratio, your take-home is{' '}
                  <span className="font-bold">{formatCHF(yr.earned)}</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
