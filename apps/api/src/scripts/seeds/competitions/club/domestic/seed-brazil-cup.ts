import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { BRAZIL_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/brazil-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['巴西']),
    competition: {
      code: 'BRAZIL_CUP',
      primaryCountryName: '巴西',
      create: {
        code: 'BRAZIL_CUP',
        name: '巴西杯',
        alias: '巴西国内一级杯赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_do_Brasil',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '巴西全国范围最高级别国内杯赛，自 1989 年起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16512
      },
      update: {
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16512
      }
    },
    scope: {
      countryNames: ['巴西']
    },
    editions: BRAZIL_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Brazil Cup seed completed.'
  });
}

void runSeed(prisma, main);
