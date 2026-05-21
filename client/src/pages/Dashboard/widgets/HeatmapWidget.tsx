import { ContributionCalendar } from '@/charts/ContributionCalendar/ContributionCalendar';
import type { ContributionWeek } from '@/types/github.types';

interface HeatmapWidgetProps {
  weeks: ContributionWeek[];
  totalContributions: number;
  isLoading?: boolean;
}

export const HeatmapWidget = ({ weeks, totalContributions, isLoading }: HeatmapWidgetProps) => {
  if (isLoading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-48 rounded mb-4" />
        <div className="skeleton h-32 rounded" />
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Contribution Activity
        </h2>
        <span className="text-xs text-gray-400">Last 52 weeks</span>
      </div>
      <ContributionCalendar weeks={weeks} totalContributions={totalContributions} />
    </div>
  );
};
