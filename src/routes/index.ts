import { Express, Router } from 'express';
import { buildTopicModule } from '../composition/topic.module';

export function registerRoutes(app: Express) {
  const controller = buildTopicModule();

  const router = Router();

  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.get('/:id', controller.get);
  router.get('/', controller.list);
  router.get('/:id/tree', controller.getTree);

  app.use('/topics', router);
}