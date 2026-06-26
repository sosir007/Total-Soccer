import type { AwardRecipientRecord } from './awards';
import type { NamedRef } from './common';
import type { CompetitionStandingPlacement } from './competitions';

export interface HonorEditionRef {
  id: string;
  name: string;
  season?: string | null;
  year?: number | null;
  host?: string | null;
  remark?: string | null;
}

export interface HonorCompetitionRef {
  id: string;
  code: string;
  name: string;
  externalUrl?: string | null;
  targetType: 'COUNTRY' | 'CLUB';
  scopeType: 'GLOBAL' | 'CONFEDERATION' | 'COUNTRY' | 'CUSTOM';
  category?: string | null;
  level?: string | null;
  format?: string | null;
  confederation?: NamedRef | null;
  country?: NamedRef | null;
  scopeConfederations?: Array<{ confederation: NamedRef }>;
  scopeCountries?: Array<{ country: NamedRef }>;
}

export interface HonorRecord {
  id: string;
  placement: CompetitionStandingPlacement;
  remark?: string | null;
  country?: NamedRef | null;
  club?: (NamedRef & { exists?: boolean }) | null;
  competition: HonorCompetitionRef;
  edition: HonorEditionRef;
  standings: Partial<Record<CompetitionStandingPlacement, NamedRef | null>>;
}

export interface HonorSummaryCounts {
  totalCount: number;
  championCount: number;
  runnerUpCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
}

export interface HonorSummaryCompetition extends HonorCompetitionRef {
  counts?: HonorSummaryCounts;
}

export interface HonorSummaryRow extends HonorSummaryCounts {
  id: string;
  uid: string;
  name: string;
  countryRef?: NamedRef | null;
  federationRef?: NamedRef | null;
  honorScore?: number | null;
  competitionStats: Record<string, HonorSummaryCounts>;
}

export interface HonorGroupedPlacementEntry {
  id: string;
  label: string;
  year?: number | null;
  season?: string | null;
  host?: string | null;
  sourceName?: string | null;
}

export interface HonorGroupedRecord {
  competition: HonorCompetitionRef;
  placements: Partial<Record<CompetitionStandingPlacement, HonorGroupedPlacementEntry[]>>;
}

export type PlayerCareerType = 'CLUB' | 'COUNTRY';

export interface PlayerCareer {
  id: string;
  careerType: PlayerCareerType;
  clubId?: string | null;
  countryId?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  startSeason?: string | null;
  endSeason?: string | null;
  appearances?: number | null;
  goals?: number | null;
  assists?: number | null;
  cleanSheets?: number | null;
  goalsConceded?: number | null;
  position?: string | null;
  positionGroup?: string | null;
  showInProfile: boolean;
  isRepresentative: boolean;
  isLegend: boolean;
  sortOrder: number;
  remark?: string | null;
  club?: (NamedRef & { exists?: boolean }) | null;
  country?: NamedRef | null;
}

export interface CareerProfileLine {
  id: string;
  player: {
    id: string;
    uid: string;
    chineseName: string;
    englishName?: string | null;
    birthDate?: number | null;
    primaryRole?: string | null;
    positions?: string | null;
    pa?: number | null;
    externalUrl?: string | null;
  };
  position: string;
  positionGroup?: string | null;
  period?: string | null;
  appearances?: number | null;
  goals?: number | null;
  assists?: number | null;
  cleanSheets?: number | null;
  goalsConceded?: number | null;
  isLegend?: boolean | null;
  remark?: string | null;
}

export interface CareerTimelineGroup {
  decade: string;
  items: CareerProfileLine[];
}

export interface LineupPositionGroup {
  position: string;
  items: CareerProfileLine[];
}

export interface PlayerListItem {
  id: string;
  uid: string;
  chineseName: string;
  englishName?: string | null;
  birthDate?: number | string | null;
  deathDate?: number | string | null;
  externalUrl?: string | null;
  primaryRole?: string | null;
  positions?: string | null;
  ca?: number | null;
  pa?: number | null;
  honorScore?: number | null;
  awardCount?: number | null;
  topAwardCount?: number | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  shirtNumber?: string | null;
  skinTone?: string | null;
  hairColor?: string | null;
  ethnicity?: string | null;
  foot?: string | null;
  playerType?: string | null;
  confederation?: string | null;
  countryUid?: string | null;
  nationality?: string | null;
  representedCountry?: string | null;
  birthCityUid?: string | null;
  birthCity?: string | null;
  birthCountryId?: string | null;
  birthCityId?: string | null;
  clubUid?: string | null;
  primaryClub?: string | null;
  initialClub?: string | null;
  clubs?: string | null;
  marketValue?: number | null;
  retired?: boolean | null;
  deceased?: boolean | null;
  databaseSource?: string | null;
  staffRoles?: string | null;
  achievement?: string | null;
  remark?: string | null;
  country?: NamedRef | null;
  birthCountry?: NamedRef | null;
  birthCityRef?: (NamedRef & { country?: NamedRef | null }) | null;
  nationalities?: Array<{
    country: NamedRef;
  }>;
  club?: (NamedRef & { exists: boolean }) | null;
  confederationRef?: NamedRef | null;
  playerTypeRef?: NamedRef | null;
  ethnicityRef?: NamedRef | null;
  preferredFootRef?: NamedRef | null;
  careers?: PlayerCareer[];
  representativeClubCareer?: PlayerCareer | null;
  profileClubCareers?: PlayerCareer[];
  countryCareers?: PlayerCareer[];
  representativeClubName?: string | null;
  profileClubNames?: string[];
}

