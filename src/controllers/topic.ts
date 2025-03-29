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
  };

  createNewVersion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, content } = req.body;

      const newVersion = await this.service.createNewVersion(id, { name, content });

      res.status(201).json(newVersion);
    } catch (err) {
      next(err);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const topic = await this.service.get(req.params.id);

      res.status(200).json(topic);
    } catch (err) {
      next(err);
    }
  };

  getTree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tree = await this.service.getTree(req.params.id);

      res.status(200).json(tree);
    } catch (err) {
      next(err);
    }
  };

  getPath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      var { fromTopicId, toTopicId } = req.query;
      fromTopicId = fromTopicId as string;
      toTopicId = toTopicId as string;

      if (!fromTopicId || !toTopicId) {
        res.status(400).json({ message: 'Missing "fromTopicId" or "toTopicId" query parameter.' });
      }

      const shortestPath = await this.service.getShortestPath(fromTopicId, toTopicId);

      res.json(shortestPath);
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
  };
}
