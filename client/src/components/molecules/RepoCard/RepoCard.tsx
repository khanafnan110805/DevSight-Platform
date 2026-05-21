import type { GitHubRepository } from '@/types/github.types';
import { clsx } from 'clsx';
import { Star, GitFork, ExternalLink, Archive } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge/Badge';
import { getLanguageColor } from '@/utils/color.utils';
import { formatRelativeDate } from '@/utils/date.utils';
import { formatNumber } from '@/utils/format.utils';

interface RepoCardProps {
  repo: GitHubRepository;
  compact?: boolean;
  className?: string;
}

export const RepoCard = ({ repo, compact = false, className }: RepoCardProps) => (
  <div
    className={clsx(
      'card card-hover p-4 flex flex-col gap-3 group',
      className
    )}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100
                     hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          <span className="truncate font-mono">{repo.name}</span>
          <ExternalLink
            size={12}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </a>
        {repo.archived && (
          <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <Archive size={11} />
            archived
          </span>
        )}
      </div>

      {repo.private && (
        <Badge variant="default" className="flex-shrink-0 text-xs">
          private
        </Badge>
      )}
    </div>

    {!compact && repo.description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
        {repo.description}
      </p>
    )}

    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1">
          <Star size={13} className="text-amber-400" />
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {formatNumber(repo.stargazers_count)}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={13} />
          {formatNumber(repo.forks_count)}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="lang-dot"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-400">
        {formatRelativeDate(repo.pushed_at)}
      </span>
    </div>
  </div>
);
