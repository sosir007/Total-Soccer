import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildMitropaCupStandings,
  MITROPA_CUP_REQUIRED_CLUBS,
  MITROPA_CUP_RESULTS
} from '../../../../data/competition-results/club/confederation/mitropa-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries([
      '奥地利',
      '波斯尼亚和黑塞哥维那',
      '捷克',
      '匈牙利',
      '意大利',
      '塞尔维亚',
      '斯洛伐克'
    ]),
    clubs: MITROPA_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'MITROPA_CUP',
      create: {
        code: 'MITROPA_CUP',
        name: '米特罗帕杯',
        englishName: 'Mitropa Cup',
        shortName: '中欧杯',
        alias: '中央欧洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Mitropa_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '1927 至 1992 年间举办的中欧跨国俱乐部杯赛；战前地位较高，战后逐渐式微，本系统按俱乐部其他二级杯赛处理。',
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-08-27T00:00:00.000Z'),
        dataRemark: '当前只录入数据库已有俱乐部的冠亚军；库外俱乐部名次留空，后续补 UID 后再补。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20003
      },
      update: {
        name: '米特罗帕杯',
        englishName: 'Mitropa Cup',
        shortName: '中欧杯',
        alias: '中央欧洲杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Mitropa_Cup',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.CUSTOM,
        category: '其他',
        level: '二级',
        format: '杯赛',
        description:
          '1927 至 1992 年间举办的中欧跨国俱乐部杯赛；战前地位较高，战后逐渐式微，本系统按俱乐部其他二级杯赛处理。',
        countryId: null,
        confederationId: null,
        lifecycleStatus: LifecycleStatus.DISCONTINUED,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-08-27T00:00:00.000Z'),
        dataRemark: '当前只录入数据库已有俱乐部的冠亚军；库外俱乐部名次留空，后续补 UID 后再补。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20003
      }
    },
    editions: MITROPA_CUP_RESULTS,
    buildStandings: buildMitropaCupStandings,
    expected: {
      editions: 50,
      standings: 48
    },
    allowPartialStandings: true,
    completedMessage: 'Mitropa Cup seed completed.'
  });
}

void runSeed(prisma, main);
