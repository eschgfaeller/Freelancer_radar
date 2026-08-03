'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DayStatus, Settings, StoreData } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/constants';

interface DataContextValue {
  settings: Settings;
  days: Record<string, DayStatus>;
  loading: boolean;
  saving: boolean;
  setSettings: (updater: Settings | ((prev: Settings) => Settings)) => void;
  setDayStatus: (dateKey: string, status: DayStatus | 'none') => void;
  bulkSetStatus: (dateKeys: string[], status: DayStatus | 'none') => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const PERSIST_DEBOUNCE_MS = 800;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [days, setDaysState] = useState<Record<string, DayStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const persistTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<StoreData>({ settings: DEFAULT_SETTINGS, days: {} });

  useEffect(() => {
    if (window.location.pathname.startsWith('/login')) {
      setLoading(false);
      return;
    }
    fetch('/api/data')
      .then((res) => res.json())
      .then((data: StoreData) => {
        setSettingsState(data.settings);
        setDaysState(data.days);
        latestRef.current = data;
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data', err);
        setLoading(false);
      });
  }, []);

  const flush = useCallback(() => {
    if (persistTimeout.current) {
      clearTimeout(persistTimeout.current);
      persistTimeout.current = null;
    }
    setSaving(true);
    fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(latestRef.current),
      keepalive: true,
    })
      .catch((err) => console.error('Failed to persist data', err))
      .finally(() => setSaving(false));
  }, []);

  const schedulePersist = useCallback(() => {
    if (persistTimeout.current) clearTimeout(persistTimeout.current);
    persistTimeout.current = setTimeout(flush, PERSIST_DEBOUNCE_MS);
  }, [flush]);

  // Best-effort flush of any pending debounced write before the tab closes.
  useEffect(() => {
    const handlePageHide = () => {
      if (persistTimeout.current) flush();
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [flush]);

  const setSettings = useCallback(
    (updater: Settings | ((prev: Settings) => Settings)) => {
      setSettingsState((prev) => {
        const next = updater instanceof Function ? updater(prev) : updater;
        latestRef.current = { ...latestRef.current, settings: next };
        schedulePersist();
        return next;
      });
    },
    [schedulePersist]
  );

  const setDayStatus = useCallback(
    (dateKey: string, status: DayStatus | 'none') => {
      setDaysState((prev) => {
        const next = { ...prev };
        if (status === 'none') delete next[dateKey];
        else next[dateKey] = status;
        latestRef.current = { ...latestRef.current, days: next };
        schedulePersist();
        return next;
      });
    },
    [schedulePersist]
  );

  const bulkSetStatus = useCallback(
    (dateKeys: string[], status: DayStatus | 'none') => {
      setDaysState((prev) => {
        const next = { ...prev };
        for (const dk of dateKeys) {
          if (status === 'none') delete next[dk];
          else next[dk] = status;
        }
        latestRef.current = { ...latestRef.current, days: next };
        schedulePersist();
        return next;
      });
    },
    [schedulePersist]
  );

  return (
    <DataContext.Provider
      value={{
        settings,
        days,
        loading,
        saving,
        setSettings,
        setDayStatus,
        bulkSetStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return ctx;
}
