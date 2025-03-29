import { Topic } from '../../models/topic';
import { ITopicFactory } from '../../factories/topic/topic.interface';
import { ITopicRepository } from '../../repositories/topic/topic.interface';
import { TopicTreeDto } from '../../dto/topic-tree-.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class TopicService {
  constructor(
    private readonly repo: ITopicRepository,
    private readonly factory: ITopicFactory,
  ) {}

  async create(name: string, content: string, parentTopicId?: string): Promise<Topic> {
    const topic = this.factory.createFirstVersion(name, content, parentTopicId);
    await this.repo.save(topic);
    return topic;
  }

  async createNewVersion(
    id: string,
    content: Partial<Pick<Topic, 'name' | 'content'>>,
  ): Promise<Topic | null> {
    const existing = await this.repo.getById(id);
    if (!existing) return null;

    const latest = await this.repo.getLatestVersionByOriginalId(id);

    if (!latest) throw new NotFoundError(`Entity not found: ${id}.`);

    if (id !== latest.id)
      throw new ConflictError(`You can only update the latest version of the topic`);

    const newVersion = this.factory.createNewVersion(existing, content);
    await this.repo.save(newVersion);
    return newVersion;
  }

  async get(id: string): Promise<Topic | null> {
    const topic = await this.repo.getById(id);
    if (!topic) throw new NotFoundError(`Entity not found: ${id}.`);
    return topic || null;
  }

  async getTree(id: string): Promise<TopicTreeDto | null> {
    const topic = await this.repo.getById(id);
    if (!topic) throw new NotFoundError(`Entity not found: ${id}.`);

    const childrens = await this.repo.getChildren(id);

    const childTrees = await Promise.all(childrens.map((child: Topic) => this.getTree(child.id)));

    return {
      ...topic,
      children: childTrees.filter(Boolean) as TopicTreeDto[],
    };
  }

  async getShortestPath(fromId: string, toId: string): Promise<Topic[]> {
    const fromTopic = await this.repo.getById(fromId);
    const toTopic = await this.repo.getById(toId);

    if (!fromTopic || !toTopic) {
      throw new NotFoundError(
        'The "fromTopic" or "destinationTopic" were not found by ID parse in paramenter.',
      );
    }

    const fromPath = await this.buildPathToRoot(fromTopic);
    const toPath = await this.buildPathToRoot(toTopic);

    // Find the common ancestor (Lowest Common Ancestor - LCA)
    let lcaIndex = -1;
    const minLength = Math.min(fromPath.length, toPath.length);

    for (let i = 0; i < minLength; i++) {
      const fromStep = fromPath[fromPath.length - 1 - i];
      const toStep = toPath[toPath.length - 1 - i];

      if (fromStep.id === toStep.id) {
        lcaIndex = i;
      } else {
        break;
      }
    }

    if (lcaIndex === -1) {
      throw new NotFoundError('No connection found between the two topics.');
    }

    const pathUp = fromPath.slice(0, fromPath.length - lcaIndex);
    const pathDown = toPath.slice(0, toPath.length - lcaIndex - 1).reverse();

    return [...pathUp, ...pathDown];
  }

  private async buildPathToRoot(start: Topic): Promise<Topic[]> {
    const path: Topic[] = [];
    let current: Topic | undefined = start;

    while (current) {
      path.push(current);
      if (!current.parentTopicId) break;
      current = await this.repo.getById(current.parentTopicId);
    }

    return path;
  }

  async getAll(): Promise<Topic[]> {
    return this.repo.getAll();
  }
}
