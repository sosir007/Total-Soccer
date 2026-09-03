import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildUsOpenCupStandings,
  US_OPEN_CUP_REQUIRED_CLUBS,
  US_OPEN_CUP_RESULTS
} from '../../../../data/competition-results/club/domestic/us-open-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['美国']),
    clubs: US_OPEN_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'US_OPEN_CUP',
      primaryCountryName: '美国',
      create: {
        code: 'US_OPEN_CUP',
        name: '美国公开杯',
        englishName: 'U.S. Open Cup',
        shortName: '公开杯',
        alias: '美国足协公开杯',
        externalUrl: 'https://en.wikipedia.org/wiki/U.S._Open_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '美国全国性公开淘汰杯赛，系统按美国国内一级杯赛处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '已按 1996-2025 年现代公开杯决赛录入；库外决赛队不新增俱乐部，仅保留届次备注。',
        enabled: true,
        includeInStats: true,
        sortOrder: 3902
      },
      update: {
        name: '美国公开杯',
        englishName: 'U.S. Open Cup',
        shortName: '公开杯',
        alias: '美国足协公开杯',
        externalUrl: 'https://en.wikipedia.org/wiki/U.S._Open_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '美国全国性公开淘汰杯赛，系统按美国国内一级杯赛处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark: '已按 1996-2025 年现代公开杯决赛录入；库外决赛队不新增俱乐部，仅保留届次备注。',
        enabled: true,
        includeInStats: true,
        sortOrder: 3902
      }
    },
    scope: {
      countryNames: ['美国']
    },
    editions: US_OPEN_CUP_RESULTS,
    buildStandings: buildUsOpenCupStandings,
    expected: {
      editions: 28,
      standings: 51
    },
    allowPartialStandings: true,
    completedMessage: 'U.S. Open Cup seed completed.'
  });
}

void runSeed(prisma, main);
