export interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type LifecycleStatus = 'CURRENT' | 'DISCONTINUED';

export interface NamedRef {
  id: string;
  uid?: string;
  code?: string | null;
  name: string;
  externalUrl?: string | null;
  visibleInCatalog?: boolean | null;
  isHistorical?: boolean | null;
  detailRedirectCountryId?: string | null;
  detailRedirectCountry?: NamedRef | null;
  exists?: boolean | null;
}
