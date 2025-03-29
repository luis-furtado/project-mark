import { Request, Response, NextFunction } from 'express';
import { ITopicService } from '../services/topic/topic.interface';

export class TopicController {
  constructor(private readonly service: ITopicService) {}
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, content, parentTopicId } = req.body;
      const topic = await this.service.create(name, content, parentTopicId);
      res.status(201).json(topic);
    } catch (err) {
      next(err);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, content } = req.body;
  
      const updated = await this.service.update(id, { name, content });
      if (!updated) res.status(404).json({ message: 'Topic not found' });
  
      res.json(updated);
    } catch(err) {
      next(err);
    }
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topic = await this.service.get(req.params.id);
      if (!topic) res.status(404).json({ message: 'Topic not found' });
  
      res.json(topic);
    } catch (err) {
      next(err);
    }
  }

  getTree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tree = await this.service.getTree(req.params.id);
      if (!tree) res.status(404).json({ message: 'Topic not found' });

      res.json(tree);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topics = await this.service.getAll();
      res.json(topics);
    } catch (err) {
      next(err);
    }
  }
}