import { useMemo } from 'react';
import type { ContributionWeek } from '@/types/github.types';
import { clsx } from 'clsx';
import { getContributionLevel, getHeatmapColor } from '@/utils/color.utils';  // will define below
import { useIsDark } from '@/hooks/useUtils';
import { getMonthLabel } from '@/utils/date.utils';

// local re-export
export { getContributionLevel } from '@/utils/analytics.utils';

interface ContributionCalendarProps {
  weeks: ContributionWeek[];
  totalContributions: number;
  className?: string;
}

export const ContributionCalendar = ({
  weeks,
  totalContributions,
  className,
}: ContributionCalendarProps) => {
  const isDark = useIsDark();

  const maxCount = useMemo(
    () =>
      Math.max(1, ...weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount))),
    [weeks]
  );

  // Build month labels (show first week of each new month)
  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = '';
    weeks.forEach((week, i) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const month = getMonthLabel(firstDay.date);
        if (month !== lastMonth) {
          labels.push({ label: month, weekIndex: i });
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [weeks]);

  const CELL = 13;
  const GAP = 3;
  const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className={clsx('overflow-x-auto', className)}>
      <div className="min-w-max">
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {weeks.map((_, i) => {
            const label = monthLabels.find(m => m.weekIndex === i);
            return (
              <div
                key={i}
                style={{ width: CELL + GAP }}
                className="text-xs text-gray-400 dark:text-gray-500 overflow-visible whitespace-nowrap"
              >
                {label?.label ?? ''}
              </div>
            );
          })}
        </div>

        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col mr-2" style={{ gap: GAP }}>
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                style={{ height: CELL }}
                className="text-xs text-gray-400 dark:text-gray-500 flex items-center"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="flex" style={{ gap: GAP }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {week.contributionDays.map((day, di) => {
                  const level = Math.floor(
                    (day.contributionCount / maxCount) * 4
                  ) as 0 | 1 | 2 | 3 | 4;
                  const color = getHeatmapColor(level, isDark);
                  return (
                    <div
                      key={di}
                      title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`}
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: color,
                        borderRadius: 3,
                      }}
                      className="cursor-default transition-transform hover:scale-110"
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-3">
          <span className="text-xs text-gray-400">Less</span>
          {([0, 1, 2, 3, 4] as const).map(level => (
            <div
              key={level}
              style={{
                width: 11,
                height: 11,
                borderRadius: 2,
                backgroundColor: getHeatmapColor(level, isDark),
              }}
            />
          ))}
          <span className="text-xs text-gray-400">More</span>
          <span className="text-xs text-gray-400 ml-3">
            {totalContributions.toLocaleString()} contributions
          </span>
        </div>
      </div>
    </div>
  );
};
