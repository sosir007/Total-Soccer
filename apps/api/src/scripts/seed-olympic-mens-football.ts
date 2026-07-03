import {
  CompetitionEditionStandingMode,
  CompetitionScopeType,
  CompetitionStandingPlacement,
  CompetitionTargetType,
  PrismaClient
} from '@prisma/client';
import { runCompetitionSeed } from './helpers/competition-seed.js';

const prisma = new PrismaClient();

const CONFEDERATIONS = [
  { uid: '1', code: 'CAF', name: '非足联', sortOrder: 10 },
  { uid: '2', code: 'AFC', name: '亚足联', sortOrder: 20 },
  { uid: '3', code: 'UEFA', name: '欧足联', sortOrder: 30 },
  { uid: '4', code: 'CONCACAF', name: '中北美足联', sortOrder: 40 },
  { uid: '6', code: 'CONMEBOL', name: '南美足联', sortOrder: 60 }
];

const REQUIRED_COUNTRIES = [
  { uid: '11', name: '喀麦隆', confederationCode: 'CAF' },
  { uid: '16', name: '埃及', confederationCode: 'CAF' },
  { uid: '21', name: '加纳', confederationCode: 'CAF' },
  { uid: '34', name: '摩洛哥', confederationCode: 'CAF' },
  { uid: '38', name: '尼日利亚', confederationCode: 'CAF' },
  { uid: '112', name: '印度', confederationCode: 'AFC' },
  { uid: '115', name: '伊拉克', confederationCode: 'AFC' },
  { uid: '116', name: '日本', confederationCode: 'AFC' },
  { uid: '135', name: '韩国', confederationCode: 'AFC' },
  { uid: '1435', name: '澳大利亚', confederationCode: 'AFC' },
  { uid: '376', name: '洪都拉斯', confederationCode: 'CONCACAF' },
  { uid: '379', name: '墨西哥', confederationCode: 'CONCACAF' },
  { uid: '390', name: '美国', confederationCode: 'CONCACAF' },
  { uid: '755', name: '奥地利', confederationCode: 'UEFA' },
  { uid: '757', name: '比利时', confederationCode: 'UEFA' },
  { uid: '760', name: '保加利亚', confederationCode: 'UEFA' },
  { uid: '764', name: '丹麦', confederationCode: 'UEFA' },
  { uid: '768', name: '芬兰', confederationCode: 'UEFA' },
  { uid: '769', name: '法国', confederationCode: 'UEFA' },
  { uid: '771', name: '德国', confederationCode: 'UEFA' },
  { uid: '773', name: '匈牙利', confederationCode: 'UEFA' },
  { uid: '776', name: '意大利', confederationCode: 'UEFA' },
  { uid: '784', name: '荷兰', confederationCode: 'UEFA' },
  { uid: '786', name: '挪威', confederationCode: 'UEFA' },
  { uid: '787', name: '波兰', confederationCode: 'UEFA' },
  { uid: '788', name: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '791', name: '俄罗斯', confederationCode: 'UEFA' },
  { uid: '796', name: '西班牙', confederationCode: 'UEFA' },
  { uid: '797', name: '瑞典', confederationCode: 'UEFA' },
  { uid: '798', name: '瑞士', confederationCode: 'UEFA' },
  { uid: '802', name: '塞尔维亚', confederationCode: 'UEFA' },
  { uid: '-', name: '英国', confederationCode: 'UEFA', visibleInCatalogForNew: false },
  { uid: '1649', name: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1651', name: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1652', name: '智利', confederationCode: 'CONMEBOL' },
  { uid: '1655', name: '巴拉圭', confederationCode: 'CONMEBOL' },
  { uid: '1657', name: '乌拉圭', confederationCode: 'CONMEBOL' }
];

const HISTORICAL_COUNTRIES = [
  {
    uid: '583',
    name: '苏联',
    confederationCode: 'UEFA',
    successorNames: ['俄罗斯'],
    redirectName: '俄罗斯'
  },
  {
    uid: '584',
    name: '西德',
    confederationCode: 'UEFA',
    successorNames: ['德国'],
    redirectName: '德国'
  },
  {
    uid: '585',
    name: '捷克斯洛伐克',
    confederationCode: 'UEFA',
    successorNames: ['捷克', '斯洛伐克']
  },
  { uid: '586', name: '南斯拉夫', confederationCode: 'UEFA', successorNames: ['塞尔维亚'] },
  {
    uid: '-',
    name: '东德',
    confederationCode: 'UEFA',
    successorNames: ['德国'],
    redirectName: '德国'
  },
  {
    uid: '-',
    name: '德国联队',
    confederationCode: 'UEFA',
    successorNames: ['德国'],
    redirectName: '德国'
  },
  {
    uid: '-',
    name: '阿拉伯联合共和国',
    confederationCode: 'CAF',
    successorNames: ['埃及'],
    redirectName: '埃及'
  }
];

