import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getAuthenticatedUser,
  getUser,
  getUserRepos,
  getRepo,
  getRepoLanguages,
  getCommitActivity,
  proxyGraphQL,
} from '../controllers/github.controller.js';

export const githubRouter = Router();

// All GitHub routes require authentication
githubRouter.use(requireAuth);

// Authenticated user
githubRouter.get('/user', getAuthenticatedUser);

// Public user
githubRouter.get('/users/:username', getUser);
githubRouter.get('/users/:username/repos', getUserRepos);

// Repositories
githubRouter.get('/repos/:owner/:repo', getRepo);
githubRouter.get('/repos/:owner/:repo/languages', getRepoLanguages);
githubRouter.get('/repos/:owner/:repo/stats/commit_activity', getCommitActivity);

// GraphQL proxy
githubRouter.post('/graphql', proxyGraphQL);
