import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from '../../../../helpers/seed-data.js';
import { COPA_AMERICA_RESULTS } from '../../../../data/competition-results/national-team/confederation/copa-america.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'COPA_AMERICA',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'COPA_AMERICA',
        name: '南美足联美洲杯',
        alias: '美洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '南美足联主办的男子国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 25
      },
      update: {
        name: '南美足联美洲杯',
        alias: '美洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 25
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: withStandingMode(COPA_AMERICA_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 48,
      standings: 191
    },
    completedMessage: 'Copa America seed completed.'
  });
}

void runSeed(prisma, main);
