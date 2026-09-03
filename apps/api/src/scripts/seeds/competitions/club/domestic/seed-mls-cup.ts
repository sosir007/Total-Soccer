import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildMlsCupStandings,
  MLS_CUP_REQUIRED_CLUBS,
  MLS_CUP_RESULTS
} from '../../../../data/competition-results/club/domestic/mls-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['美国', '加拿大']),
    clubs: MLS_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'MLS_CUP',
      primaryCountryName: '美国',
      create: {
        code: 'MLS_CUP',
        name: '美国职业足球大联盟杯',
        englishName: 'MLS Cup',
        shortName: 'MLS杯',
        alias: '美国职业大联盟杯、MLS总冠军赛',
        externalUrl: 'https://en.wikipedia.org/wiki/MLS_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '美国职业足球大联盟季后赛总决赛，系统按美国国内一级联赛总冠军处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 3900
      },
      update: {
        name: '美国职业足球大联盟杯',
        englishName: 'MLS Cup',
        shortName: 'MLS杯',
        alias: '美国职业大联盟杯、MLS总冠军赛',
        externalUrl: 'https://en.wikipedia.org/wiki/MLS_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '联赛',
        description: '美国职业足球大联盟季后赛总决赛，系统按美国国内一级联赛总冠军处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: true,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 3900
      }
    },
    scope: {
      countryNames: ['美国']
    },
    editions: MLS_CUP_RESULTS,
    buildStandings: buildMlsCupStandings,
    expected: {
      editions: 30,
      standings: 60
    },
    completedMessage: 'MLS Cup seed completed.'
  });
}

void runSeed(prisma, main);
