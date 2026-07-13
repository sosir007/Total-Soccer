import type { AwardScopeType } from './awards';

export interface AwardRuleListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  scopeType?: AwardScopeType;
  enabled?: string;
}

export interface AwardRuleItem {
  id: string;
  code: string;
  name: string;
  scopeType?: AwardScopeType | null;
  category?: string | null;
  placement?: string | null;
  rank?: number | null;
  baseScore: number;
  coefficient: number;
  topAward: boolean;
  enabled: boolean;
  sortOrder: number;
  remark?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AwardRulePayload {
  code: string;
  name: string;
  scopeType?: AwardScopeType | null;
  category?: string;
  placement?: string;
  rank?: number | null;
  baseScore: number;
  coefficient: number;
  topAward: boolean;
  enabled: boolean;
  sortOrder?: number;
  remark?: string;
}

export interface AwardRecalculateResult {
  playerCount: number;
  recipientCount: number;
  enabledRuleCount: number;
  scoredPlayerCount: number;
}

export interface AwardRuleDefaultsResult {
  total: number;
  created: number;
  updated: number;
}
