import { TopicPermissionStrategy } from './permission.strategy.interface';

export class TopicAdminStrategy implements TopicPermissionStrategy {
  canCreate() {
    return true;
  }
  canUpdate() {
    return true;
  }
  canDelete() {
    return true;
  }
}
