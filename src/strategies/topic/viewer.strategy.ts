import { TopicPermissionStrategy } from './permission.strategy.interface';

export class TopicViewerStrategy implements TopicPermissionStrategy {
  canCreate() {
    return false;
  }
  canUpdate() {
    return false;
  }
  canDelete() {
    return false;
  }
}
