import type {
  CompetitionFormat,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType
} from '@/services/competitions';

export type StandingForm = Record<
  CompetitionStandingPlacement,
  { countryId: string; clubId: string }
>;

export interface EditionRow {
  clientId: string;
  id?: string;
  year: string;
  season: string;
  quantity: number | undefined;
  host: string;
  remark: string;
  standings: StandingForm;
  locked: boolean;
}

export interface CompetitionDetailForm {
  code: string;
  name: string;
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
