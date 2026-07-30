import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CopaMasterDeSupercopaResult = FinalOnlyCompetitionResult;

type RawCopaMasterDeSupercopaResult = Pick<
  CopaMasterDeSupercopaResult,
  'year' | 'champion' | 'runnerUp'
> & {
  year: number;
  host: string;
  note?: string;
};

export const COPA_MASTER_DE_SUPERCOPA_METADATA: CompetitionDataMetadata = {
  competitionCode: 'COPA_MASTER_DE_SUPERCOPA',
  name: '南美解放者超级杯大师赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Copa Master de Supercopa - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_Master_de_Supercopa',
      remark: '用于核对赛事基础资料、举办年份、参赛口径和历届冠亚军。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件录入 1992、1995 南美解放者超级杯大师赛冠军和亚军。',
    '赛事由曾夺得南美解放者超级杯的俱乐部参加，按俱乐部洲际四级杯赛处理，命中 CLUB_CONTINENTAL_LEVEL_4_CUP。',
    '1998 届原计划举办但最终取消，不建有效届次。'
  ]
};

export const COPA_MASTER_DE_SUPERCOPA_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  {
    uid: '321',
    name: '克鲁塞罗',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  {
    uid: '102924',
    name: '亚松森奥林匹亚',
    countryName: '巴拉圭',
    confederationCode: 'CONMEBOL'
  }
];

const RAW_COPA_MASTER_DE_SUPERCOPA_RESULTS: RawCopaMasterDeSupercopaResult[] = [
  {
    year: 1992,
    champion: '博卡青年',
    runnerUp: '克鲁塞罗',
    host: '布宜诺斯艾利斯单场决赛',
    note: '1992 届为 4 队单地淘汰赛，决赛博卡青年 2-1 击败克鲁塞罗。'
  },
  {
    year: 1995,
    champion: '克鲁塞罗',
    runnerUp: '亚松森奥林匹亚',
    host: '南美洲主客场两回合决赛',
    note: '1995 届为两回合决赛，克鲁塞罗总比分 1-0 击败亚松森奥林匹亚。'
  }
];

export const COPA_MASTER_DE_SUPERCOPA_RESULTS: CopaMasterDeSupercopaResult[] =
  RAW_COPA_MASTER_DE_SUPERCOPA_RESULTS.map((result) => ({
    ...result,
    name: `${result.year}年`,
    season: `${result.year}`,
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    remark: result.note ?? `决赛${result.champion}击败${result.runnerUp}。`
  }));

export function buildCopaMasterDeSupercopaStandings(
  result: CopaMasterDeSupercopaResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
