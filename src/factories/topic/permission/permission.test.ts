import { PermissionStrategyFactory } from './permission';
import { UserRole } from '../../../enums/user-role';
import { TopicAdminStrategy } from '../../../strategies/topic/admin.strategy';
import { TopicEditorStrategy } from '../../../strategies/topic/editor.strategy';
import { TopicViewerStrategy } from '../../../strategies/topic/viewer.strategy';



describe('PermissionStrategyFactory', () => {
  it('should return TopicAdminStrategy when role is ADMIN', () => {
    const strategy = PermissionStrategyFactory.create(UserRole.ADMIN);
    expect(strategy).toBeInstanceOf(TopicAdminStrategy);
  });

  it('should return TopicEditorStrategy when role is EDITOR', () => {
    const strategy = PermissionStrategyFactory.create(UserRole.EDITOR);
    expect(strategy).toBeInstanceOf(TopicEditorStrategy);
  });

  it('should return TopicViewerStrategy when role is VIEWER', () => {
    const strategy = PermissionStrategyFactory.create(UserRole.VIEWER);
    expect(strategy).toBeInstanceOf(TopicViewerStrategy);
  });

  it('should return TopicViewerStrategy as fallback for unknown role', () => {
    const unknownRole = 'SOME_OTHER_ROLE' as UserRole;
    const strategy = PermissionStrategyFactory.create(unknownRole);
    expect(strategy).toBeInstanceOf(TopicViewerStrategy);
  });
});