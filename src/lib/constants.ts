import { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  dailyRate: 1100,
  netRatio: 0.65,
  workingDaysPerWeek: 5,
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  worked: { bg: 'bg-emerald-500/15', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  vacation: { bg: 'bg-blue-500/15', text: 'text-blue-700', dot: 'bg-blue-500' },
  sick: { bg: 'bg-red-500/15', text: 'text-red-700', dot: 'bg-red-500' },
  holiday: { bg: 'bg-purple-500/15', text: 'text-purple-700', dot: 'bg-purple-500' },
  free: { bg: 'bg-gray-400/15', text: 'text-gray-500', dot: 'bg-gray-400' },
};

export const STATUS_LABELS: Record<string, string> = {
  worked: 'Worked',
  vacation: 'Vacation',
  sick: 'Sick',
  holiday: 'Holiday',
  free: 'Free',
};

export const STATUS_ICONS: Record<string, string> = {
  worked: '💼',
  vacation: '🏖️',
  sick: '🤒',
  holiday: '🎉',
  free: '😴',
};
