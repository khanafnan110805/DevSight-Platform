import type { ProductivityScore } from '@/types/insights.types';
import type { StreakData } from '@/types/dashboard.types';
import type { GitHubRepository } from '@/types/github.types';
import type { LanguageStat } from '@/types/dashboard.types';

interface ScoreInput {
  totalContributions: number;
  streak: StreakData;
  repos: GitHubRepository[];
  languageStats: LanguageStat[];
  weeklyTrend: number;
}

export const calculateProductivityScore = (input: ScoreInput): ProductivityScore => {
  const { totalContributions, streak, repos, languageStats, weeklyTrend } = input;

  // ── Consistency score (0–25) ──────────────────────────────────────────────
  // Based on streak data and total active days
  const streakRatio = Math.min(streak.longest / 30, 1);
  const activeDaysRatio = Math.min(streak.totalDays / 200, 1);
  const consistency = Math.round((streakRatio * 15 + activeDaysRatio * 10));

  // ── Volume score (0–25) ───────────────────────────────────────────────────
  // Based on total annual contributions
  const volumeRatio = Math.min(totalContributions / 1000, 1);
  const volume = Math.round(volumeRatio * 25);

  // ── Diversity score (0–25) ────────────────────────────────────────────────
  // Based on language count and repo count
  const langScore = Math.min(languageStats.length / 6, 1) * 15;
  const repoScore = Math.min(repos.filter(r => !r.fork).length / 10, 1) * 10;
  const diversity = Math.round(langScore + repoScore);

  // ── Momentum score (0–25) ─────────────────────────────────────────────────
  // Based on recent activity trend
  const trendScore = weeklyTrend >= 0
    ? Math.min(weeklyTrend / 50, 1) * 15
    : Math.max(1 - Math.abs(weeklyTrend) / 100, 0) * 15;
  const currentStreakScore = Math.min(streak.current / 14, 1) * 10;
  const momentum = Math.round(trendScore + currentStreakScore);

  const total = Math.min(consistency + volume + diversity + momentum, 100);

  const grade =
    total >= 90 ? 'S' :
    total >= 75 ? 'A' :
    total >= 60 ? 'B' :
    total >= 45 ? 'C' : 'D';

  // Rough percentile estimation
  const percentile =
    total >= 90 ? 95 :
    total >= 75 ? 80 :
    total >= 60 ? 60 :
    total >= 45 ? 40 : 20;

  return {
    total,
    breakdown: { consistency, volume, diversity, momentum },
    grade,
    percentile,
  };
};
