import { Router } from 'express';
import { TopicService } from '../services/topic/topic';
import { TopicController } from '../controllers/topic';
import { TopicRepository } from '../repositories/topic/topic';
import { TopicFactory } from '../factories/topic/topic';

export function buildTopicModule() {
  const repository = new TopicRepository();
  const factory = new TopicFactory();
  const service = new TopicService(repository, factory);
  const controller = new TopicController(service);

  return controller;
}