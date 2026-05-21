import type { Request, Response } from 'express';
import { config } from '../../config/index.js';

// ── Step 1: Redirect user to GitHub OAuth ─────────────────────────────────
export const initiateAuth = (_req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: config.githubCallbackUrl,
    scope: 'read:user user:email public_repo read:org',
    allow_signup: 'true',
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

// ── Step 2: GitHub redirects back with ?code= ─────────────────────────────
export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query['code'] as string | undefined;
  const error = req.query['error'] as string | undefined;

  if (error || !code) {
    res.redirect(`${config.clientUrl}/auth/login?error=${error ?? 'no_code'}`);
    return;
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'DevSight/1.0',
      },
      body: JSON.stringify({
        client_id: config.githubClientId,
        client_secret: config.githubClientSecret,
        code,
        redirect_uri: config.githubCallbackUrl,
      }),
    });

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };

    if (!tokenData.access_token) {
      throw new Error(tokenData.error ?? 'Failed to obtain access token');
    }

    // Fetch authenticated user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'DevSight/1.0',
      },
    });

    const user = await userRes.json() as { login: string; name: string | null; avatar_url: string };

    // Store in session
    req.session.accessToken = tokenData.access_token;
    req.session.user = {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
    };

    // Redirect to dashboard
    res.redirect(`${config.clientUrl}/dashboard`);
  } catch (err) {
    console.error('[auth] callback error:', err);
    res.redirect(`${config.clientUrl}/auth/login?error=oauth_failed`);
  }
};

// ── GET /api/auth/status ──────────────────────────────────────────────────
export const getAuthStatus = (req: Request, res: Response): void => {
  if (req.session?.accessToken && req.session?.user) {
    res.json({
      authenticated: true,
      user: req.session.user,
    });
  } else {
    res.json({ authenticated: false });
  }
};

// ── POST /api/auth/logout ─────────────────────────────────────────────────
export const logout = (req: Request, res: Response): void => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
};
