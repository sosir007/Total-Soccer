import { ApiPrefix } from '../api-prefix';
import { api } from '../api';
import type {
  ClubDetail,
  ClubHonorListParams,
  ClubHonorSummaryParams,
  ClubListItem,
  ClubListParams,
  ClubPayload,
  CountryDetail,
  CountryHonorListParams,
  CountryHonorSummaryParams,
  CountryListItem,
  CountryListParams,
  CountryPayload,
  HonorRecord,
  HonorSummaryResult,
  HonorSummaryRow,
  PlayerDetail,
  PlayerListItem,
  PlayerListParams,
  PlayerPayload
} from '../types/catalog';
import type { PaginationResult } from '../types/common';

const playerPrefix = ApiPrefix.PLAYERS;
const countryPrefix = ApiPrefix.COUNTRIES;
const clubPrefix = ApiPrefix.CLUBS;

const API = {
  PLAYERS: {
    LIST: playerPrefix,
    DETAIL: (id: string) => `${playerPrefix}/${id}`
  },
  COUNTRIES: {
    LIST: countryPrefix,
    DETAIL: (id: string) => `${countryPrefix}/${id}`,
    HONORS: ApiPrefix.COUNTRY_HONORS
  },
  CLUBS: {
    LIST: clubPrefix,
    DETAIL: (id: string) => `${clubPrefix}/${id}`,
    HONORS: ApiPrefix.CLUB_HONORS
  }
} as const;

export async function fetchPlayers(params: PlayerListParams) {
  const response = await api.get<PaginationResult<PlayerListItem>>(API.PLAYERS.LIST, {
    params
  });

  return response;
}

export async function fetchPlayerDetail(id: string) {
  const response = await api.get<PlayerDetail>(API.PLAYERS.DETAIL(id));

  return response;
}

export async function createPlayer(payload: PlayerPayload) {
  const response = await api.post<PlayerDetail>(API.PLAYERS.LIST, payload);

  return response;
}

export async function updatePlayer(id: string, payload: PlayerPayload) {
  const response = await api.put<PlayerDetail>(API.PLAYERS.DETAIL(id), payload);

  return response;
}

export async function deletePlayer(id: string) {
  const response = await api.delete<{ id: string }>(API.PLAYERS.DETAIL(id));

  return response;
}

export async function fetchCountries(params: CountryListParams) {
  const response = await api.get<PaginationResult<CountryListItem>>(API.COUNTRIES.LIST, {
    params
  });

  return response;
}

export async function fetchCountryDetail(id: string) {
  const response = await api.get<CountryDetail>(API.COUNTRIES.DETAIL(id));

  return response;
}

export async function createCountry(payload: CountryPayload) {
  const response = await api.post<CountryDetail>(API.COUNTRIES.LIST, payload);

  return response;
}

export async function updateCountry(id: string, payload: CountryPayload) {
  const response = await api.put<CountryDetail>(API.COUNTRIES.DETAIL(id), payload);

  return response;
}

export async function deleteCountry(id: string) {
  const response = await api.delete<{ id: string }>(API.COUNTRIES.DETAIL(id));

  return response;
}

export async function fetchCountryHonors(params: CountryHonorListParams) {
  const response = await api.get<PaginationResult<HonorRecord>>(API.COUNTRIES.HONORS, {
    params
  });

  return response;
}

export async function fetchCountryHonorSummary(params: CountryHonorSummaryParams) {
  const response = await api.get<HonorSummaryResult<HonorSummaryRow>>(
    `${API.COUNTRIES.HONORS}/summary`,
    {
      params
    }
  );

  return response;
}

export async function fetchClubs(params: ClubListParams) {
  const response = await api.get<PaginationResult<ClubListItem>>(API.CLUBS.LIST, {
    params
  });

  return response;
}

export async function fetchClubDetail(id: string) {
  const response = await api.get<ClubDetail>(API.CLUBS.DETAIL(id));

  return response;
}

export async function createClub(payload: ClubPayload) {
  const response = await api.post<ClubDetail>(API.CLUBS.LIST, payload);

  return response;
}

export async function updateClub(id: string, payload: ClubPayload) {
  const response = await api.put<ClubDetail>(API.CLUBS.DETAIL(id), payload);

  return response;
}

export async function deleteClub(id: string) {
  const response = await api.delete<{ id: string }>(API.CLUBS.DETAIL(id));

  return response;
}

export async function fetchClubHonors(params: ClubHonorListParams) {
  const response = await api.get<PaginationResult<HonorRecord>>(API.CLUBS.HONORS, {
    params
  });

  return response;
}

export async function fetchClubHonorSummary(params: ClubHonorSummaryParams) {
  const response = await api.get<HonorSummaryResult<HonorSummaryRow>>(
    `${API.CLUBS.HONORS}/summary`,
    {
      params
    }
  );

  return response;
}
