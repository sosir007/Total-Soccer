import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { SPAIN_LA_LIGA_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/spain-la-liga.js';
import { SPAIN_LA_LIGA_RESULTS } from '../../../../data/competition-results/club/domestic/spain-la-liga.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['西班牙']),
    clubs: SPAIN_LA_LIGA_REQUIRED_CLUBS,
    competition: {
      code: 'SPAIN_LA_LIGA',
      primaryCountryName: '西班牙',
      create: {
        code: 'SPAIN_LA_LIGA',
        name: '西班牙足球甲级联赛',
        englishName: 'La Liga',
        shortName: '西甲',
        alias: '西班牙甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/La_Liga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '西班牙顶级职业足球联赛，自 1929 年起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16520
      },
      update: {
        name: '西班牙足球甲级联赛',
        englishName: 'La Liga',
        shortName: '西甲',
        alias: '西班牙甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/La_Liga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '西班牙顶级职业足球联赛，自 1929 年起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 16520
      }
    },
    scope: {
      countryNames: ['西班牙']
    },
    editions: SPAIN_LA_LIGA_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Spain La Liga seed completed.'
  });
}

void runSeed(prisma, main);
