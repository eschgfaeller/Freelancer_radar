'use client';

import { useMemo } from 'react';
import { DayStatus, MonthData } from '@/lib/types';
import { useAppData } from '@/components/DataProvider';

export function useDayData(year: number, month: number) {
  const { days, loading, setDayStatus, bulkSetStatus } = useAppData();

  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;

  const data = useMemo(() => {
    const result: MonthData = {};
    for (const [key, status] of Object.entries(days)) {
      if (key.startsWith(prefix)) result[key] = status;
    }
    return result;
  }, [days, prefix]);

  return { data, loading, setDayStatus, bulkSetStatus };
}
