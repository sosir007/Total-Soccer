import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type {
  HonorRecalculateResult,
  HonorRuleItem,
  HonorRuleListParams,
  HonorRulePayload
} from '../types/honor-rules';
import type { PaginationResult } from '../types/common';

const prefix = ApiPrefix.HONOR_RULES;

const API = {
  LIST: prefix,
  DETAIL: (id: string) => `${prefix}/${id}`,
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

export async function recalculateHonorScores() {
  const response = await api.post<HonorRecalculateResult>(API.RECALCULATE);

  return response;
}
