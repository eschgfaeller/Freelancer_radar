'use client';

import { useAppData } from '@/components/DataProvider';

export function useSettings() {
  const { settings, loading, setSettings } = useAppData();
  return { settings, loading, setSettings };
}
