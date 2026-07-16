import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { BRAZIL_SUPER_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/brazil-super-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['巴西']),
    competition: {
      code: 'BRAZIL_SUPER_CUP',
      primaryCountryName: '巴西',
      create: {
        code: 'BRAZIL_SUPER_CUP',
        name: '巴西超级杯',
        alias: '巴西超杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Supercopa_do_Brasil',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description: '巴西全国超级杯赛事，由巴甲冠军与巴西杯冠军参加。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16514
      },
      update: {
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16514
      }
    },
    scope: {
      countryNames: ['巴西']
    },
    editions: BRAZIL_SUPER_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Brazil Super Cup seed completed.'
  });
}

void runSeed(prisma, main);
