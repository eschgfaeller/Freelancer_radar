'use client';

import { formatCHF } from '@/lib/calculations';

interface EarningsHeroProps {
  totalEarned: number;
  workedDays: number;
}

export default function EarningsHero({
  totalEarned,
  workedDays,
}: EarningsHeroProps) {
  return (
    <div className="text-center py-6 px-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
        Total Earned
      </p>
      <p className="text-5xl font-extrabold text-gray-900 tracking-tight">
        {formatCHF(totalEarned)}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        {workedDays} day{workedDays !== 1 ? 's' : ''} worked this month
      </p>
    </div>
  );
}
