import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedEdition, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CopaSudamericanaResult = SeedEdition & {
  champion?: string;
  runnerUp?: string;
  sourceChampion: string;
  sourceRunnerUp: string;
  note?: string;
};

type RawCopaSudamericanaResult = {
  year: number;
  champion?: string;
  runnerUp?: string;
  sourceChampion?: string;
  sourceRunnerUp?: string;
  note?: string;
};

export const COPA_SUDAMERICANA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'COPA_SUDAMERICANA',
  name: '南美杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Copa Sudamericana - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_Sudamericana',
      remark: '用于核对赛事基础资料、历届冠军与亚军。'
    },
    {
      label: 'CONMEBOL Sudamericana',
      url: 'https://www.conmebol.com/conmebol-sudamericana/',
      remark: '用于核对赛事现行状态和南美足联官方赛事口径。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件录入 2002 至 2025 南美杯已完成届次的冠军和亚军口径。',
    '赛事为南美足联现行二级俱乐部洲际杯赛，命中 CLUB_CONTINENTAL_LEVEL_2_CUP。',
    '按“只补库里已有俱乐部荣誉”的口径，standings 只写当前数据库已有俱乐部；缺失对手保留在 remark 中，后续补齐俱乐部后可再扩展。'
  ]
};

export const COPA_SUDAMERICANA_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '96', name: '圣洛伦索', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '427',
    name: '国民竞技',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '308107',
    name: '西恩夏诺',
    countryName: '秘鲁',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '94', name: '河床竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '116204',
    name: '帕丘卡',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  { uid: '399', name: '科洛科洛', countryName: '智利', confederationCode: 'CONMEBOL' },
  {
    uid: '102476',
    name: '萨兰迪阿森纳',
    alias: '萨兰迪兵工厂',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '1253', name: '墨西哥美洲', countryName: '墨西哥', confederationCode: 'CONCACAF' },
  {
    uid: '326',
    name: '巴西国际',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '85', name: '拉普拉塔大学生', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '5270338',
    name: '基多大学',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '323',
    name: '弗鲁米嫩塞',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '89', name: '独立竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '404',
    name: '智利大学',
    countryName: '智利',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
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
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '107206', name: '巴拉纳竞技', countryName: '巴西', confederationCode: 'CONMEBOL' },
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
  { uid: '93', name: '竞赛', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '321',
    name: '克鲁塞罗',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '314', name: '米内罗竞技', countryName: '巴西', confederationCode: 'CONMEBOL' }
];

const RAW_COPA_SUDAMERICANA_RESULTS: RawCopaSudamericanaResult[] = [
  { year: 2002, champion: '圣洛伦索', runnerUp: '国民竞技' },
  { year: 2003, champion: '西恩夏诺', runnerUp: '河床竞技' },
  { year: 2004, champion: '博卡青年', sourceRunnerUp: '美洲狮' },
  { year: 2005, champion: '博卡青年', sourceRunnerUp: '美洲狮' },
  { year: 2006, champion: '帕丘卡', runnerUp: '科洛科洛' },
  { year: 2007, champion: '萨兰迪阿森纳', runnerUp: '墨西哥美洲' },
  { year: 2008, champion: '巴西国际', runnerUp: '拉普拉塔大学生' },
  { year: 2009, champion: '基多大学', runnerUp: '弗鲁米嫩塞' },
  { year: 2010, champion: '独立竞技', sourceRunnerUp: '戈亚斯' },
  { year: 2011, champion: '智利大学', runnerUp: '基多大学' },
  { year: 2012, champion: '圣保罗', sourceRunnerUp: '蒂格雷' },
  { year: 2013, champion: '拉努斯', sourceRunnerUp: '庞特普雷塔' },
  { year: 2014, champion: '河床竞技', runnerUp: '国民竞技' },
  { year: 2015, champion: '圣塔菲独立', sourceRunnerUp: '飓风' },
  {
    year: 2016,
    champion: '沙佩科恩斯',
    runnerUp: '国民竞技',
    note: '决赛因拉米亚空难未实际进行，南美足联应国民竞技提议授予沙佩科恩斯冠军。'
  },
  { year: 2017, champion: '独立竞技', runnerUp: '弗拉门戈' },
  { year: 2018, champion: '巴拉纳竞技', sourceRunnerUp: '巴兰基亚青年' },
  { year: 2019, champion: '山谷独立', sourceRunnerUp: '科隆' },
  { year: 2020, champion: '国防与司法', runnerUp: '拉努斯' },
  { year: 2021, champion: '巴拉纳竞技', sourceRunnerUp: '布拉甘蒂诺红牛' },
  { year: 2022, champion: '山谷独立', runnerUp: '圣保罗' },
  { year: 2023, champion: '基多大学', sourceRunnerUp: '福塔莱萨' },
  { year: 2024, champion: '竞赛', runnerUp: '克鲁塞罗' },
  { year: 2025, champion: '拉努斯', runnerUp: '米内罗竞技' }
];

export const COPA_SUDAMERICANA_RESULTS: CopaSudamericanaResult[] =
  RAW_COPA_SUDAMERICANA_RESULTS.map((result) => {
    const sourceChampion = result.sourceChampion ?? result.champion;
    const sourceRunnerUp = result.sourceRunnerUp ?? result.runnerUp;
    const recordedTeams = [result.champion, result.runnerUp].filter(Boolean);
    const missingTeams = [
      sourceChampion !== result.champion ? sourceChampion : null,
      sourceRunnerUp !== result.runnerUp ? sourceRunnerUp : null
    ].filter(Boolean);

    return {
      ...result,
      sourceChampion: sourceChampion ?? '未知冠军',
      sourceRunnerUp: sourceRunnerUp ?? '未知亚军',
      name: `${result.year}年`,
      season: `${result.year}`,
      host:
        result.year === 2016
          ? '未实际对阵'
          : result.year >= 2019
            ? '中立场单场决赛'
            : '南美洲主客场两回合决赛',
      quantity: recordedTeams.length,
      standingMode: CompetitionEditionStandingMode.FINAL_ONLY,
      remark: [
        result.note ??
          `决赛${sourceChampion ?? result.champion}击败${sourceRunnerUp ?? result.runnerUp}。`,
        missingTeams.length ? `未录入当前库缺失俱乐部：${missingTeams.join('、')}。` : null
      ]
        .filter(Boolean)
        .join(' ')
    };
  });

export function buildCopaSudamericanaStandings(result: CopaSudamericanaResult): SeedStanding[] {
  return [
    ...(result.champion
      ? [{ placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion }]
      : []),
    ...(result.runnerUp
      ? [{ placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }]
      : [])
  ];
}
