import { useMemo } from 'react';
import { useContributions } from './useContributions';
import { useRepositories } from './useRepositories';
import { generateInsights } from '@/services/analytics/insights';
import { calculateProductivityScore } from '@/services/analytics/scoring';
import { calculateStreaks, computeLanguageStats, getWeeklyCommitTrend } from '@/utils/analytics.utils';

export const useInsights = (username: string) => {
  const { data: contributions, isLoading: contribLoading } = useContributions(username);
  const { data: repos, isLoading: reposLoading } = useRepositories(username);

  const isLoading = contribLoading || reposLoading;

  const data = useMemo(() => {
    if (!contributions || !repos) return null;

    const weeks = contributions.contributionCalendar.weeks;
    const streak = calculateStreaks(weeks);
    const languageStats = computeLanguageStats([]);

    // Build weekly commit data from contribution calendar
    const weeklyData = weeks.map(w => ({
      week: 0,
      total: w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
    }));
    const weeklyTrend = getWeeklyCommitTrend(weeklyData);
    const totalContributions = contributions.contributionCalendar.totalContributions;

    const insights = generateInsights({
      totalContributions,
      streak,
      repos,
      languageStats,
      weeklyTrend,
    });

    const score = calculateProductivityScore({
      totalContributions,
      streak,
      repos,
      languageStats,
      weeklyTrend,
    });

    return { insights, score, streak, weeklyTrend };
  }, [contributions, repos]);

  return { data, isLoading };
};
