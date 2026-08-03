import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { SPAIN_SEGUNDA_DIVISION_RESULTS } from '../../../../data/competition-results/club/domestic/spain-segunda-division.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['西班牙']),
    competition: {
      code: 'SPAIN_SEGUNDA_DIVISION',
      primaryCountryName: '西班牙',
      create: {
        code: 'SPAIN_SEGUNDA_DIVISION',
        name: '西班牙足球乙级联赛',
        englishName: 'Segunda Division',
        shortName: '西乙',
        alias: '西班牙乙级联赛、LaLiga Hypermotion',
        externalUrl: 'https://en.wikipedia.org/wiki/Segunda_Divisi%C3%B3n',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '西班牙第二级职业足球联赛，自 1929 年起举办，当前商业名为 LaLiga Hypermotion。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7961
      },
      update: {
        name: '西班牙足球乙级联赛',
        englishName: 'Segunda Division',
        shortName: '西乙',
        alias: '西班牙乙级联赛、LaLiga Hypermotion',
        externalUrl: 'https://en.wikipedia.org/wiki/Segunda_Divisi%C3%B3n',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description:
          '西班牙第二级职业足球联赛，自 1929 年起举办，当前商业名为 LaLiga Hypermotion。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7961
      }
    },
    scope: {
      countryNames: ['西班牙']
    },
    editions: SPAIN_SEGUNDA_DIVISION_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Spain Segunda Division seed completed.'
  });
}

void runSeed(prisma, main);
