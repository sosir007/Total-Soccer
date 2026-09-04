import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['英格兰', '威尔士']),
    competition: {
      code: 'ENGLAND_LEAGUE_CUP',
      primaryCountryName: '英格兰',
      create: {
        code: 'ENGLAND_LEAGUE_CUP',
        name: '英格兰联赛杯',
        englishName: 'EFL Cup',
        shortName: '英联杯',
        alias: '卡拉宝杯、Football League Cup、League Cup、Carabao Cup',
        externalUrl: 'https://en.wikipedia.org/wiki/EFL_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        description: '英格兰职业俱乐部国内联赛杯赛事，自 1960-61 赛季起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-04T00:00:00.000Z'),
        dataRemark:
          '1960-61 至 2025-26 已按当前库内俱乐部录入冠亚军；1999-00 亚军特兰米尔流浪者未入库，对应亚军荣誉留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      },
      update: {
        name: '英格兰联赛杯',
        englishName: 'EFL Cup',
        shortName: '英联杯',
        alias: '卡拉宝杯、Football League Cup、League Cup、Carabao Cup',
        externalUrl: 'https://en.wikipedia.org/wiki/EFL_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '杯赛',
        description: '英格兰职业俱乐部国内联赛杯赛事，自 1960-61 赛季起举办。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-04T00:00:00.000Z'),
        dataRemark:
          '1960-61 至 2025-26 已按当前库内俱乐部录入冠亚军；1999-00 亚军特兰米尔流浪者未入库，对应亚军荣誉留空。',
        enabled: true,
        includeInStats: true,
        sortOrder: 7650
      }
    },
    scope: {
      countryNames: ['英格兰', '威尔士']
    },
    editions: [],
    buildStandings: () => [],
    expected: {
      editions: 0,
      standings: 0
    },
    completedMessage: 'England League Cup seed completed.'
  });
}

void runSeed(prisma, main);
