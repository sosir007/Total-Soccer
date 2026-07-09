export interface ClubListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
  includeHidden?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ClubHonorListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  competitionId?: string;
  placement?: string;
  year?: string;
  clubId?: string;
}

export type ClubHonorSummaryQuery = Omit<ClubHonorListQuery, 'placement' | 'year'>;

export interface ClubPayload {
  uid?: string;
  name?: string;
  formerName?: string;
  alias?: string;
  countryId?: string;
  confederationId?: string;
  exists?: boolean;
  visibleInCatalog?: boolean;
  externalUrl?: string;
  remark?: string;
}
