import type {
  CompetitionEditionStandingMode,
  CompetitionFormat,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@/services/types/competitions';

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
  enabled: boolean;
  includeInStats: boolean;
  sortOrder: number;
}
