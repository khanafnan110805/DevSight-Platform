export const APP_NAME = 'DevSight';
export const APP_DESCRIPTION = 'GitHub Analytics & Developer Portfolio Platform';
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://devsight.dev';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';

// Feature flags
export const FEATURES = {
  PRIVATE_REPOS: import.meta.env.VITE_FEATURE_PRIVATE_REPOS === 'true',
  AI_INSIGHTS: import.meta.env.VITE_FEATURE_AI_INSIGHTS === 'true',
  LEADERBOARDS: import.meta.env.VITE_FEATURE_LEADERBOARDS === 'true',
} as const;

// GitHub language color map
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  CSS: '#563D7C',
  HTML: '#E34C26',
  Vue: '#41B883',
  Shell: '#89E051',
  Scala: '#C22D40',
  Haskell: '#5E5086',
  Elixir: '#6E4A7E',
  Clojure: '#DB5855',
  Lua: '#000080',
  R: '#198CE7',
  MATLAB: '#E16737',
  Dockerfile: '#384D54',
  Makefile: '#427819',
};

export const DEFAULT_LANGUAGE_COLOR = '#8B8B8B';

// Pagination
export const REPOS_PER_PAGE = 30;
export const INSIGHTS_PER_PAGE = 10;

// Productivity score thresholds
export const SCORE_GRADES = {
  S: 90,
  A: 75,
  B: 60,
  C: 45,
  D: 0,
} as const;
