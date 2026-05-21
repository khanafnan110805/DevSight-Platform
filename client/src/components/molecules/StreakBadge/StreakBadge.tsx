import { clsx } from 'clsx';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StreakBadge = ({ streak, size = 'md', className }: StreakBadgeProps) => {
  const isActive = streak > 0;
  const sizeMap = {
    sm: 'text-sm gap-1 px-2 py-1',
    md: 'text-base gap-1.5 px-3 py-1.5',
    lg: 'text-xl gap-2 px-4 py-2',
  };
  const iconSize = { sm: 14, md: 18, lg: 24 };

  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-full font-bold',
        isActive
          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
          : 'bg-gray-100 dark:bg-surface-700 text-gray-400 dark:text-gray-500',
        sizeMap[size],
        className
      )}
    >
      <Flame
        size={iconSize[size]}
        className={isActive ? 'text-orange-500' : 'text-gray-400'}
        fill={isActive ? 'currentColor' : 'none'}
      />
      <span>{streak}</span>
      {size !== 'sm' && (
        <span className="text-xs font-normal opacity-70">
          {streak === 1 ? 'day' : 'days'}
        </span>
      )}
    </div>
  );
};
