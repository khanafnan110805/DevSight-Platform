import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRepositories, useRepoLanguages, useCommitActivity } from '@/hooks/useRepositories';
import { useDebounce } from '@/hooks/useUtils';
import { SearchInput } from '@/components/molecules/SearchInput/SearchInput';
import { RepoCard } from '@/components/molecules/RepoCard/RepoCard';
import { CommitActivityChart } from '@/charts/CommitActivityChart/CommitActivityChart';
import { LanguagePieChart } from '@/charts/LanguagePieChart/LanguagePieChart';
import { Badge } from '@/components/atoms/Badge/Badge';
import { getLanguageColor } from '@/utils/color.utils';
import { computeLanguageStats } from '@/utils/analytics.utils';
import type { GitHubRepository } from '@/types/github.types';
import { Star, GitFork, ExternalLink, Filter } from 'lucide-react';
import { formatNumber, formatRelativeDate } from '@/utils/format.utils';
import { clsx } from 'clsx';

type SortKey = 'stars' | 'forks' | 'updated' | 'name';

const RepositoriesPage = () => {
  const { user } = useAuth();
  const username = user?.login ?? '';

  const { data: repos, isLoading } = useRepositories(username);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('stars');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 250);

  // Collect all unique languages
  const allLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos?.forEach(r => {
      if (r.language) langs.add(r.language);
    });
    return Array.from(langs).sort();
  }, [repos]);

  const filtered = useMemo(() => {
    if (!repos) return [];
    return repos
      .filter(r => !r.fork)
      .filter(r => {
        const q = debouncedSearch.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) || (r.description?.toLowerCase().includes(q) ?? false)
        );
      })
      .filter(r => !languageFilter || r.language === languageFilter)
      .sort((a, b) => {
        switch (sortBy) {
          case 'stars':
            return b.stargazers_count - a.stargazers_count;
          case 'forks':
            return b.forks_count - a.forks_count;
          case 'updated':
            return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [repos, debouncedSearch, sortBy, languageFilter]);

  // Repo analytics
  const { data: repoLangs } = useRepoLanguages(user?.login ?? '', selectedRepo?.name ?? '');
  const repoLangStats = useMemo(() => {
    if (!repoLangs) return [];
    return computeLanguageStats([repoLangs]);
  }, [repoLangs]);

  return (
    <div className="flex gap-6 h-[calc(100vh-5rem)] max-w-screen-xl mx-auto">
      {/* Left panel: repo list */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-3">
        <SearchInput
          placeholder="Search repositories…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />

        {/* Sort + filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {(['stars', 'forks', 'updated', 'name'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={clsx(
                'text-xs px-2.5 py-1 rounded-full font-medium transition-colors',
                sortBy === key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-surface-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-surface-600'
              )}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Language filter */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setLanguageFilter(null)}
            className={clsx(
              'text-xs px-2 py-0.5 rounded-full transition-colors',
              !languageFilter
                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-surface-700 text-gray-400'
            )}
          >
            All
          </button>
          {allLanguages.slice(0, 8).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguageFilter(lang === languageFilter ? null : lang)}
              className={clsx(
                'text-xs px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors',
                languageFilter === lang
                  ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-surface-700 text-gray-400'
              )}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(lang) }}
              />
              {lang}
            </button>
          ))}
        </div>

        {/* Repo list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading
            ? [...Array(8)].map((_, i) => <div key={i} className="skeleton h-20 rounded-card" />)
            : filtered.map(repo => (
                <button
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className={clsx(
                    'w-full text-left',
                    selectedRepo?.id === repo.id && 'ring-2 ring-primary-500 rounded-card'
                  )}
                >
                  <RepoCard repo={repo} compact />
                </button>
              ))}
          {!isLoading && filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No repositories found</p>
          )}
        </div>
      </div>

      {/* Right panel: analytics */}
      <div className="flex-1 overflow-y-auto">
        {selectedRepo ? (
          <div className="space-y-5 animate-fade-in">
            {/* Repo header */}
            <div className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <a
                    href={selectedRepo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors"
                  >
                    <span className="font-mono text-lg">{selectedRepo.name}</span>
                    <ExternalLink size={14} />
                  </a>
                  {selectedRepo.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedRepo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Star size={14} className="text-amber-400" />
                      {formatNumber(selectedRepo.stargazers_count)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GitFork size={14} />
                      {formatNumber(selectedRepo.forks_count)}
                    </span>
                    {selectedRepo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="lang-dot"
                          style={{ backgroundColor: getLanguageColor(selectedRepo.language) }}
                        />
                        {selectedRepo.language}
                      </span>
                    )}
                    <span>Updated {formatRelativeDate(selectedRepo.pushed_at)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRepo.topics.slice(0, 5).map(t => (
                    <Badge key={t} variant="default">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Language breakdown */}
            {repoLangStats.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Language Breakdown
                </h3>
                <LanguagePieChart data={repoLangStats} height={200} />
                {/* Bar */}
                <div className="flex h-2 rounded-full overflow-hidden mt-4">
                  {repoLangStats.map(l => (
                    <div
                      key={l.name}
                      title={`${l.name} ${l.percentage.toFixed(1)}%`}
                      style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                  {repoLangStats.map(l => (
                    <span
                      key={l.name}
                      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <span className="lang-dot" style={{ backgroundColor: l.color }} />
                      {l.name}
                      <span className="text-gray-300 dark:text-gray-600">
                        {l.percentage.toFixed(1)}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-400 text-sm">Select a repository to view analytics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoriesPage;
