export const QUERY_KEYS = {
  // Auth
  AUTH_STATUS: ['auth', 'status'] as const,

  // GitHub Profile
  PROFILE: (username: string) => ['github', 'profile', username] as const,
  PROFILE_GRAPHQL: (username: string) => ['github', 'profile', 'graphql', username] as const,

  // Repositories
  REPOSITORIES: (username: string) => ['github', 'repos', username] as const,
  REPOSITORY: (owner: string, repo: string) => ['github', 'repo', owner, repo] as const,
  REPO_LANGUAGES: (owner: string, repo: string) => ['github', 'repo', owner, repo, 'languages'] as const,
  REPO_COMMIT_ACTIVITY: (owner: string, repo: string) =>
    ['github', 'repo', owner, repo, 'commit-activity'] as const,

  // Contributions
  CONTRIBUTIONS: (username: string) => ['github', 'contributions', username] as const,

  // Insights
  INSIGHTS: (username: string) => ['insights', username] as const,
  PRODUCTIVITY_SCORE: (username: string) => ['insights', 'score', username] as const,
} as const;

// Cache TTLs in milliseconds
export const CACHE_TTL = {
  PROFILE: 60 * 60 * 1000,          // 1 hour
  CONTRIBUTIONS: 4 * 60 * 60 * 1000, // 4 hours
  REPOSITORIES: 30 * 60 * 1000,      // 30 minutes
  REPO_STATS: 60 * 60 * 1000,        // 1 hour
  INSIGHTS: 2 * 60 * 60 * 1000,      // 2 hours
} as const;
