import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

type CopaDeOroResult = FinalOnlyCompetitionResult;

type RawCopaDeOroResult = Pick<CopaDeOroResult, 'year' | 'champion' | 'runnerUp'> & {
  year: number;
  host: string;
  note?: string;
};

export const COPA_DE_ORO_METADATA: CompetitionDataMetadata = {
  competitionCode: 'COPA_DE_ORO',
  name: '南美金杯赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'confederation',
  sources: [
    {
      label: 'Copa de Oro - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Copa_de_Oro',
      remark: '用于核对赛事基础资料、举办年份和参赛口径。'
    },
    {
      label: 'South America - Other Copas - RSSSF',
      url: 'https://www.rsssf.org/sacups/samisc.html',
      remark: '用于核对 1993、1995、1996 届决赛结果。'
    }
  ],
  lastVerifiedAt: '2026-07-30',
  notes: [
    '本文件录入 1993、1995、1996 南美金杯赛历届冠军和亚军。',
    '赛事为南美足联短期历史杯赛，由各项 CONMEBOL 洲际赛事冠军参加，按俱乐部洲际四级杯赛处理，命中 CLUB_CONTINENTAL_LEVEL_4_CUP。',
    '1994 年未举办；只录最终冠军和亚军。'
  ]
};

export const COPA_DE_ORO_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '82', name: '博卡青年', countryName: '阿根廷', confederationCode: 'CONMEBOL' },
  { uid: '314', name: '米内罗竞技', countryName: '巴西', confederationCode: 'CONMEBOL' },
  {
    uid: '321',
    name: '克鲁塞罗',
    countryName: '巴西',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  },
  { uid: '337', name: '圣保罗', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' }
];

const RAW_COPA_DE_ORO_RESULTS: RawCopaDeOroResult[] = [
  {
    year: 1993,
    champion: '博卡青年',
    runnerUp: '米内罗竞技',
    host: '南美洲主客场两回合决赛'
  },
  {
    year: 1995,
    champion: '克鲁塞罗',
    runnerUp: '圣保罗',
    host: '南美洲主客场两回合决赛',
    note: '两回合总比分 1-1，克鲁塞罗点球大战取胜。'
  },
  {
    year: 1996,
    champion: '弗拉门戈',
    runnerUp: '圣保罗',
    host: '马瑙斯单场决赛'
  }
];

export const COPA_DE_ORO_RESULTS: CopaDeOroResult[] = RAW_COPA_DE_ORO_RESULTS.map((result) => ({
  ...result,
  name: `${result.year}年`,
  season: `${result.year}`,
  quantity: 2,
  mode: CompetitionEditionStandingMode.FINAL_ONLY,
  remark: result.note ?? `决赛${result.champion}击败${result.runnerUp}。`
}));

export function buildCopaDeOroStandings(result: CopaDeOroResult): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
