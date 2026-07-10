import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from '../../../../helpers/seed-data.js';
import { EURO_RESULTS } from '../../../../data/competition-results/national-team/confederation/euro.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'UEFA_EURO',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'UEFA_EURO',
        name: '欧洲足球锦标赛',
        alias: '欧洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_European_Championship',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '欧足联国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 30
      },
      update: {
        name: '欧洲足球锦标赛',
        alias: '欧洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/UEFA_European_Championship',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 30
      }
    },
    scope: {
      confederationCodes: ['UEFA']
    },
    historicalCountryNames: ['苏联', '西德', '捷克斯洛伐克', '南斯拉夫'],
    editions: withStandingMode(EURO_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 17,
      standings: 68
    },
    completedMessage: 'Euro seed completed.'
  });
}

void runSeed(prisma, main);
