import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from '../../../../helpers/seed-data.js';
import { ASIAN_CUP_RESULTS } from '../../../../data/competition-results/national-team/confederation/asian-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'AFC_ASIAN_CUP',
      primaryConfederationCode: 'AFC',
      create: {
        code: 'AFC_ASIAN_CUP',
        name: '亚足联亚洲杯',
        alias: '亚洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/AFC_Asian_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '亚足联国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20
      },
      update: {
        name: '亚足联亚洲杯',
        alias: '亚洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/AFC_Asian_Cup',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 20
      }
    },
    scope: {
      confederationCodes: ['AFC']
    },
    historicalCountryNames: ['南越'],
    editions: withStandingMode(ASIAN_CUP_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 18,
      standings: 72
    },
    completedMessage: 'Asian Cup seed completed.'
  });
}

void runSeed(prisma, main);
