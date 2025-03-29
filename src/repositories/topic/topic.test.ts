import { TopicRepository } from './topic';
import { DatabaseService } from '../../infrastructure/db/database-service';
import { Topic } from '../../models/topic';

jest.mock('../../infrastructure/db/database-service', () => ({
  DatabaseService: {
    getInstance: jest.fn(),
  },
}));

describe('TopicRepository', () => {
  let repository: TopicRepository;
  let mockDb: {
    data: { topics?: Topic[] };
    read: jest.Mock;
    write: jest.Mock;
  };

  beforeEach(() => {
    mockDb = {
      data: {},
      read: jest.fn().mockResolvedValue(undefined),
      write: jest.fn().mockResolvedValue(undefined),
    };

    // @ts-ignore - safely override the mock
    DatabaseService.getInstance.mockResolvedValue(mockDb);

    repository = new TopicRepository();
  });

  it('should return all topics', async () => {
    const topics: Topic[] = [{ id: '1' } as Topic, { id: '2' } as Topic];
    mockDb.data.topics = topics;

    const result = await repository.getAll();

    expect(result).toEqual(topics);
  });

  it('should return all topics', async () => {
    const topics: Topic[] = [{ id: '1' } as Topic, { id: '2' } as Topic];
    mockDb.data.topics = topics;

    const result = await repository.getAll();
    expect(result).toEqual(topics);
  });

  it('should return empty array if topics is undefined', async () => {
    mockDb.data.topics = undefined;

    const result = await repository.getAll();
    expect(result).toEqual([]);
  });

  it('should return the topic with matching id', async () => {
    const topic = { id: '123' } as Topic;
    mockDb.data.topics = [topic];

    const result = await repository.getById('123');
    expect(result).toEqual(topic);
  });

  it('should return undefined if topic is not found', async () => {
    mockDb.data.topics = [{ id: '1' } as Topic];
    const result = await repository.getById('not-found');
    expect(result).toBeUndefined();
  });

  it('should return child topics by parentTopicId', async () => {
    mockDb.data.topics = [
      { id: '1', parentTopicId: 'A' } as Topic,
      { id: '2', parentTopicId: 'A' } as Topic,
      { id: '3', parentTopicId: 'B' } as Topic,
    ];

    const result = await repository.getChildren('A');
    expect(result.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('should return empty array if no children found', async () => {
    mockDb.data.topics = [{ id: '1', parentTopicId: 'X' } as Topic];

    const result = await repository.getChildren('nonexistent');
    expect(result).toEqual([]);
  });

  it('should return versions by originalId', async () => {
    mockDb.data.topics = [
      { id: 'v1' } as Topic,
      { id: 'v2', parentTopicId: 'v1' } as Topic,
      { id: 'v3', parentTopicId: 'v1' } as Topic,
    ];

    const result = await repository.getVersionsByParentId('v1');
    expect(result.map((t) => t.id)).toEqual(['v1', 'v2', 'v3']);
  });

  it('should return empty array if no versions found', async () => {
    mockDb.data.topics = [{ id: 'x', parentTopicId: 'y' } as Topic];
    const result = await repository.getVersionsByParentId('z');
    expect(result).toEqual([]);
  });

  it('should return undefined if topic not found', async () => {
    mockDb.data.topics = [];
    const result = await repository.getLatestVersionByOriginalId('v1');
    expect(result).toBeUndefined();
  });

  it('should return topic if no newer version exists', async () => {
    const topic = { id: 'v1', version: 1 } as Topic;
    mockDb.data.topics = [topic];

    const result = await repository.getLatestVersionByOriginalId('v1');
    expect(result).toEqual(topic);
  });

  it('should push topic and write to database', async () => {
    mockDb.data.topics = [];
    const newTopic = { id: 'new' } as Topic;

    await repository.save(newTopic);

    expect(mockDb.data.topics).toContain(newTopic);
    expect(mockDb.write).toHaveBeenCalled();
  });
});
