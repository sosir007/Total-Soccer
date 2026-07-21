import type {
  CompetitionEditionStandingMode,
  CompetitionFormat,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@/services/types/competitions';
import type { LifecycleStatus } from '@/services/types/common';

export type StandingSlot = { countryId: string; clubId: string };
export type StandingForm = Record<string, StandingSlot>;

export interface PlacementField {
  key: string;
  label: string;
  placement: CompetitionStandingPlacement;
  standingOrder: number;
}

export interface EditionRow {
  clientId: string;
  id?: string;
  year: string;
  season: string;
  quantity: number | undefined;
  standingMode: CompetitionEditionStandingMode;
  host: string;
  externalUrl: string;
  remark: string;
  standings: StandingForm;
  locked: boolean;
}

export interface CompetitionDetailForm {
  code: string;
  name: string;
  alias: string;
  externalUrl: string;
  targetType: CompetitionTargetType;
  scopeType: CompetitionScopeType;
  category: string;
  level: string;
  format: '' | CompetitionFormat;
  description: string;
  confederationId: string;
  confederationIds: string[];
  countryId: string;
  countryIds: string[];
  lifecycleStatus: LifecycleStatus;
  enabled: boolean;
  includeInStats: boolean;
  sortOrder: number;
}
