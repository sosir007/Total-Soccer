import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { SPAIN_LEAGUE_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/spain-league-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['西班牙']),
    competition: {
      code: 'SPAIN_LEAGUE_CUP',
      primaryCountryName: '西班牙',
      create: {
        code: 'SPAIN_LEAGUE_CUP',
        name: '西班牙联赛杯',
        englishName: 'Copa de la Liga',
        shortName: '联赛杯',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_de_la_Liga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        description: '西班牙职业俱乐部国内联赛杯赛事，1983 年至 1986 年举办。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 7964
      },
      update: {
        name: '西班牙联赛杯',
        englishName: 'Copa de la Liga',
        shortName: '联赛杯',
        alias: null,
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_de_la_Liga',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        description: '西班牙职业俱乐部国内联赛杯赛事，1983 年至 1986 年举办。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 7964
      }
    },
    scope: {
      countryNames: ['西班牙']
    },
    editions: SPAIN_LEAGUE_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Spain League Cup seed completed.'
  });
}

void runSeed(prisma, main);
