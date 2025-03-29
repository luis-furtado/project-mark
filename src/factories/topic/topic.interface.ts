import { Topic } from '../../models/topic';

export interface ITopicFactory {
  createFirstVersion(name: string, content: string, parentTopicId?: string): Topic;
  createNewVersion(previous: Topic, updatedContent: Partial<Pick<Topic, 'name' | 'content'>>): Topic;
}