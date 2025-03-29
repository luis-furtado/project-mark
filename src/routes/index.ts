import { Express, Router } from 'express';
import { buildTopicRouter } from './topic';

export function registerRoutes(app: Express) {
  const router = buildTopicRouter();

  app.use('/topics', router);
}
