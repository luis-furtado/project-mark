export interface TopicPermissionStrategy {
  canCreate(): boolean;
  canUpdate(): boolean;
  canDelete(): boolean;
}
