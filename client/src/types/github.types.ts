// ── GitHub API Response Types ──────────────────────────────────────────────

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  blog: string | null;
  company: string | null;
  location: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface CommitActivity {
  days: number[];   // [sun, mon, tue, wed, thu, fri, sat]
  total: number;
  week: number;     // Unix timestamp
}

export interface ContributionDay {
  contributionCount: number;
  date: string;     // YYYY-MM-DD
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  totalRepositoryContributions: number;
}

export interface GitHubGraphQLUser {
  login: string;
  name: string | null;
  contributionsCollection: ContributionsCollection;
  repositories: {
    totalCount: number;
  };
}
