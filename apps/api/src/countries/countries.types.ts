export interface CountryListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  confederationId?: string;
  sortBy?: string;
  sortOrder?: string;
  includeHidden?: string;
  includeHistorical?: string;
}

export interface CountryHonorListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  competitionId?: string;
  placement?: string;
  year?: string;
  countryId?: string;
}

export type CountryHonorSummaryQuery = Omit<CountryHonorListQuery, 'placement' | 'year'>;

export interface CountryPayload {
  uid?: string;
  name?: string;
  confederationId?: string;
  externalUrl?: string;
  remark?: string;
  visibleInCatalog?: boolean;
}
