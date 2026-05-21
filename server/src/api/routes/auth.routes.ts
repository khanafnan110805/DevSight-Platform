import { Router } from 'express';
import {
  initiateAuth,
  handleCallback,
  getAuthStatus,
  logout,
} from '../controllers/auth.controller.js';

export const authRouter = Router();

// Initiate GitHub OAuth flow
authRouter.get('/github', initiateAuth);

// GitHub redirects back here
authRouter.get('/callback', handleCallback);

// Check current session
authRouter.get('/status', getAuthStatus);

// Logout
authRouter.post('/logout', logout);
