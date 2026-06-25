import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type {
  CompetitionDetail,
  CompetitionEdition,
  CompetitionListItem,
  CompetitionListParams,
  CreateCompetitionEditionPayload,
  CreateCompetitionPayload,
  SaveCompetitionStandingsPayload
} from '../types/competitions';
import type { PaginationResult } from '../types/common';

const prefix = ApiPrefix.COMPETITIONS;
const editionPrefix = ApiPrefix.COMPETITION_EDITIONS;

const API = {
  LIST: prefix,
  DETAIL: (id: string) => `${prefix}/${id}`,
  EDITIONS: (competitionId: string) => `${prefix}/${competitionId}/editions`,
  EDITION_DETAIL: (id: string) => `${editionPrefix}/${id}`,
  EDITION_STANDINGS: (id: string) => `${editionPrefix}/${id}/standings`
} as const;

export async function fetchCompetitions(params: CompetitionListParams) {
  const response = await api.get<PaginationResult<CompetitionListItem>>(API.LIST, {
    params
  });

  return response;
}

export async function createCompetition(payload: CreateCompetitionPayload) {
  const response = await api.post<CompetitionListItem>(API.LIST, payload);

  return response;
}

export async function updateCompetition(id: string, payload: CreateCompetitionPayload) {
  const response = await api.put<CompetitionListItem>(API.DETAIL(id), payload);

  return response;
}

export async function deleteCompetition(id: string) {
  const response = await api.delete<{ id: string }>(API.DETAIL(id));

  return response;
}

export async function fetchCompetitionDetail(id: string) {
  const response = await api.get<CompetitionDetail>(API.DETAIL(id));

  return response;
}

export async function createCompetitionEdition(
  competitionId: string,
  payload: CreateCompetitionEditionPayload
) {
  const response = await api.post<CompetitionEdition>(API.EDITIONS(competitionId), payload);

  return response;
}

export async function updateCompetitionEdition(
  id: string,
  payload: CreateCompetitionEditionPayload
) {
  const response = await api.put<CompetitionEdition>(API.EDITION_DETAIL(id), payload);

  return response;
}

export async function deleteCompetitionEdition(id: string) {
  const response = await api.delete<{ id: string }>(API.EDITION_DETAIL(id));

  return response;
}

export async function saveCompetitionStandings(
  editionId: string,
  payload: SaveCompetitionStandingsPayload
) {
  const response = await api.put<CompetitionEdition>(API.EDITION_STANDINGS(editionId), payload);

  return response;
}
