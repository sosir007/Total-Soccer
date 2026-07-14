import type {
  CompetitionScopeType,
  CompetitionEditionStandingMode,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  LifecycleStatus
} from '@prisma/client';

export interface CompetitionListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  targetType?: CompetitionTargetType;
  scopeType?: CompetitionScopeType;
  confederationId?: string;
  countryId?: string;
  lifecycleStatus?: LifecycleStatus;
  enabled?: string;
  includeInStats?: string;
}

export interface CreateCompetitionBody {
  code?: string;
  name?: string;
  alias?: string;
  externalUrl?: string;
  targetType?: CompetitionTargetType;
  scopeType?: CompetitionScopeType;
  category?: string;
  level?: string;
  format?: string;
  description?: string;
  confederationId?: string;
  confederationIds?: string[];
  countryId?: string;
  countryIds?: string[];
  lifecycleStatus?: LifecycleStatus;
  enabled?: boolean;
  includeInStats?: boolean;
  sortOrder?: number;
}

export type UpdateCompetitionBody = CreateCompetitionBody;

export interface CreateCompetitionEditionBody {
  name?: string;
  season?: string;
  year?: number;
  quantity?: number;
  standingMode?: CompetitionEditionStandingMode;
  host?: string;
  remark?: string;
}

export type UpdateCompetitionEditionBody = CreateCompetitionEditionBody;

export interface SaveCompetitionStandingsBody {
  standingMode?: CompetitionEditionStandingMode;
  standings?: Array<{
    placement?: CompetitionStandingPlacement;
    standingOrder?: number | null;
    countryId?: string | null;
    clubId?: string | null;
    remark?: string | null;
  }>;
}
