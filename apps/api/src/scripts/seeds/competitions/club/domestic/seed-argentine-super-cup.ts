import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ARGENTINE_SUPER_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/argentine-super-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷']),
    competition: {
      code: 'ARGENTINE_SUPER_CUP',
      primaryCountryName: '阿根廷',
      create: {
        code: 'ARGENTINE_SUPER_CUP',
        name: '阿根廷超级杯',
        englishName: 'Supercopa Argentina',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Supercopa_Argentina',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description: '阿根廷国内超级杯赛事，通常由阿根廷甲级联赛冠军与阿根廷杯冠军参加。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16495
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
        sortOrder: 16495
      }
    },
    scope: {
      countryNames: ['阿根廷']
    },
    editions: ARGENTINE_SUPER_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Argentine Super Cup seed completed.'
  });
}

void runSeed(prisma, main);
