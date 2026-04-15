'use client';

import { DayStatus } from '@/lib/types';
import { STATUS_LABELS, STATUS_ICONS } from '@/lib/constants';

interface StatusPickerProps {
  dateKey: string;
  currentStatus?: DayStatus;
  onSelect: (dateKey: string, status: DayStatus | 'none') => void;
  onClose: () => void;
}

const STATUSES: DayStatus[] = ['worked', 'vacation', 'sick', 'holiday', 'free'];

export default function StatusPicker({
  dateKey,
  currentStatus,
  onSelect,
  onClose,
}: StatusPickerProps) {
  // Parse date for display (add T12:00:00 to avoid timezone shifts)
  const date = new Date(dateKey + 'T12:00:00');
  const displayDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 pb-10 safe-bottom animate-slide-up">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        <h3 className="text-lg font-semibold text-center mb-1">
          {displayDate}
        </h3>

        {currentStatus && (
          <p className="text-sm text-gray-500 text-center mb-3">
            Currently: {STATUS_ICONS[currentStatus]}{' '}
            {STATUS_LABELS[currentStatus]}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => {
                onSelect(dateKey, status);
                onClose();
              }}
              className={`
                flex items-center gap-3 p-4 rounded-2xl border-2 transition-all
                active:scale-95
                ${
                  currentStatus === status
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-2xl">{STATUS_ICONS[status]}</span>
              <span className="font-medium text-gray-900">
                {STATUS_LABELS[status]}
              </span>
            </button>
          ))}

          {/* Clear / Reset button */}
          {currentStatus && (
            <button
              onClick={() => {
                onSelect(dateKey, 'none');
                onClose();
              }}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-red-200 text-red-600 hover:border-red-300 active:scale-95 transition-all"
            >
              <span className="text-2xl">✕</span>
              <span className="font-medium">Clear</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
