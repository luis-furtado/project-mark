import { TopicController } from './topic';
import { ITopicService } from '../services/topic/topic.interface';
import { Request, Response, NextFunction } from 'express';
import { Topic } from '../models/topic';

describe('TopicController', () => {
  let mockService: jest.Mocked<ITopicService>;
  let controller: TopicController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockService = {
      create: jest.fn(),
      createNewVersion: jest.fn(),
      get: jest.fn(),
      getTree: jest.fn(),
      getAll: jest.fn(),
      getShortestPath: jest.fn(),
    };

    controller = new TopicController(mockService);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('create', () => {
    it('should create a topic and return 201', async () => {
      req = {
        body: { name: 'Topic A', content: 'Description', parentTopicId: 'parent-id' },
      };

      const fakeTopic = { id: '123', name: 'Topic A' } as Topic;
      mockService.create.mockResolvedValue(fakeTopic);

      await controller.create(req as Request, res as Response, next);

      expect(mockService.create).toHaveBeenCalledWith('Topic A', 'Description', 'parent-id');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeTopic);
    });

    it('should call next(err) on error', async () => {
      req = { body: {} };
      const error = new Error('boom');
      mockService.create.mockRejectedValue(error);

      await controller.create(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createNewVersion', () => {
    it('should create a new version and return 201', async () => {
      req = { params: { id: 'v1' }, body: { name: 'v2', content: 'updated' } };

      const newVersion = { id: 'v2' } as Topic;
      mockService.createNewVersion.mockResolvedValue(newVersion);

      await controller.createNewVersion(req as Request, res as Response, next);

      expect(mockService.createNewVersion).toHaveBeenCalledWith('v1', {
        name: 'v2',
        content: 'updated',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newVersion);
    });

    it('should handle error via next()', async () => {
      req = { params: { id: 'v1' }, body: {} };
      const error = new Error('fail');
      mockService.createNewVersion.mockRejectedValue(error);

      await controller.createNewVersion(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('get', () => {
    it('should return a topic by id', async () => {
      req = { params: { id: '123' } };
      const topic = { id: '123' } as Topic;
      mockService.get.mockResolvedValue(topic);

      await controller.get(req as Request, res as Response, next);

      expect(mockService.get).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(topic);
    });

    it('should call next(err) on error', async () => {
      req = { params: { id: 'bad-id' } };
      const error = new Error('nope');
      mockService.get.mockRejectedValue(error);

      await controller.get(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getTree', () => {
    it('should handle error via next()', async () => {
      req = { params: { id: 'bad' } };
      const error = new Error('fail');
      mockService.getTree.mockRejectedValue(error);

      await controller.getTree(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getPath', () => {
    it('should return 400 if query params are missing', async () => {
      req = { query: {} };

      await controller.getPath(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing "fromTopicId" or "toTopicId" query parameter.',
      });
    });

    it('should call next(err) if service throws', async () => {
      req = { query: { fromTopicId: 'X', toTopicId: 'Y' } };
      const error = new Error('crash');
      mockService.getShortestPath.mockRejectedValue(error);

      await controller.getPath(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('list', () => {
    it('should handle errors via next()', async () => {
      req = {};
      const error = new Error('fail');
      mockService.getAll.mockRejectedValue(error);

      await controller.list(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
