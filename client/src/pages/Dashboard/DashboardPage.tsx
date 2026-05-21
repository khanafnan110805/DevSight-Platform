import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContributions } from '@/hooks/useContributions';
import { useRepositories } from '@/hooks/useRepositories';
import { useInsights } from '@/hooks/useInsights';
import { KPIStrip } from './widgets/KPIStrip';
import { HeatmapWidget } from './widgets/HeatmapWidget';
import { StreakWidget } from './widgets/StreakWidget';
import { RepoCard } from '@/components/molecules/RepoCard/RepoCard';
import { InsightCard } from '@/components/molecules/InsightCard/InsightCard';
import { CommitActivityChart } from '@/charts/CommitActivityChart/CommitActivityChart';
import { LanguagePieChart } from '@/charts/LanguagePieChart/LanguagePieChart';
import { calculateStreaks, computeLanguageStats } from '@/utils/analytics.utils';
import type { KPIStats } from '@/types/dashboard.types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const username = user?.login ?? '';

  const { data: contributions, isLoading: contribLoading } = useContributions(username);
  const { data: repos, isLoading: reposLoading } = useRepositories(username);
  const { data: insightsData, isLoading: insightsLoading } = useInsights(username);

  const isLoading = contribLoading || reposLoading;

  const streak = useMemo(() => {
    if (!contributions) return { current: 0, longest: 0, totalDays: 0, lastContributionDate: null };
    return calculateStreaks(contributions.contributionCalendar.weeks);
  }, [contributions]);

  const languageStats = useMemo(() => {
    if (!repos) return [];
    return computeLanguageStats([]);
  }, [repos]);

  const kpiStats = useMemo((): KPIStats => ({
    totalCommits: contributions?.totalCommitContributions ?? 0,
    totalRepos: repos?.length ?? 0,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    totalStars: repos?.reduce((s, r) => s + r.stargazers_count, 0) ?? 0,
    totalForks: repos?.reduce((s, r) => s + r.forks_count, 0) ?? 0,
    productivityScore: insightsData?.score.total ?? 0,
  }), [contributions, repos, streak, insightsData]);

  const topRepos = useMemo(
    () => (repos ?? []).filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6),
    [repos]
  );

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto animate-fade-in">
      {/* KPI Strip */}
      <KPIStrip stats={kpiStats} isLoading={isLoading} />

      {/* Heatmap */}
      <HeatmapWidget
        weeks={contributions?.contributionCalendar.weeks ?? []}
        totalContributions={contributions?.contributionCalendar.totalContributions ?? 0}
        isLoading={contribLoading}
      />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commit Activity */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Commit Activity
            </h2>
            <span className="text-xs text-gray-400">Weekly commits</span>
          </div>
          {contribLoading ? (
            <div className="skeleton h-48 rounded" />
          ) : contributions ? (
            <CommitActivityChart
              weeks={contributions.contributionCalendar.weeks}
              height={200}
            />
          ) : null}
        </div>

        {/* Streak */}
        <StreakWidget streak={streak} isLoading={isLoading} />
      </div>

      {/* Language + Top Repos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Language Distribution
          </h2>
          {reposLoading ? (
            <div className="skeleton h-52 rounded" />
          ) : languageStats.length > 0 ? (
            <LanguagePieChart data={languageStats} height={220} />
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">
              No language data available
            </p>
          )}
        </div>

        {/* Top Repos */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Top Repositories
            </h2>
            <Link
              to={ROUTES.REPOSITORIES}
              className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {reposLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-card" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topRepos.map(repo => (
                <RepoCard key={repo.id} repo={repo} compact />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights Preview */}
      {insightsData && insightsData.insights.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Developer Insights
            </h2>
            <Link
              to={ROUTES.INSIGHTS}
              className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {insightsData.insights.slice(0, 3).map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
