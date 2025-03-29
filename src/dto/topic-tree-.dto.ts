
import { Topic } from '../models/topic';

export interface TopicTreeDto extends Topic {
    children: TopicTreeDto[];
  }