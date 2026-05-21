import { API_URL } from '@/config/constants';
import type {
  GitHubUser,
  GitHubRepository,
  GitHubLanguages,
  CommitActivity,
} from '@/types/github.types';

const githubFetch = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API_URL}/api/github${path}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message ?? `GitHub API error: ${res.status}`);
  }

  return res.json();
};

export const getUser = (username: string): Promise<GitHubUser> =>
  githubFetch<GitHubUser>(`/users/${username}`);

export const getRepositories = (username: string): Promise<GitHubRepository[]> =>
  githubFetch<GitHubRepository[]>(`/users/${username}/repos?per_page=100&sort=updated`);

export const getRepoLanguages = (owner: string, repo: string): Promise<GitHubLanguages> =>
  githubFetch<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);

export const getCommitActivity = (owner: string, repo: string): Promise<CommitActivity[]> =>
  githubFetch<CommitActivity[]>(`/repos/${owner}/${repo}/stats/commit_activity`);

export const getAuthenticatedUser = (): Promise<GitHubUser> =>
  githubFetch<GitHubUser>('/user');
