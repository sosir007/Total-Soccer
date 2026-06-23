import type { AuditAction } from '@prisma/client';
import type { PaginationQuery } from '../common/pagination.js';

export interface AuditLogListQuery extends PaginationQuery {
  keyword?: string;
  module?: string;
  action?: AuditAction;
  success?: string;
}
