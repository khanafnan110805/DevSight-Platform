const GITHUB_API = 'https://api.github.com';

interface GitHubFetchOptions {
  token: string;
  method?: 'GET' | 'POST';
  body?: unknown;
}

export const githubFetch = async <T>(
  path: string,
  { token, method = 'GET', body }: GitHubFetchOptions
): Promise<T> => {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'DevSight/1.0',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? `GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
};

export const githubGraphQL = async <T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T> => {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'DevSight/1.0',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL error: ${res.status}`);
  }

  const json = await res.json() as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
};
