import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { KPINumber } from '@/components/atoms/KPINumber/KPINumber';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: ReactNode;
  iconBg?: string;
  trend?: number;    // percentage change
  subLabel?: string;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  suffix,
  prefix,
  icon,
  iconBg = 'bg-primary-50 dark:bg-primary-900/20 text-primary-500',
  trend,
  subLabel,
  className,
}: StatCardProps) => {
  const hasTrend = trend !== undefined;
  const trendUp = hasTrend && trend > 0;
  const trendDown = hasTrend && trend < 0;

  return (
    <div
      className={clsx(
        'card card-hover p-5 flex flex-col gap-3 animate-slide-up',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={clsx('p-2 rounded-lg', iconBg)}>{icon}</div>
        {hasTrend && (
          <span
            className={clsx(
              'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
              trendUp && 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
              trendDown && 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
              !trendUp && !trendDown && 'text-gray-500 bg-gray-100 dark:bg-surface-700'
            )}
          >
            {trendUp ? (
              <TrendingUp size={12} />
            ) : trendDown ? (
              <TrendingDown size={12} />
            ) : (
              <Minus size={12} />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div>
        <KPINumber
          value={value}
          suffix={suffix}
          prefix={prefix}
          className="text-2xl text-gray-900 dark:text-gray-100"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</p>
        {subLabel && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subLabel}</p>
        )}
      </div>
    </div>
  );
};
