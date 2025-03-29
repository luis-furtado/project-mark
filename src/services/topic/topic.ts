import { Topic } from '../../models/topic';
import { ITopicFactory } from '../../factories/topic/topic.interface';
import { ITopicRepository } from '../../repositories/topic/topic.interface';
import { TopicTreeDto } from '../../dto/topic-tree-.dto';
import { NotFoundError, ValidationError } from '../../shared/errors';

export class TopicService {
  constructor(private readonly repo: ITopicRepository, private readonly factory: ITopicFactory) {}

  async create(name: string, content: string, parentTopicId?: string): Promise<Topic> {
    const topic = this.factory.createFirstVersion(name, content, parentTopicId);
    await this.repo.save(topic);
    return topic;
  }

  async update(id: string, content: Partial<Pick<Topic, 'name' | 'content'>>): Promise<Topic | null> {
    const existing = await this.repo.getById(id);
    if (!existing) return null;

    const nextVersion = await this.repo.getLatestVersionByOriginalId(id);
    
    if (nextVersion?.id !== id && nextVersion?.version === 2) {
      throw new ValidationError(`Already exists new version of this topic: ${nextVersion.id}`);
    }

    const newVersion = this.factory.createNewVersion(existing, content);
    await this.repo.save(newVersion);
    return newVersion;
  }

  async get(id: string): Promise<Topic | null> {
    const topic = await this.repo.getById(id);
    return topic || null;
  }
  
  async getTree(id: string): Promise<TopicTreeDto | null> {
    const topic = await this.repo.getById(id);
    if (!topic) return null;

    const children = await this.repo.getChildren(id);

    const childTrees = await Promise.all(
      children.map((child: Topic) => this.getTree(child.id))
    );

    return {
      ...topic,
      children: childTrees.filter(Boolean) as TopicTreeDto[],
    };
  }

  async getAll(): Promise<Topic[]> {
    return this.repo.getAll();
  }
}