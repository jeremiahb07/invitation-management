import { Router, type Request, type Response } from 'express';

import { currentDbStatus, type DbStatus } from '../lib/db.js';

export interface HealthResponse {
  status: 'ok';
  db: DbStatus;
}

export const healthRouter = Router();

// Always 200, even with the database down: Render polls this path, and restarting
// the instance cannot fix a Mongo outage. The body carries the real state.
healthRouter.get('/health', (_req: Request, res: Response<HealthResponse>) => {
  res.json({ status: 'ok', db: currentDbStatus() });
});
