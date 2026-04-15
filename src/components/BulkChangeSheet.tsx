'use client';

import { useState, useMemo } from 'react';
import { DayStatus } from '@/lib/types';
import { formatDateKey, isWeekend } from '@/lib/calculations';
import { STATUS_LABELS, STATUS_ICONS } from '@/lib/constants';

type BulkAction = DayStatus | 'none';

interface BulkChangeSheetProps {
  year: number;
  month: number;
  onApply: (dateKeys: string[], status: BulkAction) => void;
  onClose: () => void;
}

const ACTIONS: { value: BulkAction; icon: string; label: string }[] = [
  { value: 'worked',   icon: STATUS_ICONS.worked,   label: STATUS_LABELS.worked },
  { value: 'vacation', icon: STATUS_ICONS.vacation,  label: STATUS_LABELS.vacation },
  { value: 'sick',     icon: STATUS_ICONS.sick,      label: STATUS_LABELS.sick },
  { value: 'holiday',  icon: STATUS_ICONS.holiday,   label: STATUS_LABELS.holiday },
  { value: 'free',     icon: STATUS_ICONS.free,      label: STATUS_LABELS.free },
  { value: 'none',     icon: '\u2715',              label: 'Clear' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function monthFirstDay(year: number, month: number) {
  return `${year}-${pad(month + 1)}-01`;
}

function monthLastDay(year: number, month: number) {
  const last = new Date(year, month + 1, 0).getDate();
  return `${year}-${pad(month + 1)}-${pad(last)}`;
}

export default function BulkChangeSheet({
  year,
  month,
  onApply,
  onClose,
}: BulkChangeSheetProps) {
  const [action, setAction] = useState<BulkAction | null>(null);
  const [fromDate, setFromDate] = useState(monthFirstDay(year, month));
  const [toDate, setToDate] = useState(monthLastDay(year, month));
  const [skipWeekends, setSkipWeekends] = useState(true);

  // Compute affected date keys
  const affectedKeys = useMemo(() => {
    const keys: string[] = [];
    const start = new Date(fromDate + 'T12:00:00');
    const end = new Date(toDate + 'T12:00:00');
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return keys;
    }
    const cursor = new Date(start);
    while (cursor <= end) {
      if (!skipWeekends || !isWeekend(cursor)) {
        keys.push(formatDateKey(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return keys;
  }, [fromDate, toDate, skipWeekends]);

  const handleApply = () => {
    if (action === null || affectedKeys.length === 0) return;
    onApply(affectedKeys, action);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-5 pb-8 safe-bottom animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        <h3 className="text-lg font-bold text-center mb-5">Bulk Change</h3>

        {/* Action selection */}
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Action
        </label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {ACTIONS.map((a) => (
            <button
              key={a.value}
              onClick={() => setAction(a.value)}
              className={`
                flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all
                active:scale-95 text-sm font-medium
                ${
                  action === a.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : a.value === 'none'
                      ? 'border-red-200 text-red-600 hover:border-red-300'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="text-lg">{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Date range */}
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Date Range
        </label>
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 font-medium text-sm focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 font-medium text-sm focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Skip weekends toggle */}
        <button
          onClick={() => setSkipWeekends((v) => !v)}
          className="flex items-center gap-3 w-full py-2 mb-5"
        >
          <div
            className={`
              w-10 h-6 rounded-full transition-colors relative
              ${skipWeekends ? 'bg-emerald-500' : 'bg-gray-300'}
            `}
          >
            <div
              className={`
                absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                ${skipWeekends ? 'translate-x-[18px]' : 'translate-x-0.5'}
              `}
            />
          </div>
          <span className="text-sm text-gray-700 font-medium">
            Skip weekends
          </span>
        </button>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-sm text-gray-600 text-center">
            {affectedKeys.length === 0 ? (
              <span className="text-gray-400">No days in range</span>
            ) : (
              <>
                Will update{' '}
                <span className="font-bold text-gray-900">
                  {affectedKeys.length}
                </span>{' '}
                day{affectedKeys.length !== 1 ? 's' : ''}
                {action !== null && (
                  <>
                    {' '}to{' '}
                    <span className="font-bold text-gray-900">
                      {action === 'none'
                        ? 'Clear'
                        : `${ACTIONS.find((a) => a.value === action)?.icon} ${ACTIONS.find((a) => a.value === action)?.label}`}
                    </span>
                  </>
                )}
              </>
            )}
          </p>
        </div>

        {/* Apply */}
        <button
          onClick={handleApply}
          disabled={action === null || affectedKeys.length === 0}
          className={`
            w-full py-3.5 rounded-2xl font-bold text-base transition-all
            ${action !== null && affectedKeys.length > 0
              ? 'bg-emerald-600 text-white active:scale-[0.98] hover:bg-emerald-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Apply Changes
        </button>
      </div>
    </>
  );
}
