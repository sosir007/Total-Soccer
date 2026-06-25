import type { NamedRef } from './common';

export type CompetitionTargetType = 'COUNTRY' | 'CLUB';
export type CompetitionScopeType = 'GLOBAL' | 'CONFEDERATION' | 'COUNTRY' | 'CUSTOM';
export type CompetitionCategory = '国际' | '洲际' | '国内' | '其他';
export type CompetitionLevel = '一级' | '二级' | '三级';
export type CompetitionFormat = '联赛' | '杯赛' | '其他';
export type CompetitionStandingPlacement =
  | 'CHAMPION'
  | 'RUNNER_UP'
  | 'THIRD_PLACE'
  | 'FOURTH_PLACE';

export interface CompetitionListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  targetType?: CompetitionTargetType;
  scopeType?: CompetitionScopeType;
  confederationId?: string;
  countryId?: string;
  enabled?: string;
}

export interface CompetitionListItem {
  id: string;
  code: string;
  name: string;
  externalUrl?: string | null;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category?: string | null;
  level?: string | null;
  format?: string | null;
  description?: string | null;
  confederationId?: string | null;
  countryId?: string | null;
  enabled: boolean;
  includeInStats: boolean;
  sortOrder: number;
  confederation?: NamedRef | null;
  country?: NamedRef | null;
  scopeConfederations?: Array<{ confederation: NamedRef }>;
  scopeCountries?: Array<{ country: NamedRef }>;
  _count?: {
    editions: number;
  };
}

export interface CompetitionStanding {
  id: string;
  placement: CompetitionStandingPlacement;
  countryId?: string | null;
  clubId?: string | null;
  remark?: string | null;
  country?:
    | (NamedRef & {
        visibleInCatalog?: boolean | null;
        isHistorical?: boolean | null;
        detailRedirectCountryId?: string | null;
        detailRedirectCountry?: NamedRef | null;
      })
    | null;
  club?: NamedRef | null;
}

export interface CompetitionEdition {
  id: string;
  name: string;
  season?: string | null;
  year?: number | null;
  quantity?: number | null;
  host?: string | null;
  remark?: string | null;
  standings: CompetitionStanding[];
}

export interface CompetitionDetail extends CompetitionListItem {
  editions: CompetitionEdition[];
}

export interface CreateCompetitionPayload {
  code: string;
  name: string;
  externalUrl?: string;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category?: string;
  level?: string;
  format?: string;
  description?: string;
  confederationId?: string;
  confederationIds?: string[];
  countryId?: string;
  countryIds?: string[];
  enabled?: boolean;
  includeInStats?: boolean;
  sortOrder?: number;
}

export interface CreateCompetitionEditionPayload {
  name: string;
  season?: string;
  year?: number;
  quantity?: number;
  host?: string;
  remark?: string;
}

export interface SaveCompetitionStandingsPayload {
  standings: Array<{
    placement: CompetitionStandingPlacement;
    countryId?: string | null;
    clubId?: string | null;
    remark?: string | null;
  }>;
}
