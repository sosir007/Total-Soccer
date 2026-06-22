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

export interface ClubPayload {
  uid?: string;
  name?: string;
  countryId?: string;
  confederationId?: string;
  exists?: boolean;
  externalUrl?: string;
  remark?: string;
}
