export const ROUTES = {
  // Public Marketing
  HOME: '/',
  FEATURES: '/features',
  PRICING: '/pricing',

  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_CALLBACK: '/auth/callback',
  AUTH_LOGOUT: '/auth/logout',

  // Protected Dashboard
  DASHBOARD: '/dashboard',
  REPOSITORIES: '/dashboard/repositories',
  REPOSITORY_DETAIL: '/dashboard/repository/:id',
  INSIGHTS: '/dashboard/insights',
  CONTRIBUTIONS: '/dashboard/contributions',
  LANGUAGES: '/dashboard/languages',

  // Portfolio
  PORTFOLIO: '/portfolio',
  PORTFOLIO_EDIT: '/portfolio/edit',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_APPEARANCE: '/settings/appearance',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_PRIVACY: '/settings/privacy',
  SETTINGS_ACCOUNT: '/settings/account',

  // Public Profile
  PUBLIC_PROFILE: '/u/:username',

  // Error
  NOT_FOUND: '/404',
} as const;

export type RouteKey = keyof typeof ROUTES;
