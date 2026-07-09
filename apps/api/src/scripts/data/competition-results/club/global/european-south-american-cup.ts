import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const EUROPEAN_SOUTH_AMERICAN_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'EUROPEAN_SOUTH_AMERICAN_CUP',
  name: '欧洲/南美洲杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'global',
  sources: [
    {
      label: 'Intercontinental Cup (1960-2004) - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Intercontinental_Cup_(1960%E2%80%932004)',
      remark: '用于核对 1960-2004 欧洲/南美洲杯历史口径和历届冠亚军。'
    },
    {
      label: 'List of Intercontinental Cup matches - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Intercontinental_Cup_matches',
      remark: '用于核对每届对阵、比分和特殊赛制。'
    }
  ],
  lastVerifiedAt: '2026-07-09',
  notes: [
    '本文件录入 1960-2004 欧洲/南美洲杯完整历史结果，其中 1980-2004 为丰田杯赞助阶段。',
    '只录最终冠军和亚军；1975、1978 未举办，不创建届次。',
    '2024 起的新国际足联洲际杯单独使用 FIFA_INTERCONTINENTAL_CUP，不并入本赛事。'
  ]
};

export const EUROPEAN_SOUTH_AMERICAN_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1736', name: '皇家马德里', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '1922', name: '佩纳罗尔', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '1487', name: '本菲卡', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '335', name: '桑托斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1099', name: 'AC米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1135', name: '国际米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '89', name: '独立竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '93', name: '竞赛', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1569', name: '凯尔特人', countryName: '苏格兰', confederationCode: 'UEFA' },
  {
    uid: '85',
    name: '拉普拉塔大学生',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '680', name: '曼联', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '1013', name: '费耶诺德', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '1921', name: '乌拉圭国民', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  {
    uid: '983',
    name: '帕纳辛奈科斯',
    countryName: '希腊',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '992', name: '阿贾克斯', countryName: '荷兰', confederationCode: 'UEFA' },
  { uid: '1139', name: '尤文图斯', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1687', name: '马德里竞技', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '915', name: '拜仁慕尼黑', countryName: '德国', confederationCode: 'UEFA' },
  {
    uid: '321',
    name: '克鲁塞罗',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '908',
    name: '门兴格拉德巴赫',
    countryName: '德国',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  {
    uid: '102924',
    name: '亚松森奥林匹亚',
    countryName: '巴拉圭',
    confederationCode: 'CONMEBOL'
  },
  { uid: '1816', name: '马尔默', countryName: '瑞典', confederationCode: 'UEFA' },
  { uid: '692', name: '诺丁汉森林', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '676', name: '利物浦', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '603', name: '阿斯顿维拉', countryName: '英格兰', confederationCode: 'UEFA' },
  { uid: '324', name: '格雷米奥', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '947', name: '汉堡', countryName: '德国', confederationCode: 'UEFA' },
  { uid: '78', name: '阿根廷青年人', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '94', name: '河床竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '1513',
    name: '布加勒斯特星',
    countryName: '罗马尼亚',
    confederationCode: 'UEFA',
    visibleInCatalog: false
  },
  { uid: '1478', name: '波尔图', countryName: '葡萄牙', confederationCode: 'UEFA' },
  { uid: '1028', name: '埃因霍温', countryName: '荷兰', confederationCode: 'UEFA' },
  {
    uid: '427',
    name: '国民竞技',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '1955', name: '贝尔格莱德红星', countryName: '塞尔维亚', confederationCode: 'UEFA' },
  { uid: '399', name: '科洛科洛', countryName: '智利', confederationCode: 'CONMEBOL' },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1708', name: '巴塞罗那', countryName: '西班牙', confederationCode: 'UEFA' },
  { uid: '98', name: '萨斯菲尔德', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '907', name: '多特蒙德', countryName: '德国', confederationCode: 'UEFA' },
  {
    uid: '339',
    name: '瓦斯科达伽马',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '329', name: '帕尔梅拉斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '420',
    name: '卡尔达斯十一人',
    alias: '云斯卡尔达斯',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  }
];

export const EUROPEAN_SOUTH_AMERICAN_CUP_RESULTS: FinalOnlyCompetitionResult[] = [
  {
    year: 1960,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '皇家马德里',
    runnerUp: '佩纳罗尔',
    remark: '两回合，皇家马德里总比分 5-1。'
  },
  {
    year: 1961,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '佩纳罗尔',
    runnerUp: '本菲卡',
    remark: '三场制，佩纳罗尔附加赛 2-1。'
  },
  {
    year: 1962,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '桑托斯',
    runnerUp: '本菲卡',
    remark: '两回合，桑托斯总比分 8-4。'
  },
  {
    year: 1963,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '桑托斯',
    runnerUp: 'AC米兰',
    remark: '三场制，桑托斯附加赛 1-0。'
  },
  {
    year: 1964,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '国际米兰',
    runnerUp: '独立竞技',
    remark: '三场制，国际米兰附加赛 1-0。'
  },
  {
    year: 1965,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '国际米兰',
    runnerUp: '独立竞技',
    remark: '两回合，国际米兰总比分 3-0。'
  },
  {
    year: 1966,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '佩纳罗尔',
    runnerUp: '皇家马德里',
    remark: '两回合，佩纳罗尔总比分 4-0。'
  },
  {
    year: 1967,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '竞赛',
    runnerUp: '凯尔特人',
    remark: '三场制，竞赛附加赛 1-0。'
  },
  {
    year: 1968,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '拉普拉塔大学生',
    runnerUp: '曼联',
    remark: '两回合，拉普拉塔大学生总比分 2-1。'
  },
  {
    year: 1969,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: 'AC米兰',
    runnerUp: '拉普拉塔大学生',
    remark: '两回合，AC米兰总比分 4-2。'
  },
  {
    year: 1970,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '费耶诺德',
    runnerUp: '拉普拉塔大学生',
    remark: '两回合，费耶诺德总比分 3-2。'
  },
  {
    year: 1971,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '乌拉圭国民',
    runnerUp: '帕纳辛奈科斯',
    remark: '两回合，乌拉圭国民总比分 3-2。'
  },
  {
    year: 1972,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '阿贾克斯',
    runnerUp: '独立竞技',
    remark: '两回合，阿贾克斯总比分 4-1。'
  },
  {
    year: 1973,
    host: '意大利罗马',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '独立竞技',
    runnerUp: '尤文图斯',
    remark: '单场，独立竞技 1-0 尤文图斯。'
  },
  {
    year: 1974,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '马德里竞技',
    runnerUp: '独立竞技',
    remark: '两回合，马德里竞技总比分 2-1。'
  },
  {
    year: 1976,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '拜仁慕尼黑',
    runnerUp: '克鲁塞罗',
    remark: '两回合，拜仁慕尼黑总比分 2-0。'
  },
  {
    year: 1977,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '博卡青年',
    runnerUp: '门兴格拉德巴赫',
    remark: '两回合，博卡青年总比分 5-2。'
  },
  {
    year: 1979,
    host: '欧洲/南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '亚松森奥林匹亚',
    runnerUp: '马尔默',
    remark: '两回合，亚松森奥林匹亚总比分 3-1。'
  },
  {
    year: 1980,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '乌拉圭国民',
    runnerUp: '诺丁汉森林',
    remark: '丰田杯阶段，决赛乌拉圭国民 1-0 诺丁汉森林。'
  },
  {
    year: 1981,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '弗拉门戈',
    runnerUp: '利物浦',
    remark: '丰田杯阶段，决赛弗拉门戈 3-0 利物浦。'
  },
  {
    year: 1982,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '佩纳罗尔',
    runnerUp: '阿斯顿维拉',
    remark: '丰田杯阶段，决赛佩纳罗尔 2-0 阿斯顿维拉。'
  },
  {
    year: 1983,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '格雷米奥',
    runnerUp: '汉堡',
    remark: '丰田杯阶段，决赛格雷米奥 2-1 汉堡，加时。'
  },
  {
    year: 1984,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '独立竞技',
    runnerUp: '利物浦',
    remark: '丰田杯阶段，决赛独立竞技 1-0 利物浦。'
  },
  {
    year: 1985,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '尤文图斯',
    runnerUp: '阿根廷青年人',
    remark: '丰田杯阶段，决赛 2-2，尤文图斯点球 4-2 阿根廷青年人。'
  },
  {
    year: 1986,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '河床竞技',
    runnerUp: '布加勒斯特星',
    remark: '丰田杯阶段，决赛河床竞技 1-0 布加勒斯特星。'
  },
  {
    year: 1987,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '波尔图',
    runnerUp: '佩纳罗尔',
    remark: '丰田杯阶段，决赛波尔图 2-1 佩纳罗尔，加时。'
  },
  {
    year: 1988,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '乌拉圭国民',
    runnerUp: '埃因霍温',
    remark: '丰田杯阶段，决赛 2-2，乌拉圭国民点球 7-6 埃因霍温。'
  },
  {
    year: 1989,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: 'AC米兰',
    runnerUp: '国民竞技',
    remark: '丰田杯阶段，决赛AC米兰 1-0 国民竞技，加时。'
  },
  {
    year: 1990,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: 'AC米兰',
    runnerUp: '亚松森奥林匹亚',
    remark: '丰田杯阶段，决赛AC米兰 3-0 亚松森奥林匹亚。'
  },
  {
    year: 1991,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '贝尔格莱德红星',
    runnerUp: '科洛科洛',
    remark: '丰田杯阶段，决赛贝尔格莱德红星 3-0 科洛科洛。'
  },
  {
    year: 1992,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '圣保罗',
    runnerUp: '巴塞罗那',
    remark: '丰田杯阶段，决赛圣保罗 2-1 巴塞罗那。'
  },
  {
    year: 1993,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '圣保罗',
    runnerUp: 'AC米兰',
    remark: '丰田杯阶段，决赛圣保罗 3-2 AC米兰。'
  },
  {
    year: 1994,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '萨斯菲尔德',
    runnerUp: 'AC米兰',
    remark: '丰田杯阶段，决赛萨斯菲尔德 2-0 AC米兰。'
  },
  {
    year: 1995,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '阿贾克斯',
    runnerUp: '格雷米奥',
    remark: '丰田杯阶段，决赛 0-0，阿贾克斯点球 4-3 格雷米奥。'
  },
  {
    year: 1996,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '尤文图斯',
    runnerUp: '河床竞技',
    remark: '丰田杯阶段，决赛尤文图斯 1-0 河床竞技。'
  },
  {
    year: 1997,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '多特蒙德',
    runnerUp: '克鲁塞罗',
    remark: '丰田杯阶段，决赛多特蒙德 2-0 克鲁塞罗。'
  },
  {
    year: 1998,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '皇家马德里',
    runnerUp: '瓦斯科达伽马',
    remark: '丰田杯阶段，决赛皇家马德里 2-1 瓦斯科达伽马。'
  },
  {
    year: 1999,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '曼联',
    runnerUp: '帕尔梅拉斯',
    remark: '丰田杯阶段，决赛曼联 1-0 帕尔梅拉斯。'
  },
  {
    year: 2000,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '博卡青年',
    runnerUp: '皇家马德里',
    remark: '丰田杯阶段，决赛博卡青年 2-1 皇家马德里。'
  },
  {
    year: 2001,
    host: '日本东京',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '拜仁慕尼黑',
    runnerUp: '博卡青年',
    remark: '丰田杯阶段，决赛拜仁慕尼黑 1-0 博卡青年，加时。'
  },
  {
    year: 2002,
    host: '日本横滨',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '皇家马德里',
    runnerUp: '亚松森奥林匹亚',
    remark: '丰田杯阶段，决赛皇家马德里 2-0 亚松森奥林匹亚。'
  },
  {
    year: 2003,
    host: '日本横滨',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '博卡青年',
    runnerUp: 'AC米兰',
    remark: '丰田杯阶段，决赛 1-1，博卡青年点球 3-1 AC米兰。'
  },
  {
    year: 2004,
    host: '日本横滨',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '波尔图',
    runnerUp: '卡尔达斯十一人',
    remark: '丰田杯阶段，决赛 0-0，波尔图点球 8-7 卡尔达斯十一人。'
  }
];

export function buildEuropeanSouthAmericanCupStandings(
  result: FinalOnlyCompetitionResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
