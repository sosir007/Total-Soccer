import type {
  AwardScopeType,
  AwardTargetType,
  CompetitionScopeType,
  CompetitionTargetType,
  HonorRuleConversionType,
  HonorRulePlacementScope
} from '@prisma/client';

export interface HonorRuleListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  targetType?: CompetitionTargetType;
  enabled?: string;
}

export interface HonorRulePayload {
  championScore?: number | string | null;
  runnerUpScore?: number | string | null;
  thirdPlaceScore?: number | string | null;
  fourthPlaceScore?: number | string | null;
  semiFinalistScore?: number | string | null;
  typicalCompetitionIds?: string[];
  remark?: string | null;
}

export interface TeamHonorRuleSummaryItem {
  id: string;
  name: string;
  targetTypes: AwardTargetType[];
  scopeType?: AwardScopeType | null;
  category?: string | null;
  typicalAwards: string;
  scoring: string;
  enabled: boolean;
  sortOrder: number;
  remark?: string | null;
}

export interface HonorRuleDefaultDefinition {
  code: string;
  name: string;
  targetType: CompetitionTargetType;
  category: string;
  level: string;
  format: string;
  scopeType?: CompetitionScopeType | null;
  baseScore: number;
  qualityCoefficient?: number;
  placementScope: HonorRulePlacementScope;
  conversionType: HonorRuleConversionType;
  championScore?: number | null;
  runnerUpScore?: number | null;
  thirdPlaceScore?: number | null;
  fourthPlaceScore?: number | null;
  semiFinalistScore?: number | null;
  sortOrder: number;
  remark?: string;
  confederationCoefficients?: Array<{
    matcher: string[];
    coefficient: number;
  }>;
  countryCoefficients?: Array<{
    uid: string;
    coefficient: number;
  }>;
}
