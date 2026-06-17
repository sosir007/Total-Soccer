import type {
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@prisma/client';

export interface CompetitionListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  targetType?: CompetitionTargetType;
  scopeType?: CompetitionScopeType;
  confederationId?: string;
  countryId?: string;
  enabled?: string;
}

export interface CreateCompetitionBody {
  code?: string;
  name?: string;
  externalUrl?: string;
  targetType?: CompetitionTargetType;
  scopeType?: CompetitionScopeType;
  category?: string;
  level?: string;
  confederationId?: string;
  countryId?: string;
  enabled?: boolean;
  sortOrder?: number;
}

export interface CreateCompetitionEditionBody {
  name?: string;
  season?: string;
  year?: number;
  host?: string;
  remark?: string;
}

export type UpdateCompetitionEditionBody = CreateCompetitionEditionBody;

export interface SaveCompetitionStandingsBody {
  standings?: Array<{
    placement?: CompetitionStandingPlacement;
    countryId?: string | null;
    clubId?: string | null;
    remark?: string | null;
  }>;
}
