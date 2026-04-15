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
import { useSettings } from '@/hooks/useSettings';
import { useDayData } from '@/hooks/useDayData';
import { getMonthStats } from '@/lib/calculations';
import { DayStatus } from '@/lib/types';

export default function Home() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [settings] = useSettings();
  const { data, setDayStatus } = useDayData(year, month);

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
    </div>
  );
}
