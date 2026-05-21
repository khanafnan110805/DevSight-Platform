import type { Insight, InsightCategory, InsightSentiment } from '@/types/insights.types';
import type { GitHubRepository } from '@/types/github.types';
import type { LanguageStat, StreakData } from '@/types/dashboard.types';
import { nanoid } from './nanoid';

interface InsightInput {
  totalContributions: number;
  streak: StreakData;
  repos: GitHubRepository[];
  languageStats: LanguageStat[];
  weeklyTrend: number;
}

const makeInsight = (
  category: InsightCategory,
  sentiment: InsightSentiment,
  title: string,
  description: string,
  extras?: Partial<Insight>
): Insight => ({
  id: nanoid(),
  category,
  sentiment,
  priority: sentiment === 'positive' ? 'medium' : sentiment === 'warning' ? 'high' : 'low',
  title,
  description,
  generatedAt: new Date().toISOString(),
  ...extras,
});

export const generateInsights = (input: InsightInput): Insight[] => {
  const insights: Insight[] = [];
  const { streak, repos, languageStats, weeklyTrend, totalContributions } = input;

  // ── Streak insights ──────────────────────────────────────────────────────
  if (streak.current >= 30) {
    insights.push(
      makeInsight(
        'streak',
        'positive',
        `🔥 ${streak.current}-day contribution streak`,
        `You've been contributing every day for ${streak.current} days. You're in the top tier of consistent developers.`,
        { metric: `${streak.current}`, metricLabel: 'days', trend: 'up' }
      )
    );
  } else if (streak.current >= 7) {
    insights.push(
      makeInsight(
        'streak',
        'positive',
        `${streak.current}-day streak — keep it going`,
        `You've maintained a ${streak.current}-day streak. Consistency like this compounds over time.`,
        { metric: `${streak.current}`, metricLabel: 'days' }
      )
    );
  } else if (streak.current === 0) {
    insights.push(
      makeInsight(
        'streak',
        'warning',
        'Streak broken — restart today',
        `Your longest streak was ${streak.longest} days. A single commit today restarts your momentum.`,
        { metric: `${streak.longest}`, metricLabel: 'best' }
      )
    );
  }

  // ── Momentum insights ────────────────────────────────────────────────────
  if (weeklyTrend >= 25) {
    insights.push(
      makeInsight(
        'momentum',
        'positive',
        `+${weeklyTrend}% commit velocity this month`,
        'Your recent commit frequency is significantly up compared to last month. Great momentum.',
        { metric: `+${weeklyTrend}%`, trend: 'up', trendValue: weeklyTrend }
      )
    );
  } else if (weeklyTrend <= -25) {
    insights.push(
      makeInsight(
        'momentum',
        'warning',
        `${weeklyTrend}% drop in commit activity`,
        'Your commit frequency has decreased. Consider carving out dedicated coding time to rebuild momentum.',
        { metric: `${weeklyTrend}%`, trend: 'down', trendValue: weeklyTrend }
      )
    );
  }

  // ── Language growth ──────────────────────────────────────────────────────
  if (languageStats.length >= 3) {
    const top = languageStats[0];
    insights.push(
      makeInsight(
        'language',
        'positive',
        `${top.name} is your most-used language`,
        `${top.percentage.toFixed(1)}% of your codebase is ${top.name}. You're building deep expertise here.`,
        { metric: `${top.percentage.toFixed(0)}%`, metricLabel: top.name }
      )
    );

    if (languageStats.length >= 5) {
      insights.push(
        makeInsight(
          'language',
          'positive',
          `${languageStats.length} languages in your portfolio`,
          `You work across ${languageStats.map(l => l.name).slice(0, 4).join(', ')}, and more — showing technical versatility.`,
          { metric: `${languageStats.length}`, metricLabel: 'languages' }
        )
      );
    }
  }

  // ── Repository insights ──────────────────────────────────────────────────
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  if (totalStars >= 10) {
    insights.push(
      makeInsight(
        'collaboration',
        'positive',
        `${totalStars} total stars across your repos`,
        'Your work is resonating with the community. Stars reflect trust and usefulness.',
        { metric: `${totalStars}`, metricLabel: 'stars', trend: 'up' }
      )
    );
  }

  const recentlyActive = repos.filter(r => {
    const daysAgo = (Date.now() - new Date(r.pushed_at).getTime()) / 86_400_000;
    return daysAgo <= 30;
  });

  if (recentlyActive.length >= 3) {
    insights.push(
      makeInsight(
        'productivity',
        'positive',
        `${recentlyActive.length} repos updated in the last 30 days`,
        `You're actively maintaining multiple projects simultaneously — a strong signal of productivity.`,
        { metric: `${recentlyActive.length}`, metricLabel: 'active repos' }
      )
    );
  }

  // ── Consistency ──────────────────────────────────────────────────────────
  if (totalContributions >= 500) {
    insights.push(
      makeInsight(
        'consistency',
        'positive',
        `${totalContributions.toLocaleString()} contributions this year`,
        'High annual contribution counts indicate sustained, professional-grade engagement.',
        { metric: totalContributions.toLocaleString(), metricLabel: 'contributions' }
      )
    );
  }

  // Sort: high priority first, then by sentiment
  return insights.sort((a, b) => {
    const pOrder = { high: 0, medium: 1, low: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });
};
