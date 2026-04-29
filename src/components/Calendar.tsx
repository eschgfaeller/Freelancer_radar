'use client';

import { useMemo } from 'react';
import { MonthData, DayStatus } from '@/lib/types';
import { getMonthDays, formatDateKey, isWeekend } from '@/lib/calculations';
import { getSwissHolidays } from '@/lib/holidays';
import { STATUS_COLORS } from '@/lib/constants';

interface CalendarProps {
  year: number;
  month: number;
  data: MonthData;
  onDayClick: (dateKey: string) => void;
}

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const LEGEND_ITEMS: { key: string; label: string; swatch: string }[] = [
  { key: 'worked',   label: 'Worked',   swatch: 'bg-blue-500' },
  { key: 'sick',     label: 'Sick',     swatch: 'bg-red-500' },
  { key: 'vacation', label: 'Vacation', swatch: 'bg-gray-300' },
  { key: 'holiday',  label: 'Holiday',  swatch: 'bg-gray-300' },
  { key: 'free',     label: 'Free',     swatch: 'bg-gray-200' },
];

export default function Calendar({
  year,
  month,
  data,
  onDayClick,
}: CalendarProps) {
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const holidays = useMemo(() => getSwissHolidays(year), [year]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);

  // Monday = 0 column index
  const firstDay = days[0];
  const startPadding = (firstDay.getDay() + 6) % 7;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[11px] font-semibold text-gray-400 uppercase py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty padding cells */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const key = formatDateKey(day);
          const status = data[key] as DayStatus | undefined;
          const isToday = key === todayKey;
          const weekend = isWeekend(day);
          const isHoliday = holidays.includes(key);

          // Auto-show holiday for weekday holidays without a manual status
          const displayStatus =
            status || (isHoliday && !weekend ? 'holiday' : undefined);
          const colors = displayStatus
            ? STATUS_COLORS[displayStatus]
            : null;

          return (
            <button
              key={key}
              onClick={() => onDayClick(key)}
              className={`
                aspect-square flex items-center justify-center
                rounded-xl text-sm font-semibold transition-all active:scale-90
                ${isToday ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
                ${
                  colors
                    ? `${colors.bg} ${colors.text}`
                    : weekend
                      ? 'bg-gray-50 text-gray-300'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3 border-t border-gray-100">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${item.swatch}`} />
            <span className="text-[11px] text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
