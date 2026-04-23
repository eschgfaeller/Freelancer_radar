'use client';

import { useState, useEffect, useCallback } from 'react';
import { DayStatus, MonthData } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export function useDayData(year: number, month: number) {
  const { user } = useAuth();
  const [data, setData] = useState<MonthData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const mm = String(month + 1).padStart(2, '0');
    const lastDay = new Date(year, month + 1, 0).getDate();
    const start = `${year}-${mm}-01`;
    const end = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`;

    setLoading(true);
    supabase
      .from('day_entries')
      .select('date, status')
      .gte('date', start)
      .lte('date', end)
      .then(({ data: rows }) => {
        const result: MonthData = {};
        rows?.forEach((r) => {
          result[r.date] = r.status as DayStatus;
        });
        setData(result);
        setLoading(false);
      });
  }, [user, year, month]);

  const setDayStatus = useCallback(
    (dateKey: string, status: DayStatus | 'none') => {
      if (!user) return;

      setData((prev) => {
        const next = { ...prev };
        if (status === 'none') delete next[dateKey];
        else next[dateKey] = status;
        return next;
      });

      const supabase = createClient();
      if (status === 'none') {
        supabase
          .from('day_entries')
          .delete()
          .eq('user_id', user.id)
          .eq('date', dateKey)
          .then();
      } else {
        supabase
          .from('day_entries')
          .upsert({ user_id: user.id, date: dateKey, status })
          .then();
      }
    },
    [user]
  );

  const bulkSetStatus = useCallback(
    (dateKeys: string[], status: DayStatus | 'none') => {
      if (!user) return;

      setData((prev) => {
        const next = { ...prev };
        for (const dk of dateKeys) {
          if (status === 'none') delete next[dk];
          else next[dk] = status;
        }
        return next;
      });

      const supabase = createClient();
      if (status === 'none') {
        supabase
          .from('day_entries')
          .delete()
          .eq('user_id', user.id)
          .in('date', dateKeys)
          .then();
      } else {
        const rows = dateKeys.map((dk) => ({
          user_id: user.id,
          date: dk,
          status,
        }));
        supabase.from('day_entries').upsert(rows).then();
      }
    },
    [user]
  );

  return { data, loading, setDayStatus, bulkSetStatus };
}
