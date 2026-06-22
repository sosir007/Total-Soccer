export interface CountryListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  confederationId?: string;
  sortBy?: string;
  sortOrder?: string;
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

export interface CountryPayload {
  uid?: string;
  name?: string;
  confederationId?: string;
  externalUrl?: string;
  remark?: string;
}
