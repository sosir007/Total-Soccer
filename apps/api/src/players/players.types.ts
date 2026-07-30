interface NamedRef {
  id: string;
  uid?: string | null;
  name: string;
  shortName?: string | null;
  externalUrl?: string | null;
}

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

export interface PlayerHonorSummaryQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
  clubId?: string;
  position?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface PlayerPaEvaluationQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
  clubId?: string;
  position?: string;
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

export interface PlayerPaEvaluationPayload {
  pa?: number | string | null;
  initialPa?: number | string | null;
  reincarnationPa?: string;
  superDiamondPa?: string;
  websitePa?: string;
  doubaoPa?: string;
  dpPa?: string;
  yuanbaoPa?: string;
  qianwenPa?: string;
  geminiPa?: string;
  codexPa?: string;
  coreEvaluation?: string;
  playerPositioning?: string;
  teamContribution?: string;
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

export interface PlayerHonorPayload {
  name?: string;
  season?: string;
  score?: number | string | null;
  externalUrl?: string;
  remark?: string;
  sortOrder?: number | string | null;
}

export interface PlayerPaEvaluationRecord {
  id: string;
  playerId: string;
  initialPa?: number | null;
  reincarnationPa?: string | null;
  superDiamondPa?: string | null;
  websitePa?: string | null;
  doubaoPa?: string | null;
  dpPa?: string | null;
  yuanbaoPa?: string | null;
  qianwenPa?: string | null;
  geminiPa?: string | null;
  codexPa?: string | null;
  coreEvaluation?: string | null;
  playerPositioning?: string | null;
  teamContribution?: string | null;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
}

export interface PlayerPaEvaluationRow {
  id: string;
  uid: string;
  chineseName: string;
  englishName?: string | null;
  birthDate?: number | string | null;
  primaryRole?: string | null;
  positions?: string | null;
  country?: NamedRef | null;
  club?: (NamedRef & { exists?: boolean | null }) | null;
  pa?: number | null;
  evaluation?: PlayerPaEvaluationRecord | null;
}

export interface PlayerPaAdjustmentPayloadItem {
  playerId: string;
  pa?: number | string | null;
  remark?: string;
}

export interface PlayerPaAdjustmentBatchPayload {
  label?: string;
  remark?: string;
  items?: PlayerPaAdjustmentPayloadItem[];
}

export interface PlayerPaAdjustmentColumn {
  key: string;
  label: string;
  kind: 'initial' | 'batch';
  createdAt?: string | number | null;
}

export interface PlayerPaAdjustmentRow {
  id: string;
  uid: string;
  chineseName: string;
  englishName?: string | null;
  birthDate?: number | string | null;
  primaryRole?: string | null;
  positions?: string | null;
  country?: NamedRef | null;
  club?: (NamedRef & { exists?: boolean | null }) | null;
  initialPa?: number | null;
  currentPa?: number | null;
  values: Record<string, number | null>;
}

export interface PlayerPaAdjustmentResult {
  items: PlayerPaAdjustmentRow[];
  columns: PlayerPaAdjustmentColumn[];
  page: number;
  pageSize: number;
  total: number;
}
