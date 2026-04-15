'use client';

import { useLocalStorage } from './useLocalStorage';
import { DayStatus, MonthData } from '@/lib/types';

export function useDayData(year: number, month: number) {
  const key = `freelancer-radar-${year}-${String(month + 1).padStart(2, '0')}`;
  const [data, setData] = useLocalStorage<MonthData>(key, {});

  const setDayStatus = (dateKey: string, status: DayStatus | 'none') => {
    setData((prev) => {
      const next = { ...prev };
      if (status === 'none') {
        delete next[dateKey];
      } else {
        next[dateKey] = status;
      }
      return next;
    });
  };

  return { data, setDayStatus };
}
