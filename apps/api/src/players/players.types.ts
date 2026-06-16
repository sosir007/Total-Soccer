export interface PlayerListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
  clubId?: string;
  position?: string;
  playerTypeId?: string;
  minPa?: string;
  maxPa?: string;
  sortBy?: string;
  sortOrder?: string;
}
