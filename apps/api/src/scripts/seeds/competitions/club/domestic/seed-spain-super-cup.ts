import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { SPAIN_SUPER_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/spain-super-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['西班牙']),
    competition: {
      code: 'SPAIN_SUPER_CUP',
      primaryCountryName: '西班牙',
      create: {
        code: 'SPAIN_SUPER_CUP',
        name: '西班牙超级杯',
        englishName: 'Supercopa de Espana',
        shortName: '西超杯',
        alias: 'Supercopa de España',
        externalUrl: 'https://en.wikipedia.org/wiki/Supercopa_de_Espa%C3%B1a',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description: '西班牙国内超级杯赛事，通常由西甲冠军与国王杯冠军参加，2020 年起改为四队制。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7963
      },
      update: {
        name: '西班牙超级杯',
        englishName: 'Supercopa de Espana',
        shortName: '西超杯',
        alias: 'Supercopa de España',
        externalUrl: 'https://en.wikipedia.org/wiki/Supercopa_de_Espa%C3%B1a',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '三级',
        format: '杯赛',
        description: '西班牙国内超级杯赛事，通常由西甲冠军与国王杯冠军参加，2020 年起改为四队制。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7963
      }
    },
    scope: {
      countryNames: ['西班牙']
    },
    editions: SPAIN_SUPER_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Spain Super Cup seed completed.'
  });
}

void runSeed(prisma, main);
