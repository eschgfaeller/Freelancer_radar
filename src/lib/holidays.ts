/**
 * Swiss public holidays (Zurich canton as default).
 * Includes fixed holidays + Easter-dependent moveable feasts.
 */
export function getSwissHolidays(year: number): string[] {
  const holidays: string[] = [
    `${year}-01-01`, // New Year's Day
    `${year}-01-02`, // Berchtoldstag
    `${year}-05-01`, // Labour Day
    `${year}-08-01`, // Swiss National Day
    `${year}-12-25`, // Christmas Day
    `${year}-12-26`, // St. Stephen's Day
  ];

  // Easter-dependent holidays
  const easter = getEasterDate(year);

  const goodFriday = new Date(easter);
  goodFriday.setDate(goodFriday.getDate() - 2);

  const easterMonday = new Date(easter);
  easterMonday.setDate(easterMonday.getDate() + 1);

  const ascension = new Date(easter);
  ascension.setDate(ascension.getDate() + 39);

  const whitMonday = new Date(easter);
  whitMonday.setDate(whitMonday.getDate() + 50);

  holidays.push(
    formatDate(goodFriday),
    formatDate(easterMonday),
    formatDate(ascension),
    formatDate(whitMonday)
  );

  return holidays;
}

/** Anonymous Gregorian Easter algorithm */
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