export interface PlayerDetail extends PlayerListItem {
  birthDate?: number | string | null;
  deathDate?: number | string | null;
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
  hairColorRef?: NamedRef | null;
  personalHonors?: AwardRecipientRecord[];
}

export interface CountryListItem {
  id: string;
  uid: string;
  name: string;
  externalUrl?: string | null;
  remark?: string | null;
  visibleInCatalog?: boolean | null;
  isHistorical?: boolean | null;
  detailRedirectCountryId?: string | null;
  detailRedirectCountry?: NamedRef | null;
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

export type CountryDetail = CountryListItem & {
  honorRecords?: HonorRecord[];
  honorGroups?: HonorGroupedRecord[];
  careerTimeline?: CareerTimelineGroup[];
  lineupByPosition?: LineupPositionGroup[];
};

export interface ClubListItem {
  id: string;
  uid: string;
  name: string;
  externalUrl?: string | null;
  remark?: string | null;
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

export type ClubDetail = ClubListItem & {
  honorRecords?: HonorRecord[];
  honorGroups?: HonorGroupedRecord[];
  careerTimeline?: CareerTimelineGroup[];
  lineupByPosition?: LineupPositionGroup[];
  representativeLineupByPosition?: LineupPositionGroup[];
};

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
  includeHidden?: boolean;
  includeHistorical?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CountryHonorListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  competitionId?: string;
  placement?: CompetitionStandingPlacement;
  year?: number;
  countryId?: string;
}

export interface CountryHonorSummaryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  competitionId?: string;
  countryId?: string;
}

export interface ClubListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  confederationId?: string;
  countryId?: string;
  includeHidden?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClubHonorListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  competitionId?: string;
  placement?: CompetitionStandingPlacement;
  year?: number;
  clubId?: string;
}

export interface ClubHonorSummaryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  competitionId?: string;
  clubId?: string;
}

export interface HonorSummaryResult<TItem> {
  items: TItem[];
  competitions: HonorSummaryCompetition[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CountryPayload {
  uid: string;
  name: string;
  confederationId?: string;
  externalUrl?: string;
  remark?: string;
  visibleInCatalog?: boolean;
}

export interface ClubPayload {
  uid: string;
  name: string;
  countryId?: string;
  confederationId?: string;
  exists: boolean;
  externalUrl?: string;
  remark?: string;
}

export interface PlayerPayload {
  uid: string;
  chineseName: string;
  englishName?: string;
  birthDate?: string | number;
  deathDate?: string | number;
  countryId?: string;
  nationalityIds?: string[];
  birthCountryId?: string;
  birthCityId?: string;
  clubId?: string;
  confederationId?: string;
  primaryRole?: string;
  position?: string;
  positions?: string;
  clubHistoryIds?: string[];
  playerTypeId?: string;
  ethnicityId?: string;
  hairColorId?: string;
  preferredFootId?: string;
  foot?: string;
  pa?: number | null;
  ca?: number | null;
  height?: number | null;
  weight?: number | null;
  shirtNumber?: string;
  skinTone?: string;
  birthCityUid?: string;
  birthCity?: string;
  initialClub?: string;
  clubs?: string;
  marketValue?: number | null;
  retired?: boolean | null;
  deceased?: boolean | null;
  databaseSource?: string;
  staffRoles?: string;
  achievement?: string;
  externalUrl?: string;
  remark?: string;
  careers?: PlayerCareerPayload[];
}

export interface PlayerCareerPayload {
  careerType: PlayerCareerType;
  clubId?: string | null;
  countryId?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  startSeason?: string;
  endSeason?: string;
  appearances?: number | null;
  goals?: number | null;
  assists?: number | null;
  cleanSheets?: number | null;
  goalsConceded?: number | null;
  position?: string;
  positionGroup?: string;
  showInProfile?: boolean;
  isRepresentative?: boolean;
  isLegend?: boolean;
  sortOrder?: number | null;
  remark?: string;
}
