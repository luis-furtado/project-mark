import { TopicService } from './topic';
import { ITopicRepository } from '../../repositories/topic/topic.interface';
import { ITopicFactory } from '../../factories/topic/topic.interface';
import { Topic } from '../../models/topic';

describe('TopicService', () => {
  let mockRepo: jest.Mocked<ITopicRepository>;
  let mockFactory: jest.Mocked<ITopicFactory>;
  let service: TopicService;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      getChildren: jest.fn(),
      getVersionsByParentId: jest.fn(),
      getLatestVersionByOriginalId: jest.fn(),
    };

    mockFactory = {
      createFirstVersion: jest.fn(),
      createNewVersion: jest.fn(),
    };

    service = new TopicService(mockRepo, mockFactory);
  });

  it('should create and save a new topic version', async () => {
    const fakeTopic: Topic = {
      id: '123',
      name: 'Test Topic',
      content: 'Test Content',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentTopicId: 'abc',
    };

    mockFactory.createFirstVersion.mockReturnValue(fakeTopic);

    const result = await service.create('Test Topic', 'Test Content', 'abc');

    expect(mockFactory.createFirstVersion).toHaveBeenCalledWith(
      'Test Topic',
      'Test Content',
      'abc',
    );
    expect(mockRepo.save).toHaveBeenCalledWith(fakeTopic);
    expect(result).toEqual(fakeTopic);
  });

  describe('TopicService - createNewVersion', () => {
    it('should return null if topic is not found by id', async () => {
      mockRepo.getById.mockResolvedValue(undefined);

      const result = await service.createNewVersion('id-123', { content: 'new' });

      expect(result).toBeNull();
      expect(mockRepo.getById).toHaveBeenCalledWith('id-123');
    });

    it('should throw NotFoundError if latest version is not found', async () => {
      mockRepo.getById.mockResolvedValue({ id: 'id-123' } as any);
      mockRepo.getLatestVersionByOriginalId.mockResolvedValue(undefined);

      await expect(service.createNewVersion('id-123', { name: 'X' })).rejects.toThrow(
        'Entity not found: id-123.',
      );
    });

    it('should throw ConflictError if id is not the latest version', async () => {
      const oldTopic = { id: 'id-123', version: 1 } as any;
      const latestTopic = { id: 'id-456', version: 2 } as any;

      mockRepo.getById.mockResolvedValue(oldTopic);
      mockRepo.getLatestVersionByOriginalId.mockResolvedValue(latestTopic);

      await expect(service.createNewVersion('id-123', { name: 'Test' })).rejects.toThrow(
        'You can only update the latest version of the topic',
      );
    });

    it('should create and return a new topic version when valid', async () => {
      const current = {
        id: 'id-456',
        version: 2,
        name: 'Old Topic',
        content: 'Old Content',
      } as any;
      const latest = current;

      const newVersion = { ...current, id: 'id-789', version: 3, name: 'Updated' } as any;

      mockRepo.getById.mockResolvedValue(current);
      mockRepo.getLatestVersionByOriginalId.mockResolvedValue(latest);
      mockFactory.createNewVersion.mockReturnValue(newVersion);

      const result = await service.createNewVersion('id-456', { name: 'Updated' });

      expect(mockFactory.createNewVersion).toHaveBeenCalledWith(current, { name: 'Updated' });
      expect(mockRepo.save).toHaveBeenCalledWith(newVersion);
      expect(result).toEqual(newVersion);
    });
  });

  describe('TopicService - get', () => {
    it('should return a topic when it exists', async () => {
      const topic = {
        id: 'topic-123',
        name: 'Test Topic',
        content: 'Hello world',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRepo.getById.mockResolvedValue(topic);

      const result = await service.get('topic-123');

      expect(mockRepo.getById).toHaveBeenCalledWith('topic-123');
      expect(result).toEqual(topic);
    });

    it('should throw NotFoundError when topic does not exist', async () => {
      mockRepo.getById.mockResolvedValue(undefined);

      await expect(service.get('nonexistent-id')).rejects.toThrow(
        'Entity not found: nonexistent-id.',
      );
      expect(mockRepo.getById).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('TopicService - getTree', () => {
    it('should throw NotFoundError if topic is not found', async () => {
      mockRepo.getById.mockResolvedValue(undefined);

      await expect(service.getTree('id-123')).rejects.toThrow('Entity not found: id-123.');
      expect(mockRepo.getById).toHaveBeenCalledWith('id-123');
    });

    it('should return topic with empty children array if no children', async () => {
      const topic = { id: 'id-123', name: 'Topic A' } as any;
      mockRepo.getById.mockResolvedValue(topic);
      mockRepo.getChildren.mockResolvedValue([]);

      const result = await service.getTree('id-123');

      expect(result).toEqual({ ...topic, children: [] });
      expect(mockRepo.getChildren).toHaveBeenCalledWith('id-123');
    });

    it('should return topic with one child in tree', async () => {
      const parent = { id: 'id-1', name: 'Parent' } as any;
      const child = { id: 'id-2', name: 'Child', parentTopicId: 'id-1' } as any;

      mockRepo.getById.mockImplementation(async (id) => {
        return id === 'id-1' ? parent : child;
      });

      mockRepo.getChildren.mockImplementation(async (id) => {
        return id === 'id-1' ? [child] : [];
      });

      const result = await service.getTree('id-1');

      expect(result).toEqual({
        ...parent,
        children: [
          {
            ...child,
            children: [],
          },
        ],
      });
    });

    it('should return tree with multiple nested children', async () => {
      const topicA = { id: 'A', name: 'A' } as any;
      const topicB = { id: 'B', name: 'B', parentTopicId: 'A' } as any;
      const topicC = { id: 'C', name: 'C', parentTopicId: 'B' } as any;

      mockRepo.getById.mockImplementation(async (id) => {
        if (id === 'A') return topicA;
        if (id === 'B') return topicB;
        if (id === 'C') return topicC;
        return null;
      });

      mockRepo.getChildren.mockImplementation(async (id) => {
        if (id === 'A') return [topicB];
        if (id === 'B') return [topicC];
        return [];
      });

      const result = await service.getTree('A');

      expect(result).toEqual({
        ...topicA,
        children: [
          {
            ...topicB,
            children: [
              {
                ...topicC,
                children: [],
              },
            ],
          },
        ],
      });
    });
  });
});
