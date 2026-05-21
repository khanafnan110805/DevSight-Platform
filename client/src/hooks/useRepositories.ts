import { useQuery } from '@tanstack/react-query';
import { getRepositories, getRepoLanguages, getCommitActivity } from '@/services/github/rest';
import { QUERY_KEYS, CACHE_TTL } from '@/config/queryKeys';

export const useRepositories = (username: string) =>
  useQuery({
    queryKey: QUERY_KEYS.REPOSITORIES(username),
    queryFn: () => getRepositories(username),
    staleTime: CACHE_TTL.REPOSITORIES,
    enabled: !!username,
  });

export const useRepoLanguages = (owner: string, repo: string) =>
  useQuery({
    queryKey: QUERY_KEYS.REPO_LANGUAGES(owner, repo),
    queryFn: () => getRepoLanguages(owner, repo),
    staleTime: CACHE_TTL.REPO_STATS,
    enabled: !!owner && !!repo,
  });

export const useCommitActivity = (owner: string, repo: string) =>
  useQuery({
    queryKey: QUERY_KEYS.REPO_COMMIT_ACTIVITY(owner, repo),
    queryFn: () => getCommitActivity(owner, repo),
    staleTime: CACHE_TTL.REPO_STATS,
    enabled: !!owner && !!repo,
  });
