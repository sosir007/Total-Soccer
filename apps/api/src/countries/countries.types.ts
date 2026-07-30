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

export type CountryHonorSummaryQuery = Omit<CountryHonorListQuery, 'placement' | 'year'> & {
  confederationId?: string;
  sortBy?: string;
  sortOrder?: string;
};

export interface CountryPayload {
  uid?: string;
  name?: string;
  englishName?: string;
  shortName?: string;
  confederationId?: string;
  externalUrl?: string;
  remark?: string;
  visibleInCatalog?: boolean;
}
