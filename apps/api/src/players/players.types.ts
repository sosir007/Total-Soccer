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

export interface TeamHonorStandingOptionQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  targetType?: 'COUNTRY' | 'CLUB';
  competitionId?: string;
  countryId?: string;
  clubId?: string;
}

export interface PlayerPayload {
  uid?: string;
  chineseName?: string;
  englishName?: string;
  birthDate?: string;
  deathDate?: string;
  countryId?: string;
  nationalityIds?: string[];
  birthCountryId?: string;
  birthCityId?: string;
  clubId?: string;
  confederationId?: string;
  initialClubId?: string;
  primaryRole?: string;
  position?: string;
  positions?: string;
  clubHistoryIds?: string[];
  playerTypeId?: string;
  ethnicityId?: string;
  hairColorId?: string;
  preferredFootId?: string;
  foot?: string;
  pa?: number | string | null;
  ca?: number | string | null;
  height?: number | string | null;
  weight?: number | string | null;
  shirtNumber?: string;
  skinTone?: string;
  birthCityUid?: string;
  birthCity?: string;
  initialClub?: string;
  clubs?: string;
  marketValue?: number | string | null;
  retired?: boolean | string | null;
  deceased?: boolean | string | null;
  databaseSource?: string;
  staffRoles?: string;
  achievement?: string;
  externalUrl?: string;
  remark?: string;
  careers?: PlayerCareerPayload[];
}

export interface PlayerCareerPayload {
  careerType?: 'CLUB' | 'COUNTRY';
  clubId?: string | null;
  countryId?: string | null;
  startYear?: number | string | null;
  endYear?: number | string | null;
  startSeason?: string;
  endSeason?: string;
  appearances?: number | string | null;
  goals?: number | string | null;
  assists?: number | string | null;
  cleanSheets?: number | string | null;
  goalsConceded?: number | string | null;
  position?: string;
  positionGroup?: string;
  showInProfile?: boolean | string | null;
  isRepresentative?: boolean | string | null;
  isLegend?: boolean | string | null;
  sortOrder?: number | string | null;
  remark?: string;
}

export interface SavePlayerCareersBody {
  careers?: PlayerCareerPayload[];
}

export interface PlayerAwardRecipientPayload {
  editionId?: string;
  rank?: number | string | null;
  placement?: string;
  externalUrl?: string;
  remark?: string;
}

export interface SavePlayerAwardRecipientGroupBody {
  awardId?: string;
  recipients?: PlayerAwardRecipientPayload[];
}

export interface PlayerTeamHonorPayload {
  standingId?: string;
  careerId?: string | null;
  sourceType?: 'MANUAL' | 'CAREER_MATCH' | 'IMPORT';
  status?: 'CONFIRMED' | 'PENDING' | 'EXCLUDED';
  remark?: string;
}
