import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type SupercopaLibertadoresResult = FinalOnlyCompetitionResult;

type RawSupercopaLibertadoresResult = Pick<
  SupercopaLibertadoresResult,
  'year' | 'champion' | 'runnerUp'
> & {
  year: number;
};

export const SUPERCOPA_LIBERTADORES_METADATA: CompetitionDataMetadata = {
  competitionCode: 'SUPERCOPA_LIBERTADORES',
  name: '南美解放者超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Supercopa Libertadores - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Supercopa_Libertadores',
      remark: '用于核对赛事基础资料、举办年份、参赛口径和历届冠亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件录入 1988 至 1997 南美解放者超级杯历届冠军和亚军。',
    '赛事为历届南美解放者杯冠军俱乐部参赛的南美足联已停办洲际杯赛，按俱乐部洲际二级杯赛处理，命中 CLUB_CONTINENTAL_LEVEL_2_CUP。',
    '只录最终冠军和亚军，不录四强。'
  ]
};

export const SUPERCOPA_LIBERTADORES_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '93', name: '竞赛', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '321',
    name: '克鲁塞罗',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '89', name: '独立竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '102924',
    name: '亚松森奥林匹亚',
    countryName: '巴拉圭',
    confederationCode: 'CONMEBOL'
  },
  { uid: '1921', name: '乌拉圭国民', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '94', name: '河床竞技', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '98', name: '萨斯菲尔德', countryName: '阿根廷', confederationCode: 'CONMEBOL' }
];

const RAW_SUPERCOPA_LIBERTADORES_RESULTS: RawSupercopaLibertadoresResult[] = [
  { year: 1988, champion: '竞赛', runnerUp: '克鲁塞罗' },
  { year: 1989, champion: '博卡青年', runnerUp: '独立竞技' },
  { year: 1990, champion: '亚松森奥林匹亚', runnerUp: '乌拉圭国民' },
  { year: 1991, champion: '克鲁塞罗', runnerUp: '河床竞技' },
  { year: 1992, champion: '克鲁塞罗', runnerUp: '竞赛' },
  { year: 1993, champion: '圣保罗', runnerUp: '弗拉门戈' },
  { year: 1994, champion: '独立竞技', runnerUp: '博卡青年' },
  { year: 1995, champion: '独立竞技', runnerUp: '弗拉门戈' },
  { year: 1996, champion: '萨斯菲尔德', runnerUp: '克鲁塞罗' },
  { year: 1997, champion: '河床竞技', runnerUp: '圣保罗' }
];

export const SUPERCOPA_LIBERTADORES_RESULTS: SupercopaLibertadoresResult[] =
  RAW_SUPERCOPA_LIBERTADORES_RESULTS.map((result) => ({
    ...result,
    name: `${result.year}年`,
    season: `${result.year}`,
    host: '南美洲主客场两回合决赛',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: `两回合决赛，${result.champion}击败${result.runnerUp}。`
  }));

export function buildSupercopaLibertadoresStandings(
  result: SupercopaLibertadoresResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
