import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type {
  BaseConfigItem,
  BaseConfigListParams,
  BaseConfigPayload,
  BaseConfigType
} from '../types/base-config';
import type { PaginationResult } from '../types/common';

const prefix = ApiPrefix.BASE_CONFIG;

const API = {
  LIST: (type: BaseConfigType) => `${prefix}/${type}`,
  DETAIL: (type: BaseConfigType, id: string) => `${prefix}/${type}/${id}`
} as const;

export async function fetchBaseConfigs(type: BaseConfigType, params: BaseConfigListParams) {
  const response = await api.get<PaginationResult<BaseConfigItem>>(API.LIST(type), {
    params
  });

  return response;
}

export async function createBaseConfig(type: BaseConfigType, payload: BaseConfigPayload) {
  const response = await api.post<BaseConfigItem>(API.LIST(type), payload);

  return response;
}

export async function updateBaseConfig(
  type: BaseConfigType,
  id: string,
  payload: BaseConfigPayload
) {
  const response = await api.put<BaseConfigItem>(API.DETAIL(type, id), payload);

  return response;
}

export async function deleteBaseConfig(type: BaseConfigType, id: string) {
  const response = await api.delete<{ id: string }>(API.DETAIL(type, id));

  return response;
}
