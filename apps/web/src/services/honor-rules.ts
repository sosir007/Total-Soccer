import { apiClient, type ApiResponse } from './api';
import type { CompetitionStandingPlacement, CompetitionTargetType } from './competitions';
import type { PaginationResult } from './catalog';

export interface HonorRuleListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  targetType?: CompetitionTargetType;
  placement?: CompetitionStandingPlacement;
  enabled?: string;
}

export interface HonorRuleItem {
  id: string;
  code: string;
  name: string;
  targetType: CompetitionTargetType;
  category?: string | null;
  placement: CompetitionStandingPlacement;
  baseScore: number;
  coefficient: number;
  enabled: boolean;
  sortOrder: number;
  remark?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface HonorRulePayload {
  code: string;
  name: string;
  targetType: CompetitionTargetType;
  category?: string;
  placement: CompetitionStandingPlacement;
  baseScore: number;
  coefficient: number;
  enabled: boolean;
  sortOrder?: number;
  remark?: string;
}

export interface HonorRecalculateResult {
  countryCount: number;
  clubCount: number;
  standingCount: number;
  enabledRuleCount: number;
  scoredCountryCount: number;
  scoredClubCount: number;
}

export async function fetchHonorRules(params: HonorRuleListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<HonorRuleItem>>>(
    '/honor-rules',
    {
      params
    }
  );

  return response.data.data;
}

export async function createHonorRule(payload: HonorRulePayload) {
  const response = await apiClient.post<ApiResponse<HonorRuleItem>>('/honor-rules', payload);

  return response.data.data;
}

export async function updateHonorRule(id: string, payload: HonorRulePayload) {
  const response = await apiClient.put<ApiResponse<HonorRuleItem>>(`/honor-rules/${id}`, payload);

  return response.data.data;
}

export async function recalculateHonorScores() {
  const response = await apiClient.post<ApiResponse<HonorRecalculateResult>>(
    '/honor-rules/recalculate'
  );

  return response.data.data;
}
