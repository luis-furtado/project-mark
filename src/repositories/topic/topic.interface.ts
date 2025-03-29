import { Topic } from '../../models/topic';

export interface ITopicRepository {
  getAll(): Promise<Topic[]>;
  getById(id: string): Promise<Topic | undefined>;
  getChildren(parentTopicId: string): Promise<Topic[]>;
  getVersionsByParentId(originalId: string): Promise<Topic[]>;
  getLatestVersionByOriginalId(id: string): Promise<Topic | undefined>;
  save(topic: Topic): Promise<void>;
}