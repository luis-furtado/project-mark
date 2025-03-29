import { Topic } from '../../models/topic';
import { v4 as uuidv4 } from 'uuid';

export class TopicFactory {
  createFirstVersion = (name: string, content: string, parentTopicId?: string): Topic => {
    const now = new Date().toISOString();
    return {
      id: uuidv4(),
      name,
      content,
      version: 1,
      createdAt: now,
      updatedAt: now,
      parentTopicId,
    };
  };

  createNewVersion = (
    previous: Topic,
    updatedContent: Partial<Pick<Topic, 'name' | 'content'>>,
  ): Topic => {
    const now = new Date().toISOString();
    return {
      ...previous,
      id: uuidv4(),
      name: updatedContent.name ?? previous.name,
      content: updatedContent.content ?? previous.content,
      version: previous.version + 1,
      createdAt: previous.createdAt,
      updatedAt: now,
      parentTopicId: previous.id,
    };
  };
}
