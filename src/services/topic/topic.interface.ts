import { Topic } from '../../models/topic';
import { TopicTreeDto } from '../../dto/topic-tree-.dto';

export interface ITopicService {
  create(name: string, content: string, parentTopicId?: string): Promise<Topic>;
  createNewVersion(
    id: string,
    changes: Partial<Pick<Topic, 'name' | 'content'>>,
  ): Promise<Topic | null>;
  get(id: string): Promise<Topic | null>;
  getTree(id: string): Promise<TopicTreeDto | null>;
  getShortestPath(fromTopicId?: string, toTopicId?: string): Promise<TopicTreeDto | null>;
  getAll(): Promise<Topic[]>;
}
