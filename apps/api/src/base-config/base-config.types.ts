export type BaseConfigType =
  | 'confederations'
  | 'positions'
  | 'player-types'
  | 'potential-ranges'
  | 'ethnicities'
  | 'hair-colors'
  | 'preferred-feet';

export interface BaseConfigQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
}

export interface BaseConfigBody {
  uid?: string;
  code?: string;
  name?: string;
  group?: string;
  description?: string;
  enabled?: boolean;
  sortOrder?: number;
}
