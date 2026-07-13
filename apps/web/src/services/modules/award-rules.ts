import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type {
  AwardRuleDefaultsResult,
  AwardRecalculateResult,
  AwardRuleItem,
  AwardRuleListParams,
  AwardRulePayload
} from '../types/award-rules';
import type { PaginationResult } from '../types/common';

const prefix = ApiPrefix.AWARD_RULES;

const API = {
  LIST: prefix,
  DETAIL: (id: string) => `${prefix}/${id}`,
  DEFAULTS: `${prefix}/defaults`,
  RECALCULATE: `${prefix}/recalculate`
} as const;

export async function fetchAwardRules(params: AwardRuleListParams) {
  const response = await api.get<PaginationResult<AwardRuleItem>>(API.LIST, {
    params
  });

  return response;
}

export async function createAwardRule(payload: AwardRulePayload) {
  const response = await api.post<AwardRuleItem>(API.LIST, payload);

  return response;
}

export async function updateAwardRule(id: string, payload: AwardRulePayload) {
  const response = await api.put<AwardRuleItem>(API.DETAIL(id), payload);

  return response;
}

export async function initializeDefaultAwardRules() {
  const response = await api.post<AwardRuleDefaultsResult>(API.DEFAULTS);

  return response;
}

export async function recalculateAwardScores() {
  const response = await api.post<AwardRecalculateResult>(API.RECALCULATE);

  return response;
}
