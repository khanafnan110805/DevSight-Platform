import type { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session?.accessToken) {
    res.status(401).json({ message: 'Unauthorized — please sign in with GitHub' });
    return;
  }
  next();
};
