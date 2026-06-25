import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type { PlayerListItem } from '../types/catalog';
import type { PaginationResult } from '../types/common';
import type { SummitCandidateParams, SummitLineup, SummitParams } from '../types/summit';

const prefix = ApiPrefix.SUMMIT;

const API = {
  LINEUP: `${prefix}/lineup`,
  CANDIDATES: `${prefix}/candidates`
} as const;

export async function fetchSummitLineup(params: SummitParams) {
  const response = await api.get<SummitLineup>(API.LINEUP, {
    params
  });

  return response;
}

export async function fetchSummitCandidates(params: SummitCandidateParams) {
  const response = await api.get<PaginationResult<PlayerListItem>>(API.CANDIDATES, {
    params
  });

  return response;
}
