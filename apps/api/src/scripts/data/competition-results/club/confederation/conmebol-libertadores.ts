import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type LibertadoresResult = FinalOnlyCompetitionResult;

type RawLibertadoresResult = Pick<LibertadoresResult, 'year' | 'champion' | 'runnerUp'> & {
  year: number;
  note?: string;
};

export const CONMEBOL_LIBERTADORES_METADATA: CompetitionDataMetadata = {
  competitionCode: 'CONMEBOL_LIBERTADORES',
  name: '南美解放者杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Copa Libertadores - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_Libertadores',
      remark: '用于核对南美解放者杯历史沿革和赛事口径。'
    },
    {
      label: 'List of Copa Libertadores finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/List_of_Copa_Libertadores_finals',
      remark: '用于核对历届决赛冠军、亚军和结果。'
    },
    {
      label: '2025 Copa Libertadores final - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2025_Copa_Libertadores_final',
      remark: '用于核对 2025 年决赛弗拉门戈 1-0 帕尔梅拉斯。'
    }
  ],
  lastVerifiedAt: '2026-07-14',
  notes: [
    '本文件录入 1960 至 2025 南美解放者杯决赛冠亚军。',
    '只录最终冠军和亚军，不录四强、季军、殿军。',
    '历届冠亚军俱乐部均已完成映射，隐藏俱乐部仍参与豪门荣誉统计。'
  ]
};

