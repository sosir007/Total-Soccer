import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed, runSeed } from './helpers/competition-seed.js';
import {
  buildCompetitionResultStandings,
  type SemiFinalistCompetitionResult,
  type TopFourCompetitionResult,
  withStandingMode
} from './helpers/competition-results.js';
import { CONFEDERATION_SEEDS, resolveSeedCountries } from './helpers/seed-data.js';

const prisma = new PrismaClient();

const EURO_RESULTS: Array<TopFourCompetitionResult | SemiFinalistCompetitionResult> = [
  {
    year: 1960,
    host: '法国',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏联',
    runnerUp: '南斯拉夫',
    thirdPlace: '捷克斯洛伐克',
    fourthPlace: '法国'
  },
  {
    year: 1964,
    host: '西班牙',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '苏联',
    thirdPlace: '匈牙利',
    fourthPlace: '丹麦'
  },
  {
    year: 1968,
    host: '意大利',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '意大利',
    runnerUp: '南斯拉夫',
    thirdPlace: '英格兰',
    fourthPlace: '苏联'
  },
  {
    year: 1972,
    host: '比利时',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西德',
    runnerUp: '苏联',
    thirdPlace: '比利时',
    fourthPlace: '匈牙利'
  },
  {
    year: 1976,
    host: '南斯拉夫',
    quantity: 4,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '捷克斯洛伐克',
    runnerUp: '西德',
    thirdPlace: '荷兰',
    fourthPlace: '南斯拉夫'
  },
  {
    year: 1980,
    host: '意大利',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西德',
    runnerUp: '比利时',
    thirdPlace: '捷克斯洛伐克',
    fourthPlace: '意大利'
  },
  {
    year: 1984,
    host: '法国',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '法国',
    runnerUp: '西班牙',
    semiFinalists: ['丹麦', '葡萄牙']
  },
  {
    year: 1988,
    host: '西德',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '荷兰',
    runnerUp: '苏联',
    semiFinalists: ['意大利', '西德']
  },
  {
    year: 1992,
    host: '瑞典',
    quantity: 8,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '丹麦',
    runnerUp: '德国',
    semiFinalists: ['荷兰', '瑞典']
  },
  {
    year: 1996,
    host: '英格兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '德国',
    runnerUp: '捷克',
    semiFinalists: ['英格兰', '法国']
  },
  {
    year: 2000,
    host: '比利时/荷兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '法国',
    runnerUp: '意大利',
    semiFinalists: ['荷兰', '葡萄牙']
  },
  {
    year: 2004,
    host: '葡萄牙',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '希腊',
    runnerUp: '葡萄牙',
    semiFinalists: ['捷克', '荷兰']
  },
  {
    year: 2008,
    host: '奥地利/瑞士',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '德国',
    semiFinalists: ['俄罗斯', '土耳其']
  },
  {
    year: 2012,
    host: '波兰/乌克兰',
    quantity: 16,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '意大利',
    semiFinalists: ['德国', '葡萄牙']
  },
  {
    year: 2016,
    host: '法国',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '葡萄牙',
    runnerUp: '法国',
    semiFinalists: ['德国', '威尔士']
  },
  {
    year: 2020,
    host: '泛欧',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '意大利',
    runnerUp: '英格兰',
    semiFinalists: ['丹麦', '西班牙']
  },
  {
    year: 2024,
    host: '德国',
    quantity: 24,
    mode: CompetitionEditionStandingMode.SEMI_FINALISTS,
    champion: '西班牙',
    runnerUp: '英格兰',
    semiFinalists: ['法国', '荷兰']
  }
];

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATION_SEEDS,
    resolveCountries: resolveSeedCountries,
    competition: {
      code: 'UEFA_EURO',
      primaryConfederationCode: 'UEFA',
      create: {
        code: 'UEFA_EURO',
        name: '欧洲足球锦标赛',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.CONFEDERATION,
        category: '洲际',
        level: '一级',
        format: '杯赛',
        description: '欧足联国家队最高级别洲际杯赛。',
        enabled: true,
        includeInStats: true,
        sortOrder: 20
      },
      update: {
        name: '欧洲足球锦标赛',
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
      confederationCodes: ['UEFA']
    },
    historicalCountryNames: ['苏联', '西德', '捷克斯洛伐克', '南斯拉夫'],
    editions: withStandingMode(EURO_RESULTS),
    buildStandings: buildCompetitionResultStandings,
    expected: {
      editions: 17,
      standings: 68
    },
    completedMessage: 'Euro seed completed.'
  });
}

void runSeed(prisma, main);
