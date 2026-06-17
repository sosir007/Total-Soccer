export interface ClubListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
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
