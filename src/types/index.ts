export interface AuthorizationResponse {
  decision: 'ALLOW' | 'DENY';
  user_id: string;
  reason: string;
  matched_permissions: PermissionMatch[];
}

export interface PermissionMatch {
  action: string;
  resource: string;
  effect: 'allow' | 'deny';
}