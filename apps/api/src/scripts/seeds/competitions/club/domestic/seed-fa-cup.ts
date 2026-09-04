import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import { ENGLAND_FA_CUP_RESULTS } from '../../../../data/competition-results/club/domestic/fa-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰', '威尔士']),
    competition: {
      code: 'ENGLAND_FA_CUP',
      primaryCountryName: '英格兰',
      create: {
        code: 'ENGLAND_FA_CUP',
        name: '英格兰足总杯',
        englishName: 'FA Cup',
        shortName: '足总杯',
        alias: '英格兰足球杯、足协挑战杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FA_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '英格兰全国性国内杯赛，自 1871-72 赛季起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-04T00:00:00.000Z'),
        dataRemark:
          '先录入 1881-82 至 2025-26 届次；1871-72 至 1880-81 因库内无可映射俱乐部暂不回填。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      },
      update: {
        name: '英格兰足总杯',
        englishName: 'FA Cup',
        shortName: '足总杯',
        alias: '英格兰足球杯、足协挑战杯',
        externalUrl: 'https://en.wikipedia.org/wiki/FA_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '一级',
        format: '杯赛',
        description: '英格兰全国性国内杯赛，自 1871-72 赛季起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-04T00:00:00.000Z'),
        dataRemark:
          '先录入 1881-82 至 2025-26 届次；1871-72 至 1880-81 因库内无可映射俱乐部暂不回填。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      }
    },
    scope: {
      countryNames: ['英格兰', '威尔士']
    },
    editions: ENGLAND_FA_CUP_RESULTS,
    buildStandings: () => [],
    expected: {
      editions: ENGLAND_FA_CUP_RESULTS.length,
      standings: 0
    },
    completedMessage: 'FA Cup seed completed.'
  });
}

void runSeed(prisma, main);
