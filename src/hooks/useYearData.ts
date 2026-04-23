'use client';

import { useState, useEffect } from 'react';
import { DayStatus, MonthData } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export function useYearData(year: number): {
  months: MonthData[];
  loading: boolean;
} {
  const { user } = useAuth();
  const [months, setMonths] = useState<MonthData[]>(() =>
    Array.from({ length: 12 }, () => ({}))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    setLoading(true);
    supabase
      .from('day_entries')
      .select('date, status')
      .gte('date', start)
      .lte('date', end)
      .then(({ data: rows }) => {
        const result: MonthData[] = Array.from({ length: 12 }, () => ({}));
        rows?.forEach((r) => {
          const m = parseInt(r.date.split('-')[1], 10) - 1;
          result[m][r.date] = r.status as DayStatus;
        });
        setMonths(result);
        setLoading(false);
      });
  }, [user, year]);

  return { months, loading };
}
