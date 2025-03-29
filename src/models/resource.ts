import { ResourceType } from '../enums/resource-type';

export interface Resource {
  id: string;
  topicId: string;
  url: string;
  description: string;
  type: ResourceType;
  createdAt: string;
  updatedAt: string;
}
