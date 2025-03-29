import { Topic } from '../../models/topic';

export type CollectionMap = {
    [key: string]: any[];
  };
  
  const schemaRegistry: CollectionMap = {};
  
  export function registerCollection<T>(key: string, initial: T[]) {
    schemaRegistry[key] = initial;
  }
  
  export function getInitialSchema(): CollectionMap {
    return schemaRegistry;
  }

registerCollection<Topic>('topics', []);