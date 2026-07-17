import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildCopaConmebolStandings,
  COPA_CONMEBOL_REQUIRED_CLUBS,
  COPA_CONMEBOL_RESULTS
} from '../../../../data/competition-results/club/confederation/copa-conmebol.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['阿根廷', '巴西', '哥伦比亚', '巴拉圭', '乌拉圭']),
    clubs: COPA_CONMEBOL_REQUIRED_CLUBS,
    competition: {
      code: 'COPA_CONMEBOL',
      primaryConfederationCode: 'CONMEBOL',
      create: {
        code: 'COPA_CONMEBOL',
        name: '南美足联杯',
        alias: 'Copa CONMEBOL',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_CONMEBOL',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '南美足联历史上的二级俱乐部杯赛，举办于 1992 至 1999 年。',
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 61
      },
      update: {
        name: '南美足联杯',
        alias: 'Copa CONMEBOL',
        externalUrl: 'https://en.wikipedia.org/wiki/Copa_CONMEBOL',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '二级',
        format: '杯赛',
        description: '南美足联历史上的二级俱乐部杯赛，举办于 1992 至 1999 年。',
        countryId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        enabled: true,
        includeInStats: true,
        sortOrder: 61
      }
    },
    scope: {
      confederationCodes: ['CONMEBOL']
    },
    editions: withStandingMode(COPA_CONMEBOL_RESULTS),
    buildStandings: buildCopaConmebolStandings,
    expected: {
      editions: 8,
      standings: 16
    },
    completedMessage: 'Copa CONMEBOL seed completed.'
  });
}

void runSeed(prisma, main);
