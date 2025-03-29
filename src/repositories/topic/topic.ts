import { DatabaseService } from '../../infrastructure/db/database-service';
import { Topic } from '../../models/topic';

export class TopicRepository {
  async getAll(): Promise<Topic[]> {
    const db = await DatabaseService.getInstance();
    return db.data?.topics || [];
  }

  async getById(id: string): Promise<Topic | undefined> {
    const db = await DatabaseService.getInstance();
    return db.data?.topics.find(t => t.id === id);
  }
  
  async getChildren(parentTopicId: string): Promise<Topic[]> {
    const db = await DatabaseService.getInstance();
    return (db.data?.topics ?? []).filter(
      (topic) => topic.parentTopicId === parentTopicId
    );
  }

  async getVersionsByParentId(originalId: string): Promise<Topic[]> {
    const db = await DatabaseService.getInstance();
    return db.data?.topics.filter(t => t.id === originalId || t.parentTopicId === originalId) || [];
  }

  async getLatestVersionByOriginalId(id: string): Promise<Topic | undefined> {
    const db = await DatabaseService.getInstance();
    const topics = db.data?.topics.filter(t => t.parentTopicId === id || t.id === id) || [];
    return topics.sort((a, b) => b.version - a.version)[0];
  }

  async save(topic: Topic): Promise<void> {
    const db = await DatabaseService.getInstance();
    db.data?.topics.push(topic);
    await db.write();
  }
}