type BaseOlympicResult = {
  year: number;
  host: string;
  quantity: number;
  remark?: string;
};

type TopFourOlympicResult = BaseOlympicResult & {
  mode: typeof CompetitionEditionStandingMode.THIRD_PLACE_MATCH;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
};

type DoubleThirdOlympicResult = BaseOlympicResult & {
  mode: typeof CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE;
  champion: string;
  runnerUp: string;
  thirdPlaces: [string, string];
};

const OLYMPIC_RESULTS: Array<TopFourOlympicResult | DoubleThirdOlympicResult> = [
  {
    year: 1908,
    host: '英国',
    quantity: 8,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '首届规范国家代表队口径的奥运会男子足球赛。',
    champion: '英国',
    runnerUp: '丹麦',
    thirdPlace: '荷兰',
    fourthPlace: '瑞典'
  },
  {
    year: 1912,
    host: '瑞典',
    quantity: 11,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '英国',
    runnerUp: '丹麦',
    thirdPlace: '荷兰',
    fourthPlace: '芬兰'
  },
  {
    year: 1920,
    host: '比利时',
    quantity: 14,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届决赛因捷克斯洛伐克退赛产生争议，奖牌名次按后续附加赛结果录入。',
    champion: '比利时',
    runnerUp: '西班牙',
    thirdPlace: '荷兰',
    fourthPlace: '法国'
  },
  {
    year: 1924,
    host: '法国',
    quantity: 22,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '瑞士',
    thirdPlace: '瑞典',
    fourthPlace: '荷兰'
  },
  {
    year: 1928,
    host: '荷兰',
    quantity: 17,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '乌拉圭',
    runnerUp: '阿根廷',
    thirdPlace: '意大利',
    fourthPlace: '埃及'
  },
  {
    year: 1936,
    host: '德国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '意大利',
    runnerUp: '奥地利',
    thirdPlace: '挪威',
    fourthPlace: '波兰'
  },
  {
    year: 1948,
    host: '英国',
    quantity: 18,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '瑞典',
    runnerUp: '南斯拉夫',
    thirdPlace: '丹麦',
    fourthPlace: '英国'
  },
  {
    year: 1952,
    host: '芬兰',
    quantity: 25,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '匈牙利',
    runnerUp: '南斯拉夫',
    thirdPlace: '瑞典',
    fourthPlace: '西德'
  },
  {
    year: 1956,
    host: '澳大利亚',
    quantity: 11,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏联',
    runnerUp: '南斯拉夫',
    thirdPlace: '保加利亚',
    fourthPlace: '印度'
  },
  {
    year: 1960,
    host: '意大利',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '南斯拉夫',
    runnerUp: '丹麦',
    thirdPlace: '匈牙利',
    fourthPlace: '意大利'
  },
  {
    year: 1964,
    host: '日本',
    quantity: 14,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '匈牙利',
    runnerUp: '捷克斯洛伐克',
    thirdPlace: '德国联队',
    fourthPlace: '阿拉伯联合共和国'
  },
  {
    year: 1968,
    host: '墨西哥',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '匈牙利',
    runnerUp: '保加利亚',
    thirdPlace: '日本',
    fourthPlace: '墨西哥'
  },
  {
    year: 1972,
    host: '西德',
    quantity: 16,
    mode: CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE,
    remark: '本届三四名赛打平，苏联和东德并列铜牌；无殿军。',
    champion: '波兰',
    runnerUp: '匈牙利',
    thirdPlaces: ['苏联', '东德']
  },
  {
    year: 1976,
    host: '加拿大',
    quantity: 13,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '东德',
    runnerUp: '波兰',
    thirdPlace: '苏联',
    fourthPlace: '巴西'
  },
  {
    year: 1980,
    host: '苏联',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '捷克斯洛伐克',
    runnerUp: '东德',
    thirdPlace: '苏联',
    fourthPlace: '南斯拉夫'
  },
  {
    year: 1984,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '法国',
    runnerUp: '巴西',
    thirdPlace: '南斯拉夫',
    fourthPlace: '意大利'
  },
  {
    year: 1988,
    host: '韩国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '苏联',
    runnerUp: '巴西',
    thirdPlace: '西德',
    fourthPlace: '意大利'
  },
  {
    year: 1992,
    host: '西班牙',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '波兰',
    thirdPlace: '加纳',
    fourthPlace: '澳大利亚'
  },
  {
    year: 1996,
    host: '美国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '尼日利亚',
    runnerUp: '阿根廷',
    thirdPlace: '巴西',
    fourthPlace: '葡萄牙'
  },
  {
    year: 2000,
    host: '澳大利亚',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '喀麦隆',
    runnerUp: '西班牙',
    thirdPlace: '智利',
    fourthPlace: '美国'
  },
  {
    year: 2004,
    host: '希腊',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '巴拉圭',
    thirdPlace: '意大利',
    fourthPlace: '伊拉克'
  },
  {
    year: 2008,
    host: '中国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '阿根廷',
    runnerUp: '尼日利亚',
    thirdPlace: '巴西',
    fourthPlace: '比利时'
  },
  {
    year: 2012,
    host: '英国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '墨西哥',
    runnerUp: '巴西',
    thirdPlace: '韩国',
    fourthPlace: '日本'
  },
  {
    year: 2016,
    host: '巴西',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '巴西',
    runnerUp: '德国',
    thirdPlace: '尼日利亚',
    fourthPlace: '洪都拉斯'
  },
  {
    year: 2020,
    host: '日本',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    remark: '本届因疫情延期至 2021 年举办，届次仍按 2020 年录入。',
    champion: '巴西',
    runnerUp: '西班牙',
    thirdPlace: '墨西哥',
    fourthPlace: '日本'
  },
  {
    year: 2024,
    host: '法国',
    quantity: 16,
    mode: CompetitionEditionStandingMode.THIRD_PLACE_MATCH,
    champion: '西班牙',
    runnerUp: '法国',
    thirdPlace: '摩洛哥',
    fourthPlace: '埃及'
  }
];

