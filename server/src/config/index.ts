import 'dotenv/config';

const required = (key: string): string => {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
};

const optional = (key: string, fallback = ''): string =>
  process.env[key] ?? fallback;

export const config = {
  port: parseInt(optional('PORT', '4000'), 10),
  nodeEnv: optional('NODE_ENV', 'development'),
  isDev: optional('NODE_ENV', 'development') === 'development',

  // GitHub OAuth
  githubClientId: required('GITHUB_CLIENT_ID'),
  githubClientSecret: required('GITHUB_CLIENT_SECRET'),
  githubCallbackUrl: optional(
    'GITHUB_CALLBACK_URL',
    'http://localhost:4000/api/auth/callback'
  ),

  // Session
  sessionSecret: required('SESSION_SECRET'),

  // CORS
  clientUrl: optional('CLIENT_URL', 'http://localhost:3000'),
} as const;
