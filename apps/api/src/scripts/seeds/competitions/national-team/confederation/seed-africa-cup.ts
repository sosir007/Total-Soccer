import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from '../../../../helpers/seed-data.js';
import { AFRICA_CUP_RESULTS } from '../../../../data/competition-results/national-team/confederation/africa-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'AFRICA_CUP',
      primaryConfederationCode: 'CAF',
      create: {
        code: 'AFRICA_CUP',
        name: '非洲国家杯',
        alias: '非洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Africa_Cup_of_Nations',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '非洲足联主办的男子国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 35
      },
      update: {
        name: '非洲国家杯',
        alias: '非洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Africa_Cup_of_Nations',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 35
      }
    },
    scope: {
      confederationCodes: ['CAF']
    },
    historicalCountryNames: ['阿拉伯联合共和国', '刚果金沙萨', '扎伊尔'],
    editions: withStandingMode(AFRICA_CUP_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 35,
      standings: 138
    },
    completedMessage: 'Africa Cup seed completed.'
  });
}

void runSeed(prisma, main);
