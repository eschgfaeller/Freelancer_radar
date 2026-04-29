import { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  dailyRate: 1100,
  netRatio: 0.65,
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  worked:   { bg: 'bg-blue-500', text: 'text-white' },
  sick:     { bg: 'bg-red-500',     text: 'text-white' },
  vacation: { bg: 'bg-gray-300',    text: 'text-gray-700' },
  holiday:  { bg: 'bg-gray-300',    text: 'text-gray-700' },
  free:     { bg: 'bg-gray-200',    text: 'text-gray-500' },
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
