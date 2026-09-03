import {
  CompetitionScopeType,
  CompetitionTargetType,
  LifecycleStatus,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildMlsSupportersShieldStandings,
  MLS_SUPPORTERS_SHIELD_REQUIRED_CLUBS,
  MLS_SUPPORTERS_SHIELD_RESULTS
} from '../../../../data/competition-results/club/domestic/mls-supporters-shield.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: pickSeedCountries(['美国', '加拿大']),
    clubs: MLS_SUPPORTERS_SHIELD_REQUIRED_CLUBS,
    competition: {
      code: 'MLS_SUPPORTERS_SHIELD',
      primaryCountryName: '美国',
      create: {
        code: 'MLS_SUPPORTERS_SHIELD',
        name: '美国大联盟支持者盾',
        englishName: "Supporters' Shield",
        shortName: '支持者盾',
        alias: '美国职业足球大联盟支持者盾',
        externalUrl: 'https://en.wikipedia.org/wiki/Supporters%27_Shield',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description: '授予 MLS 常规赛总体战绩最佳球队的奖杯，系统按美国国内二级联赛处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '已按 MLS 常规赛总榜录入冠亚季军；1996 坦帕湾叛变者、1997 坦帕湾叛变者、2001 迈阿密融合、2007 Chivas USA 因俱乐部未入库，对应名次暂未创建 standings。',
        enabled: true,
        includeInStats: true,
        sortOrder: 3901
      },
      update: {
        name: '美国大联盟支持者盾',
        englishName: "Supporters' Shield",
        shortName: '支持者盾',
        alias: '美国职业足球大联盟支持者盾',
        externalUrl: 'https://en.wikipedia.org/wiki/Supporters%27_Shield',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.COUNTRY,
        category: '国内',
        level: '二级',
        format: '联赛',
        description: '授予 MLS 常规赛总体战绩最佳球队的奖杯，系统按美国国内二级联赛处理。',
        lifecycleStatus: LifecycleStatus.CURRENT,
        dataComplete: false,
        dataUpdatedAt: new Date('2026-09-03T00:00:00.000Z'),
        dataRemark:
          '已按 MLS 常规赛总榜录入冠亚季军；1996 坦帕湾叛变者、1997 坦帕湾叛变者、2001 迈阿密融合、2007 Chivas USA 因俱乐部未入库，对应名次暂未创建 standings。',
        enabled: true,
        includeInStats: true,
        sortOrder: 3901
      }
    },
    scope: {
      countryNames: ['美国']
    },
    editions: MLS_SUPPORTERS_SHIELD_RESULTS,
    buildStandings: buildMlsSupportersShieldStandings,
    expected: {
      editions: 30,
      standings: 86
    },
    allowPartialStandings: true,
    completedMessage: 'MLS Supporters Shield seed completed.'
  });
}

void runSeed(prisma, main);
