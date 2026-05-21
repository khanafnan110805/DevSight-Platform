import { API_URL } from '@/config/constants';
import type { GitHubGraphQLUser } from '@/types/github.types';
import { CONTRIBUTIONS_QUERY } from './queries';

const graphqlFetch = async <T>(query: string, variables: Record<string, unknown>): Promise<T> => {
  const res = await fetch(`${API_URL}/api/github/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'GraphQL error' }));
    throw new Error(error.message ?? `GraphQL error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
};

export const getContributions = (username: string): Promise<{ user: GitHubGraphQLUser }> =>
  graphqlFetch<{ user: GitHubGraphQLUser }>(CONTRIBUTIONS_QUERY, { username });
