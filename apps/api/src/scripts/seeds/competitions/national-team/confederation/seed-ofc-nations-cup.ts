import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from '../../../../helpers/seed-data.js';
import { OFC_NATIONS_CUP_RESULTS } from '../../../../data/competition-results/national-team/confederation/ofc-nations-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'OFC_NATIONS_CUP',
      primaryConfederationCode: 'OFC',
      create: {
        code: 'OFC_NATIONS_CUP',
        name: '大洋洲国家杯',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '大洋洲足联主办的男子国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 50
      },
      update: {
        name: '大洋洲国家杯',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 50
      }
    },
    scope: {
      confederationCodes: ['OFC']
    },
    editions: withStandingMode(OFC_NATIONS_CUP_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 11,
      standings: 44
    },
    completedMessage: 'OFC Nations Cup seed completed.'
  });
}

void runSeed(prisma, main);
