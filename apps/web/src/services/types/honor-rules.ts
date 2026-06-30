import type {
  CompetitionFormat,
  CompetitionScopeType,
  CompetitionTargetType
} from './competitions';
import type { NamedRef } from './common';

export type HonorRulePlacementScope =
  | 'TOP_FOUR'
  | 'TOP_THREE'
  | 'TOP_TWO'
  | 'LEAGUE_TOP_THREE'
  | 'CHAMPION_ONLY';

export type HonorRuleConversionType =
  | 'NONE'
  | 'FREQUENCY_SCALE'
  | 'OLYMPIC_STAGE'
  | 'CLUB_WORLD_CUP_STAGE';

export interface HonorRuleListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  targetType?: CompetitionTargetType;
  enabled?: string;
}

export interface HonorRuleCompetitionRef {
  competition: NamedRef & {
    code: string;
    targetType: CompetitionTargetType;
    category?: string | null;
    level?: string | null;
    format?: CompetitionFormat | string | null;
  };
}

export interface HonorRuleCoefficient {
  id: string;
  confederation?: (NamedRef & { code?: string | null }) | null;
  country?: NamedRef | null;
  coefficient: number;
}

export interface HonorRuleItem {
  id: string;
  code: string;
  name: string;
  targetType: CompetitionTargetType;
  category?: string | null;
  level?: string | null;
  format?: CompetitionFormat | string | null;
  scopeType?: CompetitionScopeType | null;
  baseScore: number;
  championScore?: number | null;
  runnerUpScore?: number | null;
  thirdPlaceScore?: number | null;
  fourthPlaceScore?: number | null;
  semiFinalistScore?: number | null;
  coefficient: number;
  qualityCoefficient: number;
  placementScope: HonorRulePlacementScope;
  conversionType: HonorRuleConversionType;
  enabled: boolean;
  isSystem: boolean;
  sortOrder: number;
  remark?: string | null;
  confederation?: (NamedRef & { code?: string | null }) | null;
  country?: NamedRef | null;
  typicalCompetitions?: HonorRuleCompetitionRef[];
  coefficients?: HonorRuleCoefficient[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HonorRulePayload {
  championScore?: number | null;
  runnerUpScore?: number | null;
  thirdPlaceScore?: number | null;
  fourthPlaceScore?: number | null;
  semiFinalistScore?: number | null;
  typicalCompetitionIds?: string[];
  remark?: string | null;
}

export interface HonorRecalculateResult {
  countryCount: number;
  clubCount: number;
  standingCount: number;
  enabledRuleCount: number;
  scoredCountryCount: number;
  scoredClubCount: number;
}
