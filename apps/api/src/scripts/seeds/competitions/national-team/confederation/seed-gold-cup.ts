import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  withStandingMode
} from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from '../../../../helpers/seed-data.js';
import { GOLD_CUP_RESULTS } from '../../../../data/competition-results/national-team/confederation/gold-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'CONCACAF_GOLD_CUP',
      primaryConfederationCode: 'CONCACAF',
      create: {
        code: 'CONCACAF_GOLD_CUP',
        name: '中北美及加勒比海金杯赛',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '中北美洲及加勒比海地区男子国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 40
      },
      update: {
        name: '中北美及加勒比海金杯赛',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        enabled: true,
        includeInStats: true,
        sortOrder: 40
      }
    },
    scope: {
      confederationCodes: ['CONCACAF']
    },
    historicalCountryNames: ['荷属安的列斯'],
    editions: withStandingMode(GOLD_CUP_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 28,
      standings: 111
    },
    completedMessage: 'CONCACAF Gold Cup seed completed.'
  });
}

void runSeed(prisma, main);
