import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGitHubProfile } from '@/hooks/useGitHubProfile';
import { useRepositories } from '@/hooks/useRepositories';
import { useContributions } from '@/hooks/useContributions';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';
import { RepoCard } from '@/components/molecules/RepoCard/RepoCard';
import { ContributionCalendar } from '@/charts/ContributionCalendar/ContributionCalendar';
import { StreakBadge } from '@/components/molecules/StreakBadge/StreakBadge';
import { calculateStreaks, computeLanguageStats } from '@/utils/analytics.utils';
import { getLanguageColor } from '@/utils/color.utils';
import { ExternalLink, MapPin, Globe, Building2, Share2, Edit3, Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useMemo, useEffect } from 'react';
import { APP_URL } from '@/config/constants';

const PortfolioPage = () => {
  const { user } = useAuth();
  const username = user?.login ?? '';
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { data: profile, isLoading: profileLoading } = useGitHubProfile(username);
  const { data: repos } = useRepositories(username);
  const { data: contributions } = useContributions(username);

  const streak = useMemo(() => {
    if (!contributions) return { current: 0, longest: 0, totalDays: 0, lastContributionDate: null };
    return calculateStreaks(contributions.contributionCalendar.weeks);
  }, [contributions]);

  const languageStats = useMemo(() => computeLanguageStats([]), [repos]);

  const topRepos = useMemo(
    () => (repos ?? []).filter(r => !r.fork && r.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6),
    [repos]
  );

  const publicUrl = `${APP_URL}/u/${username}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="card p-8">
          <div className="flex gap-6">
            <div className="skeleton w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-7 w-48 rounded" />
              <div className="skeleton h-4 w-80 rounded" />
              <div className="skeleton h-4 w-64 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Portfolio header actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Your Portfolio</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Public page at{' '}
            <a href={publicUrl} target="_blank" rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 font-mono text-xs"
            >
              /u/{username}
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopyLink}
            leftIcon={copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setEditMode(v => !v)}
            leftIcon={<Edit3 size={14} />}
          >
            {editMode ? 'Done' : 'Edit'}
          </Button>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" leftIcon={<ExternalLink size={14} />}>
              View public
            </Button>
          </a>
        </div>
      </div>

      {/* Profile card */}
      <div className="card p-7">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Avatar src={profile?.avatar_url ?? ''} alt={username} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile?.name ?? username}
                </h2>
                <a href={profile?.html_url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-gray-400 font-mono hover:text-primary-500 transition-colors flex items-center gap-1"
                >
                  @{username} <ExternalLink size={11} />
                </a>
              </div>
              <StreakBadge streak={streak.current} size="md" />
            </div>

            {profile?.bio && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-gray-400">
              {profile?.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 size={13} /> {profile.company}
                </span>
              )}
              {profile?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {profile.location}
                </span>
              )}
              {profile?.blog && (
                <a href={profile.blog} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary-500 transition-colors"
                >
                  <Globe size={13} /> {profile.blog.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100 dark:border-surface-700">
              {[
                { label: 'Repositories', value: profile?.public_repos ?? 0 },
                { label: 'Followers', value: profile?.followers ?? 0 },
                { label: 'Following', value: profile?.following ?? 0 },
                { label: 'Streak', value: streak.current, suffix: 'd' },
              ].map(({ label, value, suffix = '' }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {value.toLocaleString()}{suffix}
                  </div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Languages */}
      {languageStats.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Language Stack
          </h3>
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
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Contribution Activity
          </h3>
          <ContributionCalendar
            weeks={contributions.contributionCalendar.weeks}
            totalContributions={contributions.contributionCalendar.totalContributions}
          />
        </div>
      )}

      {/* Featured Repos */}
      {topRepos.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Featured Repositories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topRepos.map(repo => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
