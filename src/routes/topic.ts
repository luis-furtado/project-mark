import { Router } from 'express';
import { TopicService } from '../services/topic/topic';
import { TopicController } from '../controllers/topic';
import { TopicRepository } from '../repositories/topic/topic';
import { TopicFactory } from '../factories/topic/topic';

export function buildTopicRouter() {
  const repository = new TopicRepository();
  const factory = new TopicFactory();
  const service = new TopicService(repository, factory);
  const controller = new TopicController(service);

  const router = Router();

  router.post('/', controller.create);
  router.post('/:id/new-version', controller.createNewVersion);
  router.get('/path', controller.getPath);
  router.get('/:id', controller.get);
  router.get('/', controller.list);
  router.get('/:id/tree', controller.getTree);

  return router;
}
