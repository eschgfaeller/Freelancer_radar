'use client';

import { useState, useEffect } from 'react';
import { MonthData } from '@/lib/types';

export function useYearData(year: number): MonthData[] {
  const [months, setMonths] = useState<MonthData[]>(() =>
    Array.from({ length: 12 }, () => ({}))
  );

  useEffect(() => {
    const data: MonthData[] = [];
    for (let m = 0; m < 12; m++) {
      const key = `freelancer-radar-${year}-${String(m + 1).padStart(2, '0')}`;
      try {
        const raw = window.localStorage.getItem(key);
        data.push(raw ? JSON.parse(raw) : {});
      } catch {
        data.push({});
      }
    }
    setMonths(data);
  }, [year]);

  return months;
}
