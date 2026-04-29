'use client';

import { formatCHF } from '@/lib/calculations';

interface ForecastCardProps {
  expectedTotal: number;
  remainingWorkdays: number;
  dailyNet: number;
}

export default function ForecastCard({
  expectedTotal,
  remainingWorkdays,
  dailyNet,
}: ForecastCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📈</span>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Expected This Month
        </h3>
      </div>
      <p className="text-3xl font-bold text-blue-600">
        {formatCHF(expectedTotal)}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Based on {remainingWorkdays} remaining workday
        {remainingWorkdays !== 1 ? 's' : ''} × {formatCHF(dailyNet)}/day
      </p>
    </div>
  );
}
