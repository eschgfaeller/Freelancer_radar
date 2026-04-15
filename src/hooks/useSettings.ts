'use client';

import { useLocalStorage } from './useLocalStorage';
import { Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export function useSettings() {
  return useLocalStorage<Settings>('freelancer-radar-settings', DEFAULT_SETTINGS);
}
