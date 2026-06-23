import { apiClient, type ApiResponse } from './api';
import type { AwardScopeType } from './awards';
import type { PaginationResult } from './catalog';

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

export async function fetchAwardRules(params: AwardRuleListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<AwardRuleItem>>>(
    '/award-rules',
    {
      params
    }
  );

  return response.data.data;
}

export async function createAwardRule(payload: AwardRulePayload) {
  const response = await apiClient.post<ApiResponse<AwardRuleItem>>('/award-rules', payload);

  return response.data.data;
}

export async function updateAwardRule(id: string, payload: AwardRulePayload) {
  const response = await apiClient.put<ApiResponse<AwardRuleItem>>(`/award-rules/${id}`, payload);

  return response.data.data;
}

export async function recalculateAwardScores() {
  const response = await apiClient.post<ApiResponse<AwardRecalculateResult>>(
    '/award-rules/recalculate'
  );

  return response.data.data;
}
