'use client';

import { useState, useEffect } from 'react';
import { formatCHF } from '@/lib/calculations';

interface ScenarioSliderProps {
  workedDays: number;
  remainingWorkdays: number;
  dailyNet: number;
}

export default function ScenarioSlider({
  workedDays,
  remainingWorkdays,
  dailyNet,
}: ScenarioSliderProps) {
  const maxDays = workedDays + remainingWorkdays;
  const [scenarioDays, setScenarioDays] = useState(maxDays);

  // Sync when props change (month navigation, status changes)
  useEffect(() => {
    setScenarioDays(maxDays);
  }, [maxDays]);

  const scenarioEarnings = scenarioDays * dailyNet;
  const daysOff = maxDays - scenarioDays;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💡</span>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          What If...
        </h3>
      </div>

      <label className="block text-sm text-gray-600 mb-3">
        Work days this month:{' '}
        <span className="text-lg font-bold text-gray-900">{scenarioDays}</span>
      </label>

      <input
        type="range"
        min={0}
        max={maxDays > 0 ? maxDays : 1}
        value={scenarioDays}
        onChange={(e) => setScenarioDays(parseInt(e.target.value))}
        className="w-full cursor-pointer"
      />

      <div className="flex justify-between text-[11px] text-gray-400 mt-1 mb-4">
        <span>0 days</span>
        <span>{maxDays} days</span>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Scenario Earnings
        </p>
        <p className="text-2xl font-bold text-emerald-600 mt-1">
          {formatCHF(scenarioEarnings)}
        </p>
        {daysOff > 0 && (
          <p className="text-sm text-red-500 mt-1">
            −{daysOff} day{daysOff !== 1 ? 's' : ''} = −
            {formatCHF(daysOff * dailyNet)}
          </p>
        )}
      </div>
    </div>
  );
}
