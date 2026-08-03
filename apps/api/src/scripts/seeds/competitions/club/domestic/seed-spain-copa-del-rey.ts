import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { SPAIN_COPA_DEL_REY_RESULTS } from '../../../../data/competition-results/club/domestic/spain-copa-del-rey.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['西班牙']),
    competition: {
      code: 'SPAIN_COPA_DEL_REY',
      primaryCountryName: '西班牙',
      create: {
        code: 'SPAIN_COPA_DEL_REY',
        name: '西班牙国王杯',
        englishName: 'Copa del Rey',
        shortName: '国王杯',
        alias: '西班牙杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_del_Rey',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '西班牙全国性国内杯赛，自 1903 年起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7962
      },
      update: {
        name: '西班牙国王杯',
        englishName: 'Copa del Rey',
        shortName: '国王杯',
        alias: '西班牙杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_del_Rey',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '西班牙全国性国内杯赛，自 1903 年起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7962
      }
    },
    scope: {
      countryNames: ['西班牙']
    },
    editions: SPAIN_COPA_DEL_REY_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Spain Copa del Rey seed completed.'
  });
}

void runSeed(prisma, main);
