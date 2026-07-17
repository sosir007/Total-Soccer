import type { AwardScopeType, AwardTargetType, LifecycleStatus } from '@prisma/client';

export interface AwardListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  scopeType?: AwardScopeType;
  confederationId?: string;
  countryId?: string;
  targetType?: AwardTargetType;
  lifecycleStatus?: LifecycleStatus;
  enabled?: string;
}

export interface AwardRecipientListQuery {
  page?: string;
  pageSize?: string;
  keyword?: string;
  awardId?: string;
  scopeType?: AwardScopeType;
  targetType?: AwardTargetType;
  playerId?: string;
  countryId?: string;
  clubId?: string;
  placement?: string;
  year?: string;
}

export interface CreateAwardBody {
  code?: string;
  name?: string;
  externalUrl?: string;
  targetType?: AwardTargetType;
  scopeType?: AwardScopeType;
  category?: string;
  level?: string;
  description?: string;
  confederationId?: string;
  countryId?: string;
  lifecycleStatus?: LifecycleStatus;
  enabled?: boolean;
  sortOrder?: number;
}

export type UpdateAwardBody = CreateAwardBody;

export interface CreateAwardEditionBody {
  name?: string;
  season?: string;
  year?: number;
  externalUrl?: string;
  remark?: string;
}

export type UpdateAwardEditionBody = CreateAwardEditionBody;

export interface SaveAwardRecipientsBody {
  recipients?: Array<{
    playerId?: string;
    countryId?: string;
    clubId?: string;
    rank?: number;
    placement?: string;
    externalUrl?: string;
    remark?: string;
  }>;
}
