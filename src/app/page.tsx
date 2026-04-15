'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MonthSelector from '@/components/MonthSelector';
import EarningsHero from '@/components/EarningsHero';
import ForecastCard from '@/components/ForecastCard';
import Calendar from '@/components/Calendar';
import StatsGrid from '@/components/StatsGrid';
import CostOfDayOff from '@/components/CostOfDayOff';
import ScenarioSlider from '@/components/ScenarioSlider';
import StatusPicker from '@/components/StatusPicker';
import BulkChangeSheet from '@/components/BulkChangeSheet';
import { useSettings } from '@/hooks/useSettings';
import { useDayData } from '@/hooks/useDayData';
import { getMonthStats } from '@/lib/calculations';
import { DayStatus } from '@/lib/types';

export default function Home() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);

  const [settings] = useSettings();
  const { data, setDayStatus, bulkSetStatus } = useDayData(year, month);

  const stats = useMemo(
    () => getMonthStats(year, month, data, settings),
    [year, month, data, settings]
  );

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleStatusSelect = (dateKey: string, status: DayStatus | 'none') => {
    setDayStatus(dateKey, status);
  };

  const handleBulkApply = (dateKeys: string[], status: DayStatus | 'none') => {
    bulkSetStatus(dateKeys, status);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />

      <main className="max-w-lg mx-auto">
        <EarningsHero
          totalEarned={stats.totalEarned}
          workedDays={stats.workedDays}
        />

        <MonthSelector
          year={year}
          month={month}
          onChange={handleMonthChange}
        />

        <div className="px-4 space-y-4">
          <ForecastCard
            expectedTotal={stats.expectedTotal}
            remainingWorkdays={stats.remainingWorkdays}
            dailyNet={stats.dailyNet}
          />

          <Calendar
            year={year}
            month={month}
            data={data}
            onDayClick={(key) => setSelectedDay(key)}
          />

          {/* Bulk Change trigger */}
          <button
            onClick={() => setShowBulk(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 font-medium text-sm hover:border-emerald-400 hover:text-emerald-600 active:scale-[0.98] transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Bulk Change
          </button>

          <StatsGrid
            workedDays={stats.workedDays}
            vacationDays={stats.vacationDays}
            sickDays={stats.sickDays}
            holidayDays={stats.holidayDays}
            remainingWorkdays={stats.remainingWorkdays}
          />

          <CostOfDayOff dailyNet={stats.dayOffCost} />

          <ScenarioSlider
            workedDays={stats.workedDays}
            remainingWorkdays={stats.remainingWorkdays}
            dailyNet={stats.dailyNet}
          />
        </div>
      </main>

      {selectedDay && (
        <StatusPicker
          dateKey={selectedDay}
          currentStatus={data[selectedDay]}
          onSelect={handleStatusSelect}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {showBulk && (
        <BulkChangeSheet
          year={year}
          month={month}
          onApply={handleBulkApply}
          onClose={() => setShowBulk(false)}
        />
      )}
    </div>
  );
}
