export type DayStatus = 'worked' | 'vacation' | 'sick' | 'holiday' | 'free';

export interface Settings {
  dailyRate: number;
  netRatio: number;
}

export type MonthData = Record<string, DayStatus>;

// Full app data blob, stored as one JSON file in the GitHub repo.
// `days` is flat and keyed by full date (YYYY-MM-DD) across all months/years.
export interface StoreData {
  settings: Settings;
  days: Record<string, DayStatus>;
}
