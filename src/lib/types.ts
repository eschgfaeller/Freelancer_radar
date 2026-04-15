export type DayStatus = 'worked' | 'vacation' | 'sick' | 'holiday' | 'free';

export interface Settings {
  dailyRate: number;
  netRatio: number;
}

export type MonthData = Record<string, DayStatus>;
