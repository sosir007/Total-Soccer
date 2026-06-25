import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type { AuditLogItem, AuditLogListParams } from '../types/audit-logs';
import type { PaginationResult } from '../types/common';

const prefix = ApiPrefix.AUDIT_LOGS;

const API = {
  LIST: prefix
} as const;

export async function fetchAuditLogs(params: AuditLogListParams) {
  const response = await api.get<PaginationResult<AuditLogItem>>(API.LIST, {
    params
  });

  return response;
}
