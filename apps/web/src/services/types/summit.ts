import type { NamedRef } from './common';
import type { PlayerListItem } from './catalog';

export type SummitGroup = '门将' | '后卫' | '中场' | '边锋' | '前锋';

export interface SummitParams {
  confederationId?: string;
  countryId?: string;
  clubId?: string;
  playerTypeId?: string;
  minPa?: number;
  maxPa?: number;
}

export interface SummitCandidateParams extends SummitParams {
  page?: number;
  pageSize?: number;
  group?: SummitGroup;
}

export interface SummitStarter {
  slot: string;
  label: string;
  group: SummitGroup;
  player: PlayerListItem | null;
}

export interface SummitBenchGroup {
  group: SummitGroup;
  players: PlayerListItem[];
}

export interface SummitLineup {
  formation: string;
  groups: SummitGroup[];
  starters: SummitStarter[];
  benchCandidates: SummitBenchGroup[];
}

export interface SummitPlayerTypeOption extends NamedRef {
  count?: number;
}