async function main() {
  await runCompetitionSeed({
    prisma,
    confederations: CONFEDERATIONS,
    countries: REQUIRED_COUNTRIES,
    historicalCountries: HISTORICAL_COUNTRIES,
    competition: {
      code: 'OLYMPIC_MENS_FOOTBALL',
      create: {
        code: 'OLYMPIC_MENS_FOOTBALL',
        name: '奥运会男子足球赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_at_the_Summer_Olympics',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description: '夏季奥林匹克运动会男子足球赛事，现代男足奥运会长期采用年龄限制规则。',
        enabled: true,
        includeInStats: true,
        sortOrder: 15
      },
      update: {
        name: '奥运会男子足球赛',
        externalUrl: 'https://en.wikipedia.org/wiki/Football_at_the_Summer_Olympics',
        targetType: CompetitionTargetType.COUNTRY,
        scopeType: CompetitionScopeType.GLOBAL,
        category: '国际',
        level: '三级',
        format: '杯赛',
        description: '夏季奥林匹克运动会男子足球赛事，现代男足奥运会长期采用年龄限制规则。',
        confederationId: null,
        countryId: null,
        enabled: true,
        includeInStats: true,
        sortOrder: 15
      }
    },
    editions: OLYMPIC_RESULTS.map((result) => ({
      ...result,
      standingMode: result.mode
    })),
    buildStandings,
    completedMessage: 'Olympic men football seed completed.'
  });
}

function buildStandings(result: TopFourOlympicResult | DoubleThirdOlympicResult) {
  const standings: Array<{
    placement: CompetitionStandingPlacement;
    countryName: string;
    standingOrder: number;
  }> = [
    {
      placement: CompetitionStandingPlacement.CHAMPION,
      countryName: result.champion,
      standingOrder: 0
    },
    {
      placement: CompetitionStandingPlacement.RUNNER_UP,
      countryName: result.runnerUp,
      standingOrder: 0
    }
  ];

  if (result.mode === CompetitionEditionStandingMode.DOUBLE_THIRD_PLACE) {
    standings.push(
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        countryName: result.thirdPlaces[0],
        standingOrder: 1
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        countryName: result.thirdPlaces[1],
        standingOrder: 2
      }
    );
    return standings;
  }

  standings.push(
    {
      placement: CompetitionStandingPlacement.THIRD_PLACE,
      countryName: result.thirdPlace,
      standingOrder: 0
    },
    {
      placement: CompetitionStandingPlacement.FOURTH_PLACE,
      countryName: result.fourthPlace,
      standingOrder: 0
    }
  );

  return standings;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
