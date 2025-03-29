// import { Router } from 'express';
// import { TopicController } from '../controllers/topic';
// import { TopicService } from '../services/topic/topic';
// import { TopicRepository } from '../repositories/topic/topic';
// import { TopicFactory } from '../factories/topic/topic';

// const router = Router();
// const topicRepository = new TopicRepository();
// const topicFactory = new TopicFactory();
// const topicService = new TopicService(topicRepository, topicFactory);
// const controller = new TopicController(topicService);

// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.get('/:id', controller.get);
// router.get('/', controller.list);

// export default {
//     path: '/topics',
//     router,
// }