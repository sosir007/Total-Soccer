import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { GERMANY_BUNDESLIGA_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/germany-bundesliga.js';
import { GERMANY_BUNDESLIGA_RESULTS } from '../../../../data/competition-results/club/domestic/germany-bundesliga.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['德国']),
    clubs: GERMANY_BUNDESLIGA_REQUIRED_CLUBS,
    competition: {
      code: 'GERMANY_BUNDESLIGA',
      primaryCountryName: '德国',
      create: {
        code: 'GERMANY_BUNDESLIGA',
        name: '德国足球甲级联赛',
        englishName: 'Bundesliga',
        shortName: '德甲',
        alias: '德国甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Bundesliga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '德国顶级职业足球联赛，1963-64 赛季创立；德国足球锦标赛前身不纳入本赛事。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      },
      update: {
        name: '德国足球甲级联赛',
        englishName: 'Bundesliga',
        shortName: '德甲',
        alias: '德国甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Bundesliga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '德国顶级职业足球联赛，1963-64 赛季创立；德国足球锦标赛前身不纳入本赛事。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7710
      }
    },
    scope: {
      countryNames: ['德国']
    },
    editions: GERMANY_BUNDESLIGA_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Germany Bundesliga seed completed.'
  });
}

void runSeed(prisma, main);
