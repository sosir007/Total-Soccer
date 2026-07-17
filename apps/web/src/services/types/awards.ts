import type { LifecycleStatus } from './common';

export interface AwardNamedRef {
  id: string;
  uid?: string;
  code?: string | null;
  name: string;
  externalUrl?: string | null;
  exists?: boolean;
  visibleInCatalog?: boolean;
}

export type AwardScopeType = 'WORLD' | 'CONFEDERATION' | 'COUNTRY' | 'LEAGUE' | 'CLUB' | 'MEDIA';
export type AwardTargetType = 'PLAYER' | 'COUNTRY' | 'CLUB';

export interface AwardListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  scopeType?: AwardScopeType;
  confederationId?: string;
  countryId?: string;
  lifecycleStatus?: LifecycleStatus;
  targetType?: AwardTargetType;
  enabled?: boolean;
}

export interface AwardRecipientListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  awardId?: string;
  scopeType?: AwardScopeType;
  targetType?: AwardTargetType;
  playerId?: string;
  countryId?: string;
  clubId?: string;
  placement?: string;
  year?: number;
}

export interface AwardListItem {
  id: string;
  code: string;
  name: string;
  externalUrl?: string | null;
  targetType: AwardTargetType;
  scopeType: AwardScopeType;
  category?: string | null;
  level?: string | null;
  description?: string | null;
  confederationId?: string | null;
  countryId?: string | null;
  lifecycleStatus: LifecycleStatus;
  enabled: boolean;
  sortOrder: number;
  confederation?: AwardNamedRef | null;
  country?: AwardNamedRef | null;
  _count?: {
    editions: number;
  };
}

export interface AwardEdition {
  id: string;
  awardId: string;
  name: string;
  season?: string | null;
  year?: number | null;
  externalUrl?: string | null;
  remark?: string | null;
  recipients?: AwardEditionRecipient[];
}

export interface AwardDetail extends AwardListItem {
  editions: AwardEdition[];
}

export interface AwardEditionRecipient {
  id: string;
  editionId: string;
  targetType: AwardTargetType;
  playerId?: string | null;
  countryId?: string | null;
  clubId?: string | null;
  rank?: number | null;
  placement?: string | null;
  externalUrl?: string | null;
  remark?: string | null;
  player?: {
    id: string;
    uid: string;
    chineseName: string;
    englishName?: string | null;
    externalUrl?: string | null;
    pa?: number | null;
    primaryRole?: string | null;
    positions?: string | null;
    country?: AwardNamedRef | null;
    club?: AwardNamedRef | null;
  } | null;
  country?: AwardNamedRef | null;
  club?: AwardNamedRef | null;
}

export interface AwardRecipientRecord extends AwardEditionRecipient {
  edition: Omit<AwardEdition, 'recipients'> & {
    award: AwardListItem;
  };
}

export interface CreateAwardPayload {
  code: string;
  name: string;
  externalUrl?: string;
  targetType: AwardTargetType;
  scopeType: AwardScopeType;
  category?: string;
  level?: string;
  description?: string;
  confederationId?: string;
  countryId?: string;
  lifecycleStatus?: LifecycleStatus;
  enabled?: boolean;
  sortOrder?: number;
}

export interface CreateAwardEditionPayload {
  name: string;
  season?: string;
  year?: number;
  externalUrl?: string;
  remark?: string;
}

export interface SaveAwardRecipientsPayload {
  recipients: Array<{
    playerId?: string;
    countryId?: string;
    clubId?: string;
    rank?: number | null;
    placement?: string;
    externalUrl?: string;
    remark?: string;
  }>;
}
