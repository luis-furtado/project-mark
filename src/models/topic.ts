export interface Topic {
  id: string;
  name: string;
  content: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  parentTopicId?: string;
}
