import { TopicPermissionStrategy } from './permission.strategy.interface';

export class TopicEditorStrategy implements TopicPermissionStrategy {
  canCreate() {
    return true;
  }
  canUpdate() {
    return true;
  }
  canDelete() {
    return false;
  }
}
