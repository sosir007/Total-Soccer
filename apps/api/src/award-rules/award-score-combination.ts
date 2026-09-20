import { AwardScopeType } from '@prisma/client';

const DOMESTIC_LEAGUE_PRIMARY_COMPREHENSIVE_CATEGORY = '国联一级综合奖';
const DOMESTIC_LEAGUE_MONTHLY_CATEGORY = '国联月度奖';

export type LeagueComprehensiveAwardCandidate = {
  recipientId: string;
  playerId: string;
  scopeType: AwardScopeType;
  category: string | null;
  competitionId: string | null;
  competitionEditionId: string | null;
  period: string;
  score: number;
  awardSortOrder: number;
  awardCode: string;
};

export type MonthlyAwardCandidate = {
  recipientId: string;
  playerId: string;
  category: string | null;
  competitionId: string | null;
  period: string;
  awardCode: string;
};

export function buildLeagueComprehensiveAwardGroupKey(
  candidate: Pick<
    LeagueComprehensiveAwardCandidate,
    'playerId' | 'scopeType' | 'category' | 'competitionId' | 'competitionEditionId' | 'period'
  >
) {
  if (
    candidate.scopeType !== AwardScopeType.LEAGUE ||
    candidate.category?.trim() !== DOMESTIC_LEAGUE_PRIMARY_COMPREHENSIVE_CATEGORY
  ) {
    return null;
  }

  if (candidate.competitionEditionId) {
    return `${candidate.playerId}|competition-edition:${candidate.competitionEditionId}`;
  }

  const period = candidate.period.trim().toLocaleLowerCase('zh-CN');

  if (!candidate.competitionId || !period || period === '-') {
    return null;
  }

  return `${candidate.playerId}|competition:${candidate.competitionId}|period:${period}`;
}

export function selectHighestLeagueComprehensiveAwardRecipientIds<
  T extends LeagueComprehensiveAwardCandidate
>(candidates: T[]) {
  const winnerByGroup = new Map<string, T>();

  for (const candidate of candidates) {
    const groupKey = buildLeagueComprehensiveAwardGroupKey(candidate);

    if (!groupKey) {
      continue;
    }

    const currentWinner = winnerByGroup.get(groupKey);

    if (!currentWinner || compareCandidates(candidate, currentWinner) < 0) {
      winnerByGroup.set(groupKey, candidate);
    }
  }

  return new Set([...winnerByGroup.values()].map((candidate) => candidate.recipientId));
}

export function buildMonthlyAwardGroupKey(
  candidate: Pick<
    MonthlyAwardCandidate,
    'playerId' | 'category' | 'competitionId' | 'period' | 'awardCode'
  >
) {
  if (candidate.category?.trim() !== DOMESTIC_LEAGUE_MONTHLY_CATEGORY) {
    return null;
  }

  const period = candidate.period.trim().toLocaleLowerCase('zh-CN');

  if (!period || period === '-') {
    return null;
  }

  const awardScope = candidate.competitionId
    ? `competition:${candidate.competitionId}`
    : `award:${candidate.awardCode}`;

  return `${candidate.playerId}|${awardScope}|period:${period}`;
}

export function selectScoringMonthlyAwardRecipientIds<T extends MonthlyAwardCandidate>(
  candidates: T[]
) {
  const winnerByGroup = new Map<string, T>();

  for (const candidate of candidates) {
    const groupKey = buildMonthlyAwardGroupKey(candidate);

    if (!groupKey) {
      continue;
    }

    const currentWinner = winnerByGroup.get(groupKey);

    if (
      !currentWinner ||
      candidate.recipientId.localeCompare(currentWinner.recipientId, 'en') < 0
    ) {
      winnerByGroup.set(groupKey, candidate);
    }
  }

  return new Set([...winnerByGroup.values()].map((candidate) => candidate.recipientId));
}

function compareCandidates(
  left: LeagueComprehensiveAwardCandidate,
  right: LeagueComprehensiveAwardCandidate
) {
  return (
    right.score - left.score ||
    left.awardSortOrder - right.awardSortOrder ||
    left.awardCode.localeCompare(right.awardCode, 'en') ||
    left.recipientId.localeCompare(right.recipientId, 'en')
  );
}
