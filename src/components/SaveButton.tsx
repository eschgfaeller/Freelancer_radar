'use client';

import { usePathname } from 'next/navigation';
import { useAppData } from '@/components/DataProvider';

export default function SaveButton() {
  const { dirty, saveStatus, save, loading } = useAppData();
  const pathname = usePathname();

  if (loading || pathname.startsWith('/login')) return null;

  const saving = saveStatus === 'saving';
  const error = saveStatus === 'error';
  const justSaved = !dirty && saveStatus === 'saved';

  // Nothing to show when everything is already saved.
  if (!dirty && !justSaved) return null;

  const label = saving
    ? 'Saving…'
    : error
      ? 'Save failed – tap to retry'
      : justSaved
        ? 'Saved ✓'
        : 'Save changes';

  const color = error
    ? 'bg-red-600 active:bg-red-700'
    : justSaved
      ? 'bg-emerald-700'
      : 'bg-emerald-600 active:bg-emerald-700';

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-safe pointer-events-none">
      <button
        type="button"
        onClick={save}
        disabled={saving || justSaved}
        className={`pointer-events-auto mb-4 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors disabled:opacity-80 ${color}`}
      >
        {label}
      </button>
    </div>
  );
}
