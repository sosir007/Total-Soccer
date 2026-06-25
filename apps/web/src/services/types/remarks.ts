export type RemarkObjectType =
  | 'PLAYER'
  | 'COUNTRY'
  | 'CLUB'
  | 'COMPETITION'
  | 'AWARD'
  | 'CITY'
  | 'BASE_CONFIG';

export interface RemarkListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  objectType?: RemarkObjectType;
  hasRemark?: 'true' | 'false' | 'all';
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
  updatedAt?: string | null;
  routeName?: string;
  routeParams?: Record<string, string>;
  managementRouteName?: string;
  subType?: string;
}
