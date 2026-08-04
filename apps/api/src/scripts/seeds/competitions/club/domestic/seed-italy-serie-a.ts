import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ITALY_SERIE_A_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/italy-serie-a.js';
import { ITALY_SERIE_A_RESULTS } from '../../../../data/competition-results/club/domestic/italy-serie-a.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['意大利']),
    clubs: ITALY_SERIE_A_REQUIRED_CLUBS,
    competition: {
      code: 'ITALY_SERIE_A',
      primaryCountryName: '意大利',
      create: {
        code: 'ITALY_SERIE_A',
        name: '意大利足球甲级联赛',
        englishName: 'Serie A',
        shortName: '意甲',
        alias: '意大利甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Serie_A',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '意大利顶级职业足球联赛；项目口径纳入 1898-1929 年意大利顶级联赛前身冠军。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7760
      },
      update: {
        name: '意大利足球甲级联赛',
        englishName: 'Serie A',
        shortName: '意甲',
        alias: '意大利甲级联赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Serie_A',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '意大利顶级职业足球联赛；项目口径纳入 1898-1929 年意大利顶级联赛前身冠军。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7760
      }
    },
    scope: {
      countryNames: ['意大利']
    },
    editions: ITALY_SERIE_A_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Italy Serie A seed completed.'
  });
}

void runSeed(prisma, main);
