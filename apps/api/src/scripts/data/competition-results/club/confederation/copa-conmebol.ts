import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CopaConmebolResult = FinalOnlyCompetitionResult;

type RawCopaConmebolResult = Pick<CopaConmebolResult, 'year' | 'champion' | 'runnerUp'> & {
  year: number;
};

export const COPA_CONMEBOL_METADATA: CompetitionDataMetadata = {
  competitionCode: 'COPA_CONMEBOL',
  name: '南美足联杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Copa CONMEBOL - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_CONMEBOL',
      remark: '用于核对赛事基础资料、举办年份与赛事定位。'
    },
    {
      label: 'Copa CONMEBOL finals - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_CONMEBOL',
      remark: '用于核对 1992-1999 历届冠亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-17',
  notes: [
    '本文件录入 1992 至 1999 南美足联杯历届冠军和亚军。',
    '赛事口径按南美足联历史二级俱乐部杯赛处理，命中 CLUB_CONTINENTAL_LEVEL_2_CUP。',
    '只录最终冠军和亚军，不录四强、季军、殿军。'
  ]
};

export const COPA_CONMEBOL_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '314', name: '米内罗竞技', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '102924',
    name: '亚松森奥林匹亚',
    countryName: '巴拉圭',
    confederationCode: 'CONMEBOL'
  },
  {
    uid: '316',
    name: '博塔弗戈',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '1922', name: '佩纳罗尔', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '95',
    name: '罗萨里奥中央',
    countryName: '阿根廷',
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
  {
    uid: '423',
    name: '圣塔菲独立',
    alias: '圣菲独立',
    countryName: '哥伦比亚',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '335', name: '桑托斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '102489',
    name: '塔勒雷斯',
    alias: '科尔多瓦制造厂',
    countryName: '阿根廷',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '107210',
    name: '阿拉戈亚诺',
    alias: 'CSA',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  }
];

const RAW_COPA_CONMEBOL_RESULTS: RawCopaConmebolResult[] = [
  { year: 1992, champion: '米内罗竞技', runnerUp: '亚松森奥林匹亚' },
  { year: 1993, champion: '博塔弗戈', runnerUp: '佩纳罗尔' },
  { year: 1994, champion: '圣保罗', runnerUp: '佩纳罗尔' },
  { year: 1995, champion: '罗萨里奥中央', runnerUp: '米内罗竞技' },
  { year: 1996, champion: '拉努斯', runnerUp: '圣塔菲独立' },
  { year: 1997, champion: '米内罗竞技', runnerUp: '拉努斯' },
  { year: 1998, champion: '桑托斯', runnerUp: '罗萨里奥中央' },
  { year: 1999, champion: '塔勒雷斯', runnerUp: '阿拉戈亚诺' }
];

export const COPA_CONMEBOL_RESULTS: CopaConmebolResult[] = RAW_COPA_CONMEBOL_RESULTS.map(
  (result) => ({
    ...result,
    name: `${result.year}年`,
    host: '南美洲主客场两回合决赛',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: `两回合决赛，${result.champion}击败${result.runnerUp}。`
  })
);

export function buildCopaConmebolStandings(result: CopaConmebolResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
