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

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface DataContextValue {
  settings: Settings;
  days: Record<string, DayStatus>;
  loading: boolean;
  dirty: boolean;
  saveStatus: SaveStatus;
  save: () => Promise<void>;
  setSettings: (updater: Settings | ((prev: Settings) => Settings)) => void;
  setDayStatus: (dateKey: string, status: DayStatus | 'none') => void;
  bulkSetStatus: (dateKeys: string[], status: DayStatus | 'none') => void;
}

const DataContext = createContext<DataContextValue | null>(null);

// Unsaved edits are kept here so closing the app never loses them.
const DRAFT_KEY = 'freelancer-radar-draft-v1';

function readDraft(): StoreData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as StoreData) : null;
  } catch {
    return null;
  }
}

function writeDraft(data: StoreData | null) {
  try {
    if (data) localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Storage can be unavailable (private mode); saving still works.
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [days, setDaysState] = useState<Record<string, DayStatus>>({});
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const latestRef = useRef<StoreData>({ settings: DEFAULT_SETTINGS, days: {} });
  const versionRef = useRef(0);
  const savingRef = useRef(false);

  useEffect(() => {
    if (window.location.pathname.startsWith('/login')) {
      setLoading(false);
      return;
    }
    fetch('/api/data', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Load failed: ${res.status}`);
        return res.json();
      })
      .then((server: StoreData) => {
        const draft = readDraft();
        const data = draft ?? server;
        setSettingsState(data.settings);
        setDaysState(data.days);
        latestRef.current = data;
        if (draft) {
          versionRef.current += 1;
          setDirty(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data', err);
        setLoading(false);
      });
  }, []);

  const markEdited = useCallback((next: StoreData) => {
    latestRef.current = next;
    versionRef.current += 1;
    writeDraft(next);
    setDirty(true);
    setSaveStatus('idle');
  }, []);

  const save = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    const version = versionRef.current;
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(latestRef.current),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      // Only clear the draft if nothing changed while the request was in flight.
      if (version === versionRef.current) {
        writeDraft(null);
        setDirty(false);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus((s) => (s === 'saved' ? 'idle' : s)), 2000);
    } catch (err) {
      console.error('Failed to persist data', err);
      setSaveStatus('error');
    } finally {
      savingRef.current = false;
    }
  }, []);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const setSettings = useCallback(
    (updater: Settings | ((prev: Settings) => Settings)) => {
      const next = updater instanceof Function ? updater(latestRef.current.settings) : updater;
      setSettingsState(next);
      markEdited({ ...latestRef.current, settings: next });
    },
    [markEdited]
  );

  const applyDays = useCallback(
    (dateKeys: string[], status: DayStatus | 'none') => {
      const next = { ...latestRef.current.days };
      for (const dk of dateKeys) {
        if (status === 'none') delete next[dk];
        else next[dk] = status;
      }
      setDaysState(next);
      markEdited({ ...latestRef.current, days: next });
    },
    [markEdited]
  );

  const setDayStatus = useCallback(
    (dateKey: string, status: DayStatus | 'none') => applyDays([dateKey], status),
    [applyDays]
  );

  const bulkSetStatus = useCallback(
    (dateKeys: string[], status: DayStatus | 'none') => applyDays(dateKeys, status),
    [applyDays]
  );

  return (
    <DataContext.Provider
      value={{
        settings,
        days,
        loading,
        dirty,
        saveStatus,
        save,
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