export const CONMEBOL_LIBERTADORES_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1922', name: '佩纳罗尔', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '102924', name: '亚松森奥林匹亚', countryName: '巴拉圭', confederationCode: 'CONMEBOL' },
  { uid: '329', name: '帕尔梅拉斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '335', name: '桑托斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '89', name: '独立竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '1921', name: '乌拉圭国民', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '94', name: '河床竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '93', name: '竞赛', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '85', name: '拉普拉塔大学生', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '120064',
    name: '西班牙联',
    alias: '西班牙联合',
    countryName: '智利',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '1450',
    name: '秘鲁体育大学',
    countryName: '秘鲁',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '421',
    name: '卡利体育',
    alias: '卡利竞技',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '104359',
    name: '科布雷罗阿',
    alias: '科布雷洛亚',
    countryName: '智利',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '399', name: '科洛科洛', countryName: '智利', confederationCode: 'CONMEBOL' },
  {
    uid: '321',
    name: '克鲁塞罗',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '78', name: '阿根廷青年人', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '91',
    name: '纽维尔老男孩',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '417',
    name: '卡利美洲',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '427',
    name: '国民竞技',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '403', name: '天主教大学', countryName: '智利', confederationCode: 'CONMEBOL' },
  {
    uid: '109180',
    name: '瓜亚基尔巴塞罗那',
    alias: '巴塞罗那SC',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '98', name: '萨斯菲尔德', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '324', name: '格雷米奥', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '339',
    name: '瓦斯科达伽马',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '326',
    name: '巴西国际',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '1254', name: '蓝十字', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  {
    uid: '420',
    name: '卡尔达斯十一人',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    alias: '云斯卡尔达斯',
    visibleInCatalog: false
  },
  {
    uid: '1449',
    name: '水晶体育',
    countryName: '秘鲁',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '301354',
    name: '圣卡埃塔诺',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '107206', name: '巴拉纳竞技', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '5270338',
    name: '基多大学',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '1255',
    name: '瓜达拉哈拉',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  { uid: '319', name: '科林蒂安', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '314', name: '米内罗竞技', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '96',
    name: '圣洛伦索',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '5280337',
    name: '巴拉圭国民',
    countryName: '巴拉圭',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '1260',
    name: '新莱昂自治大学老虎',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    alias: '墨西哥老虎'
  },
  {
    uid: '80001277',
    name: '山谷独立',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '90',
    name: '拉努斯',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '323',
    name: '弗鲁米嫩塞',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '316',
    name: '博塔弗戈',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  }
];

const RAW_LIBERTADORES_RESULTS: RawLibertadoresResult[] = [
  { year: 1960, champion: '佩纳罗尔', runnerUp: '亚松森奥林匹亚' },
  { year: 1961, champion: '佩纳罗尔', runnerUp: '帕尔梅拉斯' },
  { year: 1962, champion: '桑托斯', runnerUp: '佩纳罗尔' },
  { year: 1963, champion: '桑托斯', runnerUp: '博卡青年' },
  { year: 1964, champion: '独立竞技', runnerUp: '乌拉圭国民' },
  { year: 1965, champion: '独立竞技', runnerUp: '佩纳罗尔' },
  { year: 1966, champion: '佩纳罗尔', runnerUp: '河床竞技' },
  { year: 1967, champion: '竞赛', runnerUp: '乌拉圭国民' },
  { year: 1968, champion: '拉普拉塔大学生', runnerUp: '帕尔梅拉斯' },
  { year: 1969, champion: '拉普拉塔大学生', runnerUp: '乌拉圭国民' },
  { year: 1970, champion: '拉普拉塔大学生', runnerUp: '佩纳罗尔' },
  { year: 1971, champion: '乌拉圭国民', runnerUp: '拉普拉塔大学生' },
  { year: 1972, champion: '独立竞技', runnerUp: '秘鲁体育大学' },
  { year: 1973, champion: '独立竞技', runnerUp: '科洛科洛' },
  { year: 1974, champion: '独立竞技', runnerUp: '圣保罗' },
  { year: 1975, champion: '独立竞技', runnerUp: '西班牙联' },
  { year: 1976, champion: '克鲁塞罗', runnerUp: '河床竞技' },
  { year: 1977, champion: '博卡青年', runnerUp: '克鲁塞罗' },
  { year: 1978, champion: '博卡青年', runnerUp: '卡利体育' },
  { year: 1979, champion: '亚松森奥林匹亚', runnerUp: '博卡青年' },
  { year: 1980, champion: '乌拉圭国民', runnerUp: '巴西国际' },
  { year: 1981, champion: '弗拉门戈', runnerUp: '科布雷罗阿' },
  { year: 1982, champion: '佩纳罗尔', runnerUp: '科布雷罗阿' },
  { year: 1983, champion: '格雷米奥', runnerUp: '佩纳罗尔' },
  { year: 1984, champion: '独立竞技', runnerUp: '格雷米奥' },
  { year: 1985, champion: '阿根廷青年人', runnerUp: '卡利美洲' },
  { year: 1986, champion: '河床竞技', runnerUp: '卡利美洲' },
  { year: 1987, champion: '佩纳罗尔', runnerUp: '卡利美洲' },
  { year: 1988, champion: '乌拉圭国民', runnerUp: '纽维尔老男孩' },
  { year: 1989, champion: '国民竞技', runnerUp: '亚松森奥林匹亚' },
  { year: 1990, champion: '亚松森奥林匹亚', runnerUp: '瓜亚基尔巴塞罗那' },
  { year: 1991, champion: '科洛科洛', runnerUp: '亚松森奥林匹亚' },
  { year: 1992, champion: '圣保罗', runnerUp: '纽维尔老男孩' },
  { year: 1993, champion: '圣保罗', runnerUp: '天主教大学' },
  { year: 1994, champion: '萨斯菲尔德', runnerUp: '圣保罗' },
  { year: 1995, champion: '格雷米奥', runnerUp: '国民竞技' },
  { year: 1996, champion: '河床竞技', runnerUp: '卡利美洲' },
  { year: 1997, champion: '克鲁塞罗', runnerUp: '水晶体育' },
  { year: 1998, champion: '瓦斯科达伽马', runnerUp: '瓜亚基尔巴塞罗那' },
  { year: 1999, champion: '帕尔梅拉斯', runnerUp: '卡利体育' },
  { year: 2000, champion: '博卡青年', runnerUp: '帕尔梅拉斯' },
  { year: 2001, champion: '博卡青年', runnerUp: '蓝十字' },
  { year: 2002, champion: '亚松森奥林匹亚', runnerUp: '圣卡埃塔诺' },
  { year: 2003, champion: '博卡青年', runnerUp: '桑托斯' },
  { year: 2004, champion: '卡尔达斯十一人', runnerUp: '博卡青年' },
  { year: 2005, champion: '圣保罗', runnerUp: '巴拉纳竞技' },
  { year: 2006, champion: '巴西国际', runnerUp: '圣保罗' },
  { year: 2007, champion: '博卡青年', runnerUp: '格雷米奥' },
  { year: 2008, champion: '基多大学', runnerUp: '弗鲁米嫩塞' },
  { year: 2009, champion: '拉普拉塔大学生', runnerUp: '克鲁塞罗' },
  { year: 2010, champion: '巴西国际', runnerUp: '瓜达拉哈拉' },
  { year: 2011, champion: '桑托斯', runnerUp: '佩纳罗尔' },
  { year: 2012, champion: '科林蒂安', runnerUp: '博卡青年' },
  { year: 2013, champion: '米内罗竞技', runnerUp: '亚松森奥林匹亚' },
  { year: 2014, champion: '圣洛伦索', runnerUp: '巴拉圭国民' },
  { year: 2015, champion: '河床竞技', runnerUp: '新莱昂自治大学老虎' },
  { year: 2016, champion: '国民竞技', runnerUp: '山谷独立' },
  { year: 2017, champion: '格雷米奥', runnerUp: '拉努斯' },
  { year: 2018, champion: '河床竞技', runnerUp: '博卡青年' },
  { year: 2019, champion: '弗拉门戈', runnerUp: '河床竞技' },
  { year: 2020, champion: '帕尔梅拉斯', runnerUp: '桑托斯' },
  { year: 2021, champion: '帕尔梅拉斯', runnerUp: '弗拉门戈' },
  { year: 2022, champion: '弗拉门戈', runnerUp: '巴拉纳竞技' },
  { year: 2023, champion: '弗鲁米嫩塞', runnerUp: '博卡青年' },
  { year: 2024, champion: '博塔弗戈', runnerUp: '米内罗竞技', note: '决赛 3-1' },
  { year: 2025, champion: '弗拉门戈', runnerUp: '帕尔梅拉斯', note: '决赛 1-0' }
];

export const CONMEBOL_LIBERTADORES_RESULTS: LibertadoresResult[] = RAW_LIBERTADORES_RESULTS.map(
  (result) => ({
    ...result,
    name: `${result.year}年`,
    host: result.year >= 2019 ? '单场决赛举办地' : '南美洲',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: result.note
      ? `${result.note}，${result.champion} 击败 ${result.runnerUp}。`
      : `决赛${result.champion}击败${result.runnerUp}。`
  })
);

export function buildConmebolLibertadoresStandings(result: LibertadoresResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
