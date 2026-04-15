'use client';

interface StatsGridProps {
  workedDays: number;
  vacationDays: number;
  sickDays: number;
  holidayDays: number;
  remainingWorkdays: number;
}

const STAT_CONFIG = [
  { key: 'worked', icon: '💼', label: 'Worked', color: 'text-emerald-600' },
  { key: 'vacation', icon: '🏖️', label: 'Vacation', color: 'text-blue-600' },
  { key: 'sick', icon: '🤒', label: 'Sick', color: 'text-red-600' },
  { key: 'holiday', icon: '🎉', label: 'Holidays', color: 'text-purple-600' },
  { key: 'remaining', icon: '📅', label: 'Remaining', color: 'text-amber-600' },
];

export default function StatsGrid({
  workedDays,
  vacationDays,
  sickDays,
  holidayDays,
  remainingWorkdays,
}: StatsGridProps) {
  const values: Record<string, number> = {
    worked: workedDays,
    vacation: vacationDays,
    sick: sickDays,
    holiday: holidayDays,
    remaining: remainingWorkdays,
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* First row: 3 items */}
      {STAT_CONFIG.slice(0, 3).map((stat) => (
        <div
          key={stat.key}
          className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-center"
        >
          <span className="text-lg">{stat.icon}</span>
          <p className={`text-2xl font-bold ${stat.color} mt-1`}>
            {values[stat.key]}
          </p>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
            {stat.label}
          </p>
        </div>
      ))}
      {/* Second row: 2 items centered */}
      <div className="col-span-3 grid grid-cols-2 gap-3">
        {STAT_CONFIG.slice(3).map((stat) => (
          <div
            key={stat.key}
            className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-center"
          >
            <span className="text-lg">{stat.icon}</span>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>
              {values[stat.key]}
            </p>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
