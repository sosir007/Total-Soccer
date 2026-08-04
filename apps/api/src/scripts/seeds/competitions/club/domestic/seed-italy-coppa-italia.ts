import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ITALY_COPPA_ITALIA_REQUIRED_CLUBS } from '../../../../data/competition-patches/club/domestic/italy-coppa-italia.js';
import { ITALY_COPPA_ITALIA_RESULTS } from '../../../../data/competition-results/club/domestic/italy-coppa-italia.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['意大利']),
    clubs: ITALY_COPPA_ITALIA_REQUIRED_CLUBS,
    competition: {
      code: 'ITALY_COPPA_ITALIA',
      primaryCountryName: '意大利',
      create: {
        code: 'ITALY_COPPA_ITALIA',
        name: '意大利杯',
        englishName: 'Coppa Italia',
        shortName: '意杯',
        alias: '意大利杯赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Coppa_Italia',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '意大利全国性国内杯赛，冠军通常获得欧战资格和意大利超级杯参赛资格。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7762
      },
      update: {
        name: '意大利杯',
        englishName: 'Coppa Italia',
        shortName: '意杯',
        alias: '意大利杯赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Coppa_Italia',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '意大利全国性国内杯赛，冠军通常获得欧战资格和意大利超级杯参赛资格。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        enabled: true,
        includeInStats: true,
        sortOrder: 7762
      }
    },
    scope: {
      countryNames: ['意大利']
    },
    editions: ITALY_COPPA_ITALIA_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'Italy Coppa Italia seed completed.'
  });
}

void runSeed(prisma, main);
