import { DayStatus, MonthData, Settings } from './types';
import { DEFAULT_SETTINGS } from './constants';

export const STORAGE_PREFIX = 'freelancer-radar-';
export const SETTINGS_KEY = 'freelancer-radar-settings';
export const MONTH_KEY_RE = /^freelancer-radar-(\d{4})-(\d{2})$/;

const VALID_STATUSES: ReadonlySet<DayStatus> = new Set<DayStatus>([
  'worked',
  'vacation',
  'sick',
  'holiday',
  'free',
]);

const MONTH_SHORT_RE = /^(\d{4})-(\d{2})$/;
const DAY_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface Backup {
  app: 'freelancer-radar';
  version: 1;
  exportedAt: string;
  settings: Settings;
  months: Record<string, MonthData>;
}

export class BackupValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupValidationError';
  }
}

function monthKeyToShort(storageKey: string): string | null {
  const m = MONTH_KEY_RE.exec(storageKey);
  if (!m) return null;
  return `${m[1]}-${m[2]}`;
}

function shortToStorageKey(short: string): string {
  return `${STORAGE_PREFIX}${short}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Build a Backup object from the current browser localStorage contents.
 * Enumerates every key prefixed with `freelancer-radar-` so months, years,
 * and settings the user has ever touched are all included.
 */
export function buildBackup(): Backup {
  if (typeof window === 'undefined') {
    throw new Error('buildBackup can only be called in the browser');
  }

  const months: Record<string, MonthData> = {};
  let settings: Settings = { ...DEFAULT_SETTINGS };

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;

    const raw = window.localStorage.getItem(key);
    if (raw === null) continue;

    if (key === SETTINGS_KEY) {
      try {
        const parsed = JSON.parse(raw);
        if (isPlainObject(parsed)) {
          settings = {
            dailyRate:
              typeof parsed.dailyRate === 'number'
                ? parsed.dailyRate
                : DEFAULT_SETTINGS.dailyRate,
            netRatio:
              typeof parsed.netRatio === 'number'
                ? parsed.netRatio
                : DEFAULT_SETTINGS.netRatio,
          };
        }
      } catch {
        // corrupt settings — fall through to default
      }
      continue;
    }

    const short = monthKeyToShort(key);
    if (!short) continue;

    try {
      const parsed = JSON.parse(raw);
      if (isPlainObject(parsed) && Object.keys(parsed).length > 0) {
        months[short] = parsed as MonthData;
      }
    } catch {
      // skip corrupt month blobs rather than aborting the whole export
    }
  }

  return {
    app: 'freelancer-radar',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    months,
  };
}

export function serializeBackup(backup: Backup): string {
  return JSON.stringify(backup, null, 2);
}

/**
 * Parse a JSON string into a Backup, validating every field.
 * Throws BackupValidationError with a human-readable message on any failure.
 * Never touches localStorage.
 */
export function parseBackup(text: string): Backup {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new BackupValidationError(
      'File is not valid JSON. Please pick a Freelancer Radar backup file.'
    );
  }

  if (!isPlainObject(raw)) {
    throw new BackupValidationError('Backup file must be a JSON object.');
  }

  if (raw.app !== 'freelancer-radar') {
    throw new BackupValidationError(
      'This does not look like a Freelancer Radar backup.'
    );
  }

  if (raw.version !== 1) {
    throw new BackupValidationError(
      `Unsupported backup version: ${String(raw.version)}. This app only supports version 1.`
    );
  }

  const rawSettings = raw.settings;
  if (!isPlainObject(rawSettings)) {
    throw new BackupValidationError('Backup is missing a valid "settings" object.');
  }
  const { dailyRate, netRatio } = rawSettings;
  if (typeof dailyRate !== 'number' || !Number.isFinite(dailyRate) || dailyRate < 0) {
    throw new BackupValidationError(
      'settings.dailyRate must be a non-negative number.'
    );
  }
  if (
    typeof netRatio !== 'number' ||
    !Number.isFinite(netRatio) ||
    netRatio < 0 ||
    netRatio > 1
  ) {
    throw new BackupValidationError(
      'settings.netRatio must be a number between 0 and 1.'
    );
  }

  const rawMonths = raw.months;
  if (!isPlainObject(rawMonths)) {
    throw new BackupValidationError('Backup is missing a valid "months" object.');
  }

  const months: Record<string, MonthData> = {};
  for (const [monthKey, monthValue] of Object.entries(rawMonths)) {
    const m = MONTH_SHORT_RE.exec(monthKey);
    if (!m) {
      throw new BackupValidationError(
        `Invalid month key "${monthKey}". Expected format YYYY-MM.`
      );
    }
    const monthNum = Number(m[2]);
    if (monthNum < 1 || monthNum > 12) {
      throw new BackupValidationError(
        `Invalid month number in "${monthKey}".`
      );
    }
    if (!isPlainObject(monthValue)) {
      throw new BackupValidationError(
        `Month "${monthKey}" must map to an object of day statuses.`
      );
    }
    const monthData: MonthData = {};
    for (const [dayKey, status] of Object.entries(monthValue)) {
      if (!DAY_KEY_RE.test(dayKey)) {
        throw new BackupValidationError(
          `Invalid day key "${dayKey}" in ${monthKey}. Expected YYYY-MM-DD.`
        );
      }
      if (!dayKey.startsWith(`${monthKey}-`)) {
        throw new BackupValidationError(
          `Day "${dayKey}" does not belong to month "${monthKey}".`
        );
      }
      if (typeof status !== 'string' || !VALID_STATUSES.has(status as DayStatus)) {
        throw new BackupValidationError(
          `Invalid status "${String(status)}" for ${dayKey}.`
        );
      }
      monthData[dayKey] = status as DayStatus;
    }
    months[monthKey] = monthData;
  }

  return {
    app: 'freelancer-radar',
    version: 1,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : new Date().toISOString(),
    settings: { dailyRate, netRatio },
    months,
  };
}

/**
 * Wipe every freelancer-radar-* key from localStorage and write the
 * contents of the given backup. Must be called ONLY after parseBackup
 * has already succeeded — this function performs no validation.
 */
export function applyBackup(backup: Backup): void {
  if (typeof window === 'undefined') {
    throw new Error('applyBackup can only be called in the browser');
  }

  // Collect keys first; mutating while iterating localStorage is unsafe.
  const toRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      toRemove.push(key);
    }
  }
  for (const key of toRemove) {
    window.localStorage.removeItem(key);
  }

  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(backup.settings));
  for (const [short, monthData] of Object.entries(backup.months)) {
    window.localStorage.setItem(shortToStorageKey(short), JSON.stringify(monthData));
  }
}

function todayStamp(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Trigger a browser download of the given backup as a JSON file.
 * Pure client-side: Blob + object URL + synthetic anchor click.
 */
export function downloadBackupFile(backup: Backup): void {
  if (typeof window === 'undefined') return;

  const text = serializeBackup(backup);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `freelancer-radar-backup-${todayStamp()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Let the browser finish the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
