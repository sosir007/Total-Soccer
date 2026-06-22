import type { CompetitionStandingPlacement, CompetitionTargetType } from '@prisma/client';

export interface HonorRuleListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  targetType?: CompetitionTargetType;
  placement?: CompetitionStandingPlacement;
  enabled?: string;
}

export interface HonorRulePayload {
  code?: string;
  name?: string;
  targetType?: CompetitionTargetType;
  category?: string;
  placement?: CompetitionStandingPlacement;
  baseScore?: number;
  coefficient?: number;
  enabled?: boolean;
  sortOrder?: number;
  remark?: string;
}
