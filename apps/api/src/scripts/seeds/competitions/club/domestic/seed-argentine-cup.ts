import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ARGENTINE_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/argentine-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷']),
    competition: {
      code: 'ARGENTINE_CUP',
      primaryCountryName: '阿根廷',
      create: {
        code: 'ARGENTINE_CUP',
        name: '阿根廷杯',
        englishName: 'Copa Argentina',
        shortName: null,
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Argentina',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '阿根廷全国范围国内杯赛，1969 年首办，2011-12 赛季重启。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16492
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
        sortOrder: 16492
      }
    },
    scope: {
      countryNames: ['阿根廷']
    },
    editions: ARGENTINE_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Argentine Cup seed completed.'
  });
}

void runSeed(prisma, main);
