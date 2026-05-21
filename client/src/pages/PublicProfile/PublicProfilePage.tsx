import { useParams } from 'react-router-dom';
import { useGitHubProfile } from '@/hooks/useGitHubProfile';
import { useRepositories } from '@/hooks/useRepositories';
import { useContributions } from '@/hooks/useContributions';
import { useInsights } from '@/hooks/useInsights';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Badge } from '@/components/atoms/Badge/Badge';
import { RepoCard } from '@/components/molecules/RepoCard/RepoCard';
import { StreakBadge } from '@/components/molecules/StreakBadge/StreakBadge';
import { InsightCard } from '@/components/molecules/InsightCard/InsightCard';
import { ContributionCalendar } from '@/charts/ContributionCalendar/ContributionCalendar';
import { CommitActivityChart } from '@/charts/CommitActivityChart/CommitActivityChart';
import { LanguagePieChart } from '@/charts/LanguagePieChart/LanguagePieChart';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import { calculateStreaks, computeLanguageStats } from '@/utils/analytics.utils';
import { MapPin, Globe, Building2, ExternalLink, Zap, Github } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { KPINumber } from '@/components/atoms/KPINumber/KPINumber';

const PublicProfilePage = () => {
  const { username = '' } = useParams<{ username: string }>();

  const { data: profile, isLoading: profileLoading, isError } = useGitHubProfile(username);
  const { data: repos } = useRepositories(username);
  const { data: contributions } = useContributions(username);
  const { data: insightsData } = useInsights(username);

  const streak = useMemo(() => {
    if (!contributions) return { current: 0, longest: 0, totalDays: 0, lastContributionDate: null };
    return calculateStreaks(contributions.contributionCalendar.weeks);
  }, [contributions]);

  const languageStats = useMemo(() => computeLanguageStats([]), [repos]);

  const topRepos = useMemo(
    () => (repos ?? []).filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6),
    [repos]
  );

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-surface-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-surface-900 gap-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          @{username} not found
        </h1>
        <p className="text-gray-400 text-sm">
          This profile doesn't exist or hasn't connected to DevSight.
        </p>
        <Link to="/" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
          ← Back to DevSight
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-900">
      {/* Branding bar */}
      <div className="border-b border-gray-100 dark:border-surface-700 bg-white dark:bg-surface-900">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <div className="w-5 h-5 bg-primary-500 rounded flex items-center justify-center">
              <Zap size={10} className="text-white" fill="white" />
            </div>
            <span className="text-xs font-semibold">DevSight</span>
          </Link>
          <a href={profile.html_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <Github size={13} />
            View on GitHub
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Profile header */}
        <div className="card p-7">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar src={profile.avatar_url} alt={profile.login} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.name ?? profile.login}
                  </h1>
                  <a href={profile.html_url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-400 font-mono hover:text-primary-500 transition-colors flex items-center gap-1"
                  >
                    @{profile.login} <ExternalLink size={11} />
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <StreakBadge streak={streak.current} />
                  {insightsData && (
                    <div className="flex flex-col items-center px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                        {insightsData.score.grade}
                      </span>
                      <span className="text-xs text-gray-400">Score</span>
                    </div>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-400">
                {profile.company && <span className="flex items-center gap-1.5"><Building2 size={13} />{profile.company}</span>}
                {profile.location && <span className="flex items-center gap-1.5"><MapPin size={13} />{profile.location}</span>}
                {profile.blog && (
                  <a href={profile.blog} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-primary-500 transition-colors"
                  >
                    <Globe size={13} />{profile.blog.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              <div className="flex gap-8 mt-5 pt-5 border-t border-gray-100 dark:border-surface-700">
                {[
                  { label: 'Repos', value: profile.public_repos },
                  { label: 'Followers', value: profile.followers },
                  { label: 'Contributions', value: contributions?.contributionCalendar.totalContributions ?? 0 },
                  { label: 'Best Streak', value: streak.longest, suffix: 'd' },
                ].map(({ label, value, suffix = '' }) => (
                  <div key={label} className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      <KPINumber value={value} suffix={suffix} />
                    </div>
                    <div className="text-xs text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language stack */}
        {languageStats.length > 0 && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Language Stack</h2>
            <div className="flex h-3 rounded-full overflow-hidden mb-3">
              {languageStats.map(l => (
                <div key={l.name} title={`${l.name} ${l.percentage.toFixed(1)}%`}
                  style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {languageStats.map(l => (
                <Badge key={l.name} variant="language" dot dotColor={l.color}>
                  {l.name} {l.percentage.toFixed(0)}%
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Contribution Calendar */}
        {contributions && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Contribution Activity</h2>
              <span className="text-xs text-gray-400">
                {contributions.contributionCalendar.totalContributions.toLocaleString()} contributions
              </span>
            </div>
            <ContributionCalendar
              weeks={contributions.contributionCalendar.weeks}
              totalContributions={contributions.contributionCalendar.totalContributions}
            />
          </div>
        )}

        {/* Activity + Language side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contributions && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Commit Activity</h2>
              <CommitActivityChart weeks={contributions.contributionCalendar.weeks} height={180} />
            </div>
          )}
          {languageStats.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Languages</h2>
              <LanguagePieChart data={languageStats} height={180} showLegend={false} />
            </div>
          )}
        </div>

        {/* Top Repos */}
        {topRepos.length > 0 && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Top Repositories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topRepos.map(repo => <RepoCard key={repo.id} repo={repo} />)}
            </div>
          </div>
        )}

        {/* Insights (top 3) */}
        {insightsData && insightsData.insights.length > 0 && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Developer Insights</h2>
            <div className="space-y-3">
              {insightsData.insights.filter(i => i.sentiment === 'positive').slice(0, 3).map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">
            Powered by{' '}
            <Link to="/" className="text-primary-500 hover:text-primary-600 font-semibold">DevSight</Link>
            {' '}· Data sourced from GitHub
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
