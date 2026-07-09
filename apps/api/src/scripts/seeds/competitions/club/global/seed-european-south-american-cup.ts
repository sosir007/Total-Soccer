import { CompetitionScopeType, CompetitionTargetType, PrismaClient } from '@prisma/client';
import { runCompetitionSeed, runSeed } from '../../../../helpers/competition-seed.js';
import { withStandingMode } from '../../../../helpers/competition-results.js';
import { CONFEDERATION_SEEDS, pickSeedCountries } from '../../../../helpers/seed-data.js';
import {
  buildEuropeanSouthAmericanCupStandings,
  EUROPEAN_SOUTH_AMERICAN_CUP_REQUIRED_CLUBS,
  EUROPEAN_SOUTH_AMERICAN_CUP_RESULTS
} from '../../../../data/competition-results/club/global/european-south-american-cup.js';

const prisma = new PrismaClient();

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    countries: [
      ...pickSeedCountries([
        '阿根廷',
        '巴西',
        '智利',
        '哥伦比亚',
        '英格兰',
        '德国',
        '希腊',
        '意大利',
        '荷兰',
        '巴拉圭',
        '葡萄牙',
        '塞尔维亚',
        '西班牙',
        '瑞典',
        '乌拉圭'
      ]),
      { uid: '790', name: '罗马尼亚', confederationCode: 'UEFA' },
      { uid: '793', name: '苏格兰', confederationCode: 'UEFA' }
    ],
    clubs: EUROPEAN_SOUTH_AMERICAN_CUP_REQUIRED_CLUBS,
    competition: {
      code: 'EUROPEAN_SOUTH_AMERICAN_CUP',
      create: {
        code: 'EUROPEAN_SOUTH_AMERICAN_CUP',
        name: '欧洲/南美洲杯',
        alias: '丰田杯、旧洲际杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Intercontinental_Cup_(1960%E2%80%932004)',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description:
          '欧冠冠军与南美解放者杯冠军之间的世界俱乐部冠军赛事，1980-2004 为丰田杯赞助阶段。',
        enabled: true,
        includeInStats: true,
        sortOrder: 30
      },
      update: {
        name: '欧洲/南美洲杯',
        alias: '丰田杯、旧洲际杯',
        externalUrl: 'https://en.wikipedia.org/wiki/Intercontinental_Cup_(1960%E2%80%932004)',
        targetType: CompetitionTargetType.CLUB,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description:
          '欧冠冠军与南美解放者杯冠军之间的世界俱乐部冠军赛事，1980-2004 为丰田杯赞助阶段。',
        confederationId: null,
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 30
      }
    },
    editions: withStandingMode(EUROPEAN_SOUTH_AMERICAN_CUP_RESULTS),
    buildStandings: buildEuropeanSouthAmericanCupStandings,
    expected: {
      editions: 43,
      standings: 86
    },
    completedMessage: 'European/South American Cup seed completed.'
  });
}

void runSeed(prisma, main);
