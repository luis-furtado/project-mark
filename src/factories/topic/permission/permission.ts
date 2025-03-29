// src/modules/user/strategies/permission-strategy.factory.ts
import { UserRole } from '../../../enums/user-role';
import { TopicAdminStrategy } from '../../../strategies/topic/admin.strategy';
import { TopicEditorStrategy } from '../../../strategies/topic/editor.strategy';
import { TopicViewerStrategy } from '../../../strategies/topic/viewer.strategy';
import { TopicPermissionStrategy } from '../../../strategies/topic/permission.strategy.interface';

export class PermissionStrategyFactory {
  static create(role: UserRole): TopicPermissionStrategy {
    switch (role) {
      case UserRole.ADMIN:
        return new TopicAdminStrategy();
      case UserRole.EDITOR:
        return new TopicEditorStrategy();
      case UserRole.VIEWER:
        return new TopicViewerStrategy();
      default:
        return new TopicViewerStrategy();
    }
  }
}
