'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export function useSettings(): {
  settings: Settings;
  loading: boolean;
  setSettings: (value: Settings | ((prev: Settings) => Settings)) => void;
} {
  const { user } = useAuth();
  const [settings, setLocal] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    setLoading(true);
    supabase
      .from('user_settings')
      .select('daily_rate, net_ratio')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row) {
          setLocal({
            dailyRate: Number(row.daily_rate),
            netRatio: Number(row.net_ratio),
          });
        }
        setLoading(false);
      });
  }, [user]);

  const setSettings = useCallback(
    (value: Settings | ((prev: Settings) => Settings)) => {
      if (!user) return;

      setLocal((prev) => {
        const next = value instanceof Function ? value(prev) : value;

        const supabase = createClient();
        supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            daily_rate: next.dailyRate,
            net_ratio: next.netRatio,
          })
          .then();

        return next;
      });
    },
    [user]
  );

  return { settings, loading, setSettings };
}
