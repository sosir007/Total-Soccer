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
  PlayerAwardRecipientGroupPayload,
  PlayerAwardRecipientPayload,
  PlayerDetail,
  PlayerCareerPayload,
  PlayerListItem,
  PlayerListParams,
  PlayerPayload,
  PlayerTeamHonor,
  PlayerTeamHonorPayload,
  SavePlayerCareersPayload,
  TeamHonorStandingOption,
  TeamHonorStandingOptionParams
} from '../types/catalog';
import type { AwardRecipientRecord } from '../types/awards';
import type { PaginationResult } from '../types/common';

const playerPrefix = ApiPrefix.PLAYERS;
const countryPrefix = ApiPrefix.COUNTRIES;
const clubPrefix = ApiPrefix.CLUBS;

const API = {
  PLAYERS: {
    LIST: playerPrefix,
    DETAIL: (id: string) => `${playerPrefix}/${id}`,
    CAREERS: (id: string) => `${playerPrefix}/${id}/careers`,
    AWARD_RECIPIENTS: (id: string) => `${playerPrefix}/${id}/award-recipients`,
    AWARD_RECIPIENT_GROUPS: (id: string) => `${playerPrefix}/${id}/award-recipient-groups`,
    AWARD_RECIPIENT_DETAIL: (id: string, recipientId: string) =>
      `${playerPrefix}/${id}/award-recipients/${recipientId}`,
    TEAM_HONORS: (id: string) => `${playerPrefix}/${id}/team-honors`,
    TEAM_HONOR_DETAIL: (id: string, honorId: string) =>
      `${playerPrefix}/${id}/team-honors/${honorId}`,
    TEAM_HONOR_STANDINGS: `${playerPrefix}/team-honor-standings`
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

export async function savePlayerCareers(id: string, careers: PlayerCareerPayload[]) {
  const payload: SavePlayerCareersPayload = { careers };
  const response = await api.put<PlayerDetail>(API.PLAYERS.CAREERS(id), payload);

  return response;
}

export async function createPlayerAwardRecipient(id: string, payload: PlayerAwardRecipientPayload) {
  const response = await api.post<AwardRecipientRecord>(API.PLAYERS.AWARD_RECIPIENTS(id), payload);

  return response;
}

export async function updatePlayerAwardRecipient(
  id: string,
  recipientId: string,
  payload: PlayerAwardRecipientPayload
) {
  const response = await api.put<AwardRecipientRecord>(
    API.PLAYERS.AWARD_RECIPIENT_DETAIL(id, recipientId),
    payload
  );

  return response;
}

export async function savePlayerAwardRecipientGroup(
  id: string,
  payload: PlayerAwardRecipientGroupPayload
) {
  const response = await api.put<AwardRecipientRecord[]>(
    API.PLAYERS.AWARD_RECIPIENT_GROUPS(id),
    payload
  );

  return response;
}

export async function deletePlayerAwardRecipient(id: string, recipientId: string) {
  const response = await api.delete<{ id: string }>(
    API.PLAYERS.AWARD_RECIPIENT_DETAIL(id, recipientId)
  );

  return response;
}

export async function fetchPlayerTeamHonors(id: string) {
  const response = await api.get<PlayerTeamHonor[]>(API.PLAYERS.TEAM_HONORS(id));

  return response;
}

export async function createPlayerTeamHonor(id: string, payload: PlayerTeamHonorPayload) {
  const response = await api.post<PlayerTeamHonor>(API.PLAYERS.TEAM_HONORS(id), payload);

  return response;
}

export async function updatePlayerTeamHonor(
  id: string,
  honorId: string,
  payload: PlayerTeamHonorPayload
) {
  const response = await api.put<PlayerTeamHonor>(
    API.PLAYERS.TEAM_HONOR_DETAIL(id, honorId),
    payload
  );

  return response;
}

export async function deletePlayerTeamHonor(id: string, honorId: string) {
  const response = await api.delete<{ id: string }>(API.PLAYERS.TEAM_HONOR_DETAIL(id, honorId));

  return response;
}

export async function fetchTeamHonorStandingOptions(params: TeamHonorStandingOptionParams) {
  const response = await api.get<PaginationResult<TeamHonorStandingOption>>(
    API.PLAYERS.TEAM_HONOR_STANDINGS,
    {
      params
    }
  );

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
