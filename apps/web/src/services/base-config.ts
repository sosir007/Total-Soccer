import { apiClient, type ApiResponse } from './api';
import type { PaginationResult } from './catalog';

export type BaseConfigType =
  | 'confederations'
  | 'positions'
  | 'player-types'
  | 'potential-ranges'
  | 'ethnicities'
  | 'hair-colors'
  | 'preferred-feet';

export interface BaseConfigItem {
  id: string;
  uid?: string | null;
  code?: string | null;
  name?: string | null;
  group?: string | null;
  description?: string | null;
  enabled?: boolean | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseConfigListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface BaseConfigPayload {
  uid?: string;
  code?: string;
  name?: string;
  group?: string;
  description?: string;
  enabled?: boolean;
  sortOrder?: number;
}

export async function fetchBaseConfigs(type: BaseConfigType, params: BaseConfigListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<BaseConfigItem>>>(
    `/base-config/${type}`,
    {
      params
    }
  );

  return response.data.data;
}

export async function createBaseConfig(type: BaseConfigType, payload: BaseConfigPayload) {
  const response = await apiClient.post<ApiResponse<BaseConfigItem>>(
    `/base-config/${type}`,
    payload
  );

  return response.data.data;
}

export async function updateBaseConfig(
  type: BaseConfigType,
  id: string,
  payload: BaseConfigPayload
) {
  const response = await apiClient.put<ApiResponse<BaseConfigItem>>(
    `/base-config/${type}/${id}`,
    payload
  );

  return response.data.data;
}
