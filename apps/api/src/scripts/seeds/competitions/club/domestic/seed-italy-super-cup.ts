import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ITALY_SUPER_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/italy-super-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['意大利']),
    competition: {
      code: 'ITALY_SUPER_CUP',
      primaryCountryName: '意大利',
      create: {
        code: 'ITALY_SUPER_CUP',
        name: '意大利超级杯',
        englishName: 'Supercoppa Italiana',
        shortName: '意超杯',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Supercoppa_Italiana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '意大利国内超级杯赛事，通常由意甲冠军与意大利杯冠军参加，2023 年起一度改为四队制。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7763
      },
      update: {
        name: '意大利超级杯',
        englishName: 'Supercoppa Italiana',
        shortName: '意超杯',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Supercoppa_Italiana',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '意大利国内超级杯赛事，通常由意甲冠军与意大利杯冠军参加，2023 年起一度改为四队制。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7763
      }
    },
    scope: {
      countryNames: ['意大利']
    },
    editions: ITALY_SUPER_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Italy Super Cup seed completed.'
  });
}

void runSeed(prisma, main);
