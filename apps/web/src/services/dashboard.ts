import { apiClient, type ApiResponse } from './api';
import type { NamedRef } from './catalog';

export interface DistributionItem {
  name: string;
  count: number;
}

export interface PaDistributionItem {
  label: string;
  min: number | null;
  max: number | null;
  count: number;
}

export interface NamedDistributionItem extends DistributionItem {
  id: string | null;
  uid?: string | null;
  code?: string | null;
}

export interface DashboardRankItem {
  id: string;
  uid: string;
  name: string;
  honorScore?: number | null;
  championCount?: number | null;
  runnerUpCount?: number | null;
  thirdPlaceCount?: number | null;
  fourthPlaceCount?: number | null;
  medalCount?: number | null;
  trophyCount?: number | null;
  countryRef?: NamedRef | null;
  federationRef?: NamedRef | null;
}

export interface WorldOverview {
  summary: {
    playerCount: number;
    countryCount: number;
    clubCount: number;
    honorRuleCount: number;
    averagePa?: number | null;
    highestPa?: number | null;
  };
  paDistribution: PaDistributionItem[];
  positionDistribution: DistributionItem[];
  confederationDistribution: NamedDistributionItem[];
  playerTypeDistribution: NamedDistributionItem[];
  topCountries: DashboardRankItem[];
  topClubs: DashboardRankItem[];
}

export async function fetchWorldOverview() {
  const response = await apiClient.get<ApiResponse<WorldOverview>>('/dashboard/overview');

  return response.data.data;
}
