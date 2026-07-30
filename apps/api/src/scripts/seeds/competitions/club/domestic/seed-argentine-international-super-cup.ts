import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ARGENTINE_INTERNATIONAL_SUPER_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/argentine-international-super-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷']),
    competition: {
      code: 'ARGENTINE_INTERNATIONAL_SUPER_CUP',
      primaryCountryName: '阿根廷',
      create: {
        code: 'ARGENTINE_INTERNATIONAL_SUPER_CUP',
        name: '阿根廷国际超级杯',
        englishName: 'Supercopa Internacional',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Supercopa_Internacional',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description:
          '阿根廷国内超级杯类赛事，“国际”来自赛事海外举办口径，系统按阿根廷国内赛事处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16496
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
        sortOrder: 16496
      }
    },
    scope: {
      countryNames: ['阿根廷']
    },
    editions: ARGENTINE_INTERNATIONAL_SUPER_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Argentine International Super Cup seed completed.'
  });
}

void runSeed(prisma, main);
