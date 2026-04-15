import { Settings, MonthData } from './types';
import { getSwissHolidays } from './holidays';

export function getDailyNet(settings: Settings): number {
  return settings.dailyRate * settings.netRatio;
}

export function formatCHF(amount: number): string {
  const formatted = amount
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `CHF ${formatted}`;
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getMonthStats(
  year: number,
  month: number,
  data: MonthData,
  settings: Settings
) {
  const days = getMonthDays(year, month);
  const holidays = getSwissHolidays(year);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dailyNet = getDailyNet(settings);

  let workedDays = 0;
  let vacationDays = 0;
  let sickDays = 0;
  let holidayDays = 0;
  let freeDays = 0;
  let totalWeekdays = 0;

  for (const day of days) {
    const key = formatDateKey(day);
    const status = data[key];

    if (!isWeekend(day)) {
      totalWeekdays++;
    }

    switch (status) {
      case 'worked':
        workedDays++;
        break;
      case 'vacation':
        vacationDays++;
        break;
      case 'sick':
        sickDays++;
        break;
      case 'holiday':
        holidayDays++;
        break;
      case 'free':
        freeDays++;
        break;
    }
  }

  // Weekday holidays not manually tagged with any status
  const autoHolidays = days.filter((d) => {
    const key = formatDateKey(d);
    return !isWeekend(d) && holidays.includes(key) && !data[key];
  }).length;

  // Remaining potential workdays: today + future weekdays without a status and not a holiday
  const remainingWorkdays = days.filter((d) => {
    const key = formatDateKey(d);
    return (
      d.getTime() >= today.getTime() &&
      !isWeekend(d) &&
      !holidays.includes(key) &&
      !data[key]
    );
  }).length;

  const totalEarned = workedDays * dailyNet;
  const expectedTotal = (workedDays + remainingWorkdays) * dailyNet;

  return {
    workedDays,
    vacationDays,
    sickDays,
    holidayDays: holidayDays + autoHolidays,
    freeDays,
    totalWeekdays,
    remainingWorkdays,
    totalEarned,
    expectedTotal,
    dayOffCost: dailyNet,
    dailyNet,
  };
}
