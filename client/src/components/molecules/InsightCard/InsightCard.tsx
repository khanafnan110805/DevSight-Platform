import type { Insight } from '@/types/insights.types';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
  className?: string;
}

const sentimentConfig = {
  positive: {
    border: 'border-l-emerald-400',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
  },
  warning: {
    border: 'border-l-amber-400',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
  },
  neutral: {
    border: 'border-l-blue-400',
    icon: Info,
    iconColor: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
  },
};

export const InsightCard = ({ insight, className }: InsightCardProps) => {
  const config = sentimentConfig[insight.sentiment];
  const SentimentIcon = config.icon;

  return (
    <div
      className={clsx(
        'card border-l-4 p-4 flex gap-3 animate-fade-in',
        config.border,
        className
      )}
    >
      <div className={clsx('p-1.5 rounded-lg flex-shrink-0 mt-0.5', config.bg)}>
        <SentimentIcon size={16} className={config.iconColor} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            {insight.title}
          </h4>
          {insight.metric && (
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                {insight.metric}
              </div>
              {insight.metricLabel && (
                <div className="text-xs text-gray-400">{insight.metricLabel}</div>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          {insight.description}
        </p>

        {insight.trend && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {insight.trend === 'up' ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : insight.trend === 'down' ? (
              <TrendingDown size={12} className="text-red-500" />
            ) : (
              <Minus size={12} className="text-gray-400" />
            )}
            <span className="text-gray-400">
              {insight.trendValue !== undefined && `${Math.abs(insight.trendValue)}% `}
              vs last period
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
