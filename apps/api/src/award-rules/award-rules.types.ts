import type { AwardScopeType } from '@prisma/client';

export interface AwardRuleListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  scopeType?: AwardScopeType;
  enabled?: string;
}

export interface AwardRulePayload {
  code?: string;
  name?: string;
  scopeType?: AwardScopeType | null;
  category?: string;
  placement?: string;
  rank?: number | string | null;
  baseScore?: number | string;
  coefficient?: number | string;
  topAward?: boolean | string | null;
  enabled?: boolean | string | null;
  sortOrder?: number | string;
  remark?: string;
}
