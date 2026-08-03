'use client';

import { useMemo } from 'react';
import { MonthData } from '@/lib/types';
import { useAppData } from '@/components/DataProvider';

export function useYearData(year: number): {
  months: MonthData[];
  loading: boolean;
} {
  const { days, loading } = useAppData();

  const months = useMemo(() => {
    const result: MonthData[] = Array.from({ length: 12 }, () => ({}));
    const prefix = `${year}-`;
    for (const [key, status] of Object.entries(days)) {
      if (!key.startsWith(prefix)) continue;
      const m = parseInt(key.split('-')[1], 10) - 1;
      if (m >= 0 && m < 12) result[m][key] = status;
    }
    return result;
  }, [days, year]);

  return { months, loading };
}
