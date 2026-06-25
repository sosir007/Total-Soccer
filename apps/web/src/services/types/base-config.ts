export type BaseConfigType =
  | 'confederations'
  | 'positions'
  | 'player-types'
  | 'potential-ranges'
  | 'ethnicities'
  | 'hair-colors'
  | 'preferred-feet'
  | 'cities';

export interface BaseConfigItem {
  id: string;
  uid?: string | null;
  code?: string | null;
  name?: string | null;
  group?: string | null;
  description?: string | null;
  enabled?: boolean | null;
  sortOrder: number;
  countryId?: string | null;
  country?: {
    id: string;
    uid?: string | null;
    name: string;
  } | null;
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
  countryId?: string;
}
