import 'express-session';

declare module 'express-session' {
  interface SessionData {
    accessToken?: string;
    user?: {
      login: string;
      name: string | null;
      avatar_url: string;
    };
  }
}
