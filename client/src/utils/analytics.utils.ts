import type { ContributionDay, ContributionWeek } from '@/types/github.types';
import type { StreakData, LanguageStat } from '@/types/dashboard.types';
import { getLanguageColor } from './color.utils';

export const calculateStreaks = (weeks: ContributionWeek[]): StreakData => {
  const days = weeks.flatMap(w => w.contributionDays).sort((a, b) => a.date.localeCompare(b.date));

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let lastContributionDate: string | null = null;
  let totalDays = 0;

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      if (lastContributionDate === null) lastContributionDate = days[i].date;
      totalDays++;
    }
  }

  // Calculate current streak (from today backwards)
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      current++;
    } else if (i === days.length - 1) {
      // Allow one day gap (today might not have commits yet)
      continue;
    } else {
      break;
    }
  }

  // Calculate longest streak
  tempStreak = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longest) longest = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  return { current, longest, totalDays, lastContributionDate };
};

export const getContributionLevel = (count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
};

export const computeLanguageStats = (
  repoLanguages: Array<Record<string, number>>
): LanguageStat[] => {
  const totals: Record<string, number> = {};

  for (const langMap of repoLanguages) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      totals[lang] = (totals[lang] ?? 0) + bytes;
    }
  }

  const grandTotal = Object.values(totals).reduce((sum, b) => sum + b, 0);

  return Object.entries(totals)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: grandTotal > 0 ? (bytes / grandTotal) * 100 : 0,
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 10);
};

export const getWeeklyCommitTrend = (
  weeks: Array<{ week: number; total: number }>
): number => {
  if (weeks.length < 8) return 0;
  const recent = weeks.slice(-4).reduce((s, w) => s + w.total, 0) / 4;
  const previous = weeks.slice(-8, -4).reduce((s, w) => s + w.total, 0) / 4;
  if (previous === 0) return 100;
  return Math.round(((recent - previous) / previous) * 100);
};

export const getDayOfWeekDistribution = (days: ContributionDay[]): number[] => {
  const dist = new Array(7).fill(0);
  for (const day of days) {
    const dow = new Date(day.date).getDay();
    dist[dow] += day.contributionCount;
  }
  return dist;
};

export const getPeakHour = (dist: number[]): number =>
  dist.indexOf(Math.max(...dist));
