export type AuditAction = 'CREATE' | 'UPDATE' | 'RECALCULATE' | 'IMPORT' | 'UPSERT' | 'OTHER';

export interface AuditLogListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  module?: string;
  action?: AuditAction;
  success?: string;
}

export interface AuditLogItem {
  id: string;
  action: AuditAction;
  module: string;
  method: string;
  path: string;
  success: boolean;
  statusCode?: number | null;
  objectType?: string | null;
  objectId?: string | null;
  summary?: string | null;
  actor: string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}
