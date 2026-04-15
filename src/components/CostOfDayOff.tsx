'use client';

import { formatCHF } from '@/lib/calculations';

interface CostOfDayOffProps {
  dailyNet: number;
}

export default function CostOfDayOff({ dailyNet }: CostOfDayOffProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="text-sm font-medium text-amber-800">
            Cost of a Day Off
          </p>
          <p className="text-xl font-bold text-amber-900">
            1 day off ={' '}
            <span className="text-red-600">−{formatCHF(dailyNet)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
