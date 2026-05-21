import type { Request, Response } from 'express';
import { githubFetch, githubGraphQL } from '../services/github.service.js';

const token = (req: Request): string => req.session.accessToken as string;

// GET /api/github/user
export const getAuthenticatedUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await githubFetch('/user', { token: token(req) });
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/github/users/:username
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const data = await githubFetch(`/users/${username}`, { token: token(req) });
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/github/users/:username/repos
export const getUserRepos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const perPage = req.query['per_page'] ?? 100;
    const sort = req.query['sort'] ?? 'updated';
    const data = await githubFetch(
      `/users/${username}/repos?per_page=${perPage}&sort=${sort}&type=owner`,
      { token: token(req) }
    );
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/github/repos/:owner/:repo
export const getRepo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { owner, repo } = req.params;
    const data = await githubFetch(`/repos/${owner}/${repo}`, { token: token(req) });
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/github/repos/:owner/:repo/languages
export const getRepoLanguages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { owner, repo } = req.params;
    const data = await githubFetch(`/repos/${owner}/${repo}/languages`, { token: token(req) });
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/github/repos/:owner/:repo/stats/commit_activity
export const getCommitActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { owner, repo } = req.params;
    const data = await githubFetch(
      `/repos/${owner}/${repo}/stats/commit_activity`,
      { token: token(req) }
    );
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/github/graphql
export const proxyGraphQL = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, variables } = req.body as { query: string; variables: Record<string, unknown> };
    if (!query) {
      res.status(400).json({ message: 'Missing query' });
      return;
    }
    const data = await githubGraphQL(query, variables ?? {}, token(req));
    res.json({ data });
  } catch (err) {
    handleError(res, err);
  }
};

const handleError = (res: Response, err: unknown): void => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  const status = message.includes('404') ? 404 : message.includes('403') ? 403 : 500;
  res.status(status).json({ message });
};
