import { apiClient, type ApiResponse } from './api';
import type { NamedRef, PaginationResult } from './catalog';

export type CompetitionTargetType = 'COUNTRY' | 'CLUB';
export type CompetitionScopeType = 'GLOBAL' | 'CONFEDERATION' | 'COUNTRY' | 'CUSTOM';
export type CompetitionCategory = '国际' | '洲际' | '国内' | '其他';
export type CompetitionLevel = '一级' | '二级' | '三级';
export type CompetitionFormat = '联赛' | '杯赛' | '其他';
export type CompetitionStandingPlacement =
  | 'CHAMPION'
  | 'RUNNER_UP'
  | 'THIRD_PLACE'
  | 'FOURTH_PLACE';

export interface CompetitionListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  targetType?: CompetitionTargetType;
  scopeType?: CompetitionScopeType;
  confederationId?: string;
  countryId?: string;
  enabled?: string;
}

export interface CompetitionListItem {
  id: string;
  code: string;
  name: string;
  externalUrl?: string | null;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category?: string | null;
  level?: string | null;
  format?: string | null;
  description?: string | null;
  confederationId?: string | null;
  countryId?: string | null;
  enabled: boolean;
  sortOrder: number;
  confederation?: NamedRef | null;
  country?: NamedRef | null;
  scopeConfederations?: Array<{ confederation: NamedRef }>;
  scopeCountries?: Array<{ country: NamedRef }>;
  _count?: {
    editions: number;
  };
}

export interface CompetitionStanding {
  id: string;
  placement: CompetitionStandingPlacement;
  countryId?: string | null;
  clubId?: string | null;
  remark?: string | null;
  country?: NamedRef | null;
  club?: NamedRef | null;
}

export interface CompetitionEdition {
  id: string;
  name: string;
  season?: string | null;
  year?: number | null;
  quantity?: number | null;
  host?: string | null;
  remark?: string | null;
  standings: CompetitionStanding[];
}

export interface CompetitionDetail extends CompetitionListItem {
  editions: CompetitionEdition[];
}

export interface CreateCompetitionPayload {
  code: string;
  name: string;
  externalUrl?: string;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category?: string;
  level?: string;
  format?: string;
  description?: string;
  confederationId?: string;
  confederationIds?: string[];
  countryId?: string;
  countryIds?: string[];
  enabled?: boolean;
  sortOrder?: number;
}

export interface CreateCompetitionEditionPayload {
  name: string;
  season?: string;
  year?: number;
  quantity?: number;
  host?: string;
  remark?: string;
}

export interface SaveCompetitionStandingsPayload {
  standings: Array<{
    placement: CompetitionStandingPlacement;
    countryId?: string | null;
    clubId?: string | null;
    remark?: string | null;
  }>;
}

export async function fetchCompetitions(params: CompetitionListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<CompetitionListItem>>>(
    '/competitions',
    {
      params
    }
  );

  return response.data.data;
}

export async function createCompetition(payload: CreateCompetitionPayload) {
  const response = await apiClient.post<ApiResponse<CompetitionListItem>>('/competitions', payload);

  return response.data.data;
}

export async function updateCompetition(id: string, payload: CreateCompetitionPayload) {
  const response = await apiClient.put<ApiResponse<CompetitionListItem>>(
    `/competitions/${id}`,
    payload
  );

  return response.data.data;
}

export async function deleteCompetition(id: string) {
  const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/competitions/${id}`);

  return response.data.data;
}

export async function fetchCompetitionDetail(id: string) {
  const response = await apiClient.get<ApiResponse<CompetitionDetail>>(`/competitions/${id}`);

  return response.data.data;
}

export async function createCompetitionEdition(
  competitionId: string,
  payload: CreateCompetitionEditionPayload
) {
  const response = await apiClient.post<ApiResponse<CompetitionEdition>>(
    `/competitions/${competitionId}/editions`,
    payload
  );

  return response.data.data;
}

export async function updateCompetitionEdition(
  id: string,
  payload: CreateCompetitionEditionPayload
) {
  const response = await apiClient.put<ApiResponse<CompetitionEdition>>(
    `/competition-editions/${id}`,
    payload
  );

  return response.data.data;
}

export async function deleteCompetitionEdition(id: string) {
  const response = await apiClient.delete<ApiResponse<{ id: string }>>(
    `/competition-editions/${id}`
  );

  return response.data.data;
}

export async function saveCompetitionStandings(
  editionId: string,
  payload: SaveCompetitionStandingsPayload
) {
  const response = await apiClient.put<ApiResponse<CompetitionEdition>>(
    `/competition-editions/${editionId}/standings`,
    payload
  );

  return response.data.data;
}
