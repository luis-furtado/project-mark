import { TopicFactory } from './topic';
import { Topic } from '../../models/topic';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('TopicFactory', () => {
  const factory = new TopicFactory();

  describe('createFirstVersion', () => {
    it('should create a topic with version 1 and timestamps', () => {
      const name = 'My Topic';
      const content = 'Some content';
      const parentTopicId = 'parent-id';

      const result = factory.createFirstVersion(name, content, parentTopicId);

      expect(result).toMatchObject({
        id: 'mock-uuid',
        name,
        content,
        version: 1,
        parentTopicId,
      });

      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
      expect(result.createdAt).toEqual(result.updatedAt);
    });

    it('should allow creating a root topic without parentTopicId', () => {
      const result = factory.createFirstVersion('Root', 'No parent');

      expect(result.parentTopicId).toBeUndefined();
    });
  });

  describe('createNewVersion', () => {
    it('should create a new version with updated content', () => {
      const previous: Topic = {
        id: 'v1',
        name: 'Old Topic',
        content: 'Old Content',
        version: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        parentTopicId: undefined,
      };

      const updated = factory.createNewVersion(previous, {
        name: 'New Name',
        content: 'New Content',
      });

      expect(updated).toMatchObject({
        id: 'mock-uuid',
        name: 'New Name',
        content: 'New Content',
        version: 2,
        createdAt: previous.createdAt,
        parentTopicId: previous.id,
      });

      expect(updated.updatedAt).not.toEqual(previous.updatedAt);
    });

    it('should keep original content if updatedContent is partial', () => {
      const previous: Topic = {
        id: 'v1',
        name: 'Topic X',
        content: 'Original',
        version: 3,
        createdAt: '2023-12-01T00:00:00.000Z',
        updatedAt: '2023-12-01T00:00:00.000Z',
        parentTopicId: 'root',
      };

      const updated = factory.createNewVersion(previous, {
        name: 'Only Name Changed',
      });

      expect(updated.name).toBe('Only Name Changed');
      expect(updated.content).toBe('Original');
      expect(updated.version).toBe(4);
      expect(updated.parentTopicId).toBe('v1');
    });
  });
});
