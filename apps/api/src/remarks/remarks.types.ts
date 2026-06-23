import type { PaginationQuery } from '../common/pagination.js';

export type RemarkObjectType =
  | 'PLAYER'
  | 'COUNTRY'
  | 'CLUB'
  | 'COMPETITION'
  | 'AWARD'
  | 'CITY'
  | 'BASE_CONFIG';

export interface RemarkListQuery extends PaginationQuery {
  keyword?: string;
  objectType?: RemarkObjectType;
  hasRemark?: string;
}

export interface RemarkItem {
  id: string;
  objectType: RemarkObjectType;
  objectTypeLabel: string;
  objectId: string;
  code?: string | null;
  name: string;
  content: string;
  sourceField: 'remark' | 'description';
  updatedAt?: Date | null;
  routeName?: string;
  routeParams?: Record<string, string>;
  managementRouteName?: string;
  subType?: string;
}
