import type { GitHubRepository } from './github.types';

export interface KPIStats {
  totalCommits: number;
  totalRepos: number;
  currentStreak: number;
  longestStreak: number;
  totalStars: number;
  totalForks: number;
  productivityScore: number;
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface RepoWithStats extends GitHubRepository {
  languages?: Record<string, number>;
  commitActivity?: CommitActivityWeek[];
  languageStats?: LanguageStat[];
}

export interface CommitActivityWeek {
  week: number;
  total: number;
  days: number[];
}

export interface DashboardData {
  kpi: KPIStats;
  topRepos: GitHubRepository[];
  languageStats: LanguageStat[];
  contributionStreak: StreakData;
}

export interface StreakData {
  current: number;
  longest: number;
  totalDays: number;
  lastContributionDate: string | null;
}

export type TimeRange = '30d' | '90d' | '6m' | '1y';

export interface FilterState {
  search: string;
  language: string | null;
  sortBy: 'stars' | 'forks' | 'updated' | 'name';
  sortOrder: 'asc' | 'desc';
  showForks: boolean;
  showArchived: boolean;
}
