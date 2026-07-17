import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type {
  HonorRecalculateResult,
  HonorRuleItem,
  HonorRuleListParams,
  HonorRulePayload,
  TeamHonorRuleSummaryItem
} from '../types/honor-rules';
import type { PaginationResult } from '../types/common';

const prefix = ApiPrefix.HONOR_RULES;

const API = {
  LIST: prefix,
  DETAIL: (id: string) => `${prefix}/${id}`,
  TEAM_SUMMARIES: `${prefix}/team-summaries`,
  RECALCULATE: `${prefix}/recalculate`
} as const;

export async function fetchHonorRules(params: HonorRuleListParams) {
  const response = await api.get<PaginationResult<HonorRuleItem>>(API.LIST, {
    params
  });

  return response;
}

export async function createHonorRule(payload: HonorRulePayload) {
  const response = await api.post<HonorRuleItem>(API.LIST, payload);

  return response;
}

export async function updateHonorRule(id: string, payload: HonorRulePayload) {
  const response = await api.put<HonorRuleItem>(API.DETAIL(id), payload);

  return response;
}

export async function fetchTeamHonorRuleSummaries() {
  const response = await api.get<TeamHonorRuleSummaryItem[]>(API.TEAM_SUMMARIES);

  return response;
}

export async function recalculateHonorScores() {
  const response = await api.post<HonorRecalculateResult>(API.RECALCULATE);

  return response;
}
