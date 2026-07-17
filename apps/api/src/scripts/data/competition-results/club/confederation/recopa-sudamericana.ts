import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type RecopaSudamericanaResult = SeedEdition & {
  champion: string;
  runnerUp?: string;
};

type RawRecopaSudamericanaResult = {
  year: number;
  champion: string;
  runnerUp?: string;
  note?: string;
};

export const RECOPA_SUDAMERICANA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'RECOPA_SUDAMERICANA',
  name: '南美优胜者杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Recopa Sudamericana - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Recopa_Sudamericana',
      remark: '用于核对赛事基础资料、历史沿革和参赛口径。'
    },
    {
      label: 'Recopa Sudamericana finals - RSSSF',
      url: 'https://www.rsssf.org/sacups/recopa.html',
      remark: '用于核对早期届次、1991 年直接授予冠军等特殊情况。'
    },
    {
      label: 'CONMEBOL Recopa 2026',
      url: 'https://gol.conmebol.com/sudamericana/pt-br/news/lanus-e-campeao-da-conmebol-recopa-de-2026',
      remark: '用于核对 2026 年拉努斯击败弗拉门戈夺冠。'
    }
  ],
  lastVerifiedAt: '2026-07-17',
  notes: [
    '本文件录入 1989 至 2026 南美优胜者杯历届冠军和亚军。',
    '赛事为南美超级杯性质，按俱乐部洲际四级杯赛处理，命中 CLUB_CONTINENTAL_LEVEL_4_CUP。',
    '1991 年奥林匹亚同时拥有参赛资格，赛事未实际对阵，standing 只写冠军。'
  ]
};

export const RECOPA_SUDAMERICANA_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1921', name: '乌拉圭国民', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '93', name: '竞赛', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '427',
    name: '国民竞技',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '102924',
    name: '亚松森奥林匹亚',
    countryName: '巴拉圭',
    confederationCode: 'CONMEBOL'
  },
  { uid: '399', name: '科洛科洛', countryName: '智利', confederationCode: 'CONMEBOL' },
  {
    uid: '321',
    name: '克鲁塞罗',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '316',
    name: '博塔弗戈',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '89', name: '独立竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '98', name: '萨斯菲尔德', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '324', name: '格雷米奥', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '94', name: '河床竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '308107',
    name: '西恩夏诺',
    countryName: '秘鲁',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '96',
    name: '圣洛伦索',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '420',
    name: '卡尔达斯十一人',
    alias: '云斯卡尔达斯',
    countryName: '哥伦比亚',
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
  {
    uid: '116204',
    name: '帕丘卡',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  {
    uid: '102476',
    name: '萨兰迪阿森纳',
    alias: '萨兰迪兵工厂',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '5270338',
    name: '基多大学',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '85', name: '拉普拉塔大学生', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '335', name: '桑托斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '404',
    name: '智利大学',
    countryName: '智利',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '319', name: '科林蒂安', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '314', name: '米内罗竞技', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '90',
    name: '拉努斯',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '423',
    name: '圣塔菲独立',
    alias: '圣菲独立',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '301304',
    name: '沙佩科恩斯',
    alias: '沙佩科人',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '107206',
    name: '巴拉纳竞技',
    countryName: '巴西',
    confederationCode: 'CONMEBOL'
  },
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '80001277',
    name: '山谷独立',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '108526',
    name: '国防与司法',
    alias: '防卫者',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '329', name: '帕尔梅拉斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '323',
    name: '弗鲁米嫩塞',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  }
];

const RAW_RECOPA_SUDAMERICANA_RESULTS: RawRecopaSudamericanaResult[] = [
  { year: 1989, champion: '乌拉圭国民', runnerUp: '竞赛' },
  { year: 1990, champion: '博卡青年', runnerUp: '国民竞技' },
  { year: 1991, champion: '亚松森奥林匹亚', note: '奥林匹亚同时获得参赛资格，赛事未实际对阵。' },
  { year: 1992, champion: '科洛科洛', runnerUp: '克鲁塞罗' },
  { year: 1993, champion: '圣保罗', runnerUp: '克鲁塞罗' },
  { year: 1994, champion: '圣保罗', runnerUp: '博塔弗戈' },
  { year: 1995, champion: '独立竞技', runnerUp: '萨斯菲尔德' },
  { year: 1996, champion: '格雷米奥', runnerUp: '独立竞技' },
  { year: 1997, champion: '萨斯菲尔德', runnerUp: '河床竞技' },
  { year: 1998, champion: '克鲁塞罗', runnerUp: '河床竞技' },
  { year: 2003, champion: '亚松森奥林匹亚', runnerUp: '圣洛伦索' },
  { year: 2004, champion: '西恩夏诺', runnerUp: '博卡青年' },
  { year: 2005, champion: '博卡青年', runnerUp: '卡尔达斯十一人' },
  { year: 2006, champion: '博卡青年', runnerUp: '圣保罗' },
  { year: 2007, champion: '巴西国际', runnerUp: '帕丘卡' },
  { year: 2008, champion: '博卡青年', runnerUp: '萨兰迪阿森纳' },
  { year: 2009, champion: '基多大学', runnerUp: '巴西国际' },
  { year: 2010, champion: '基多大学', runnerUp: '拉普拉塔大学生' },
  { year: 2011, champion: '巴西国际', runnerUp: '独立竞技' },
  { year: 2012, champion: '桑托斯', runnerUp: '智利大学' },
  { year: 2013, champion: '科林蒂安', runnerUp: '圣保罗' },
  { year: 2014, champion: '米内罗竞技', runnerUp: '拉努斯' },
  { year: 2015, champion: '河床竞技', runnerUp: '圣洛伦索' },
  { year: 2016, champion: '河床竞技', runnerUp: '圣塔菲独立' },
  { year: 2017, champion: '国民竞技', runnerUp: '沙佩科恩斯' },
  { year: 2018, champion: '格雷米奥', runnerUp: '独立竞技' },
  { year: 2019, champion: '河床竞技', runnerUp: '巴拉纳竞技' },
  { year: 2020, champion: '弗拉门戈', runnerUp: '山谷独立' },
  { year: 2021, champion: '国防与司法', runnerUp: '帕尔梅拉斯' },
  { year: 2022, champion: '帕尔梅拉斯', runnerUp: '巴拉纳竞技' },
  { year: 2023, champion: '山谷独立', runnerUp: '弗拉门戈' },
  { year: 2024, champion: '弗鲁米嫩塞', runnerUp: '基多大学' },
  { year: 2025, champion: '竞赛', runnerUp: '博塔弗戈' },
  { year: 2026, champion: '拉努斯', runnerUp: '弗拉门戈', note: '两回合总比分 4-2。' }
];

export const RECOPA_SUDAMERICANA_RESULTS: RecopaSudamericanaResult[] =
  RAW_RECOPA_SUDAMERICANA_RESULTS.map((result) => ({
    ...result,
    name: `${result.year}年`,
    season: `${result.year}`,
    host: result.runnerUp ? '南美洲主客场两回合决赛' : '未实际对阵',
    quantity: result.runnerUp ? 2 : 1,
    standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: result.note
      ? `${result.note}${result.runnerUp ? ` ${result.champion}击败${result.runnerUp}。` : ''}`
      : `决赛${result.champion}击败${result.runnerUp}。`
  }));

export function buildRecopaSudamericanaStandings(result: RecopaSudamericanaResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    ...(result.runnerUp
      ? [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }]
      : [])
  ];
}
