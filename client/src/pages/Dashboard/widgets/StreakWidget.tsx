import type { StreakData } from '@/types/dashboard.types';
import { StreakBadge } from '@/components/molecules/StreakBadge/StreakBadge';
import { Trophy } from 'lucide-react';

interface StreakWidgetProps {
  streak: StreakData;
  isLoading?: boolean;
}

export const StreakWidget = ({ streak, isLoading }: StreakWidgetProps) => {
  if (isLoading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-32 rounded mb-4" />
        <div className="skeleton h-20 rounded" />
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-amber-500" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Coding Streaks
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-surface-700 rounded-xl">
          <StreakBadge streak={streak.current} size="lg" className="mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-medium">Current Streak</p>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-surface-700 rounded-xl">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {streak.longest}
          </div>
          <p className="text-xs text-gray-400 font-medium">Longest Streak</p>
          <p className="text-xs text-gray-400">days</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-surface-700 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">
            {streak.totalDays.toLocaleString()}
          </strong>{' '}
          total active days
        </span>
      </div>
    </div>
  );
};
