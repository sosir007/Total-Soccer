import { apiClient, type ApiResponse } from './api';

export interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AwardNamedRef {
  id: string;
  uid?: string;
  code?: string | null;
  name: string;
  externalUrl?: string | null;
  exists?: boolean;
}

export type AwardScopeType = 'WORLD' | 'CONFEDERATION' | 'COUNTRY' | 'LEAGUE' | 'CLUB' | 'MEDIA';

export interface AwardListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  scopeType?: AwardScopeType;
  confederationId?: string;
  countryId?: string;
  enabled?: boolean;
}

export interface AwardRecipientListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  awardId?: string;
  scopeType?: AwardScopeType;
  playerId?: string;
  placement?: string;
  year?: number;
}

export interface AwardListItem {
  id: string;
  code: string;
  name: string;
  externalUrl?: string | null;
  scopeType: AwardScopeType;
  category?: string | null;
  level?: string | null;
  description?: string | null;
  confederationId?: string | null;
  countryId?: string | null;
  enabled: boolean;
  sortOrder: number;
  confederation?: AwardNamedRef | null;
  country?: AwardNamedRef | null;
  _count?: {
    editions: number;
  };
}

export interface AwardEdition {
  id: string;
  awardId: string;
  name: string;
  season?: string | null;
  year?: number | null;
  externalUrl?: string | null;
  remark?: string | null;
  recipients?: AwardEditionRecipient[];
}

export interface AwardDetail extends AwardListItem {
  editions: AwardEdition[];
}

export interface AwardEditionRecipient {
  id: string;
  editionId: string;
  playerId: string;
  rank?: number | null;
  placement?: string | null;
  externalUrl?: string | null;
  remark?: string | null;
  player: {
    id: string;
    uid: string;
    chineseName: string;
    englishName?: string | null;
    externalUrl?: string | null;
    pa?: number | null;
    primaryRole?: string | null;
    positions?: string | null;
    country?: AwardNamedRef | null;
    club?: AwardNamedRef | null;
  };
}

export interface AwardRecipientRecord extends AwardEditionRecipient {
  edition: Omit<AwardEdition, 'recipients'> & {
    award: AwardListItem;
  };
}

export interface CreateAwardPayload {
  code: string;
  name: string;
  externalUrl?: string;
  scopeType: AwardScopeType;
  category?: string;
  level?: string;
  description?: string;
  confederationId?: string;
  countryId?: string;
  enabled?: boolean;
  sortOrder?: number;
}

export interface CreateAwardEditionPayload {
  name: string;
  season?: string;
  year?: number;
  externalUrl?: string;
  remark?: string;
}

export interface SaveAwardRecipientsPayload {
  recipients: Array<{
    playerId?: string;
    rank?: number | null;
    placement?: string;
    externalUrl?: string;
    remark?: string;
  }>;
}

export async function fetchAwards(params: AwardListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<AwardListItem>>>('/awards', {
    params
  });

  return response.data.data;
}

export async function fetchAwardRecipients(params: AwardRecipientListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<AwardRecipientRecord>>>(
    '/awards/recipients',
    {
      params
    }
  );

  return response.data.data;
}

export async function fetchAwardDetail(id: string) {
  const response = await apiClient.get<ApiResponse<AwardDetail>>(`/awards/${id}`);

  return response.data.data;
}

export async function createAward(payload: CreateAwardPayload) {
  const response = await apiClient.post<ApiResponse<AwardListItem>>('/awards', payload);

  return response.data.data;
}

export async function updateAward(id: string, payload: CreateAwardPayload) {
  const response = await apiClient.put<ApiResponse<AwardListItem>>(`/awards/${id}`, payload);

  return response.data.data;
}

export async function createAwardEdition(id: string, payload: CreateAwardEditionPayload) {
  const response = await apiClient.post<ApiResponse<AwardEdition>>(
    `/awards/${id}/editions`,
    payload
  );

  return response.data.data;
}

export async function updateAwardEdition(id: string, payload: CreateAwardEditionPayload) {
  const response = await apiClient.put<ApiResponse<AwardEdition>>(`/award-editions/${id}`, payload);

  return response.data.data;
}

export async function saveAwardRecipients(id: string, payload: SaveAwardRecipientsPayload) {
  const response = await apiClient.put<ApiResponse<AwardEdition>>(
    `/award-editions/${id}/recipients`,
    payload
  );

  return response.data.data;
}
