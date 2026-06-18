export interface SummitQuery {
  confederationId?: string;
  countryId?: string;
  clubId?: string;
  playerTypeId?: string;
  minPa?: string;
  maxPa?: string;
}

export interface SummitCandidatesQuery extends SummitQuery {
  page?: string;
  pageSize?: string;
  group?: string;
}
