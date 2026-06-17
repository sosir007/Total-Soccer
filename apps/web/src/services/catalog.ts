import { apiClient, type ApiResponse } from './api';

export interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface NamedRef {
  id: string;
  uid?: string;
  code?: string | null;
  name: string;
  externalUrl?: string | null;
}

export interface PlayerListItem {
  id: string;
  uid: string;
  chineseName: string;
  englishName?: string | null;
  externalUrl?: string | null;
  primaryRole?: string | null;
  positions?: string | null;
  ca?: number | null;
  pa?: number | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  retired?: boolean | null;
  deceased?: boolean | null;
  country?: NamedRef | null;
  club?: (NamedRef & { exists: boolean }) | null;
  confederationRef?: NamedRef | null;
  playerTypeRef?: NamedRef | null;
}

export interface PlayerDetail extends PlayerListItem {
  birthDate?: string | null;
  deathDate?: string | null;
  shirtNumber?: string | null;
  skinTone?: string | null;
  hairColor?: string | null;
  ethnicity?: string | null;
  foot?: string | null;
  playerType?: string | null;
  confederation?: string | null;
  nationality?: string | null;
  representedCountry?: string | null;
  birthCity?: string | null;
  primaryClub?: string | null;
  initialClub?: string | null;
  clubs?: string | null;
  marketValue?: number | null;
  databaseSource?: string | null;
  staffRoles?: string | null;
  achievement?: string | null;
  remark?: string | null;
  ethnicityRef?: NamedRef | null;
  hairColorRef?: NamedRef | null;
  preferredFootRef?: NamedRef | null;
}

export interface CountryListItem {
  id: string;
  uid: string;
  name: string;
  externalUrl?: string | null;
  federation?: string | null;
  playerCount?: number | null;
  totalPa?: number | null;
  averagePa?: number | null;
  medalCount?: number | null;
  championCount?: number | null;
  runnerUpCount?: number | null;
  thirdPlaceCount?: number | null;
  fourthPlaceCount?: number | null;
  majorChampionCount?: number | null;
  honorScore?: number | null;
  averageHonorScore?: number | null;
  federationRef?: NamedRef | null;
  _count?: {
    players: number;
    clubs: number;
  };
}

export type CountryDetail = CountryListItem;

export interface ClubListItem {
  id: string;
  uid: string;
  name: string;
  externalUrl?: string | null;
  exists: boolean;
  country?: string | null;
  federation?: string | null;
  playerCount?: number | null;
  totalPa?: number | null;
  averagePa?: number | null;
  trophyCount?: number | null;
  championCount?: number | null;
  runnerUpCount?: number | null;
  thirdPlaceCount?: number | null;
  fourthPlaceCount?: number | null;
  honorScore?: number | null;
  countryRef?: NamedRef | null;
  federationRef?: NamedRef | null;
  _count?: {
    players: number;
  };
}

export type ClubDetail = ClubListItem;

export interface PlayerListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
  clubId?: string;
  position?: string;
  playerTypeId?: string;
  minPa?: number;
  maxPa?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CountryListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  confederationId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClubListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function fetchPlayers(params: PlayerListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<PlayerListItem>>>('/players', {
    params
  });

  return response.data.data;
}

export async function fetchPlayerDetail(id: string) {
  const response = await apiClient.get<ApiResponse<PlayerDetail>>(`/players/${id}`);

  return response.data.data;
}

export async function fetchCountries(params: CountryListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<CountryListItem>>>(
    '/countries',
    {
      params
    }
  );

  return response.data.data;
}

export async function fetchCountryDetail(id: string) {
  const response = await apiClient.get<ApiResponse<CountryDetail>>(`/countries/${id}`);

  return response.data.data;
}

export async function fetchClubs(params: ClubListParams) {
  const response = await apiClient.get<ApiResponse<PaginationResult<ClubListItem>>>('/clubs', {
    params
  });

  return response.data.data;
}

export async function fetchClubDetail(id: string) {
  const response = await apiClient.get<ApiResponse<ClubDetail>>(`/clubs/${id}`);

  return response.data.data;
}
