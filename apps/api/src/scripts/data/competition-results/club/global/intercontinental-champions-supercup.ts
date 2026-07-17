import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const INTERCONTINENTAL_CHAMPIONS_SUPERCUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'INTERCONTINENTAL_CHAMPIONS_SUPERCUP',
  name: '洲际冠军超级杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'global',
  sources: [
    {
      label: "Intercontinental Champions' Supercup - Wikipedia",
      url: 'https://en.wikipedia.org/wiki/Intercontinental_Champions%27_Supercup',
      remark: '用于核对洲际冠军超级杯历史口径、官方性说明和 1968、1969 两届结果。'
    },
    {
      label: 'Recopa Intercontinental 1968/69 - RSSSF',
      url: 'https://www.rsssf.org/tablesr/recopa-int.html',
      remark: '用于核对 1968 届参赛队、南美区、欧洲区和桑托斯 1-0 国际米兰的最终结果。'
    },
    {
      label: 'Supercopa 1969 - RSSSF',
      url: 'https://www.rsssf.org/sacups/supcopa69.html',
      remark: '用于核对 1969 届南美区参赛队、积分榜和佩纳罗尔冠军。'
    }
  ],
  lastVerifiedAt: '2026-07-17',
  notes: [
    '本文件录入 1968、1969 两届洲际冠军超级杯；1970 未举办，不创建届次。',
    '1968 届为跨洲决赛，桑托斯夺冠、国际米兰亚军；第二回合未举行。',
    '1969 届欧洲球队未参赛，按南美区最终结果记录佩纳罗尔冠军、竞赛亚军，并在备注中说明口径。'
  ]
};

export const INTERCONTINENTAL_CHAMPIONS_SUPERCUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '335', name: '桑托斯', countryName: '巴西', confederationCode: 'CONMEBOL' },
  { uid: '1135', name: '国际米兰', countryName: '意大利', confederationCode: 'UEFA' },
  { uid: '1922', name: '佩纳罗尔', countryName: '乌拉圭', confederationCode: 'CONMEBOL' },
  { uid: '93', name: '竞赛', countryName: '阿根廷', confederationCode: 'CONMEBOL' }
];

export const INTERCONTINENTAL_CHAMPIONS_SUPERCUP_RESULTS: FinalOnlyCompetitionResult[] = [
  {
    year: 1968,
    host: '欧洲/南美洲',
    quantity: 5,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '桑托斯',
    runnerUp: '国际米兰',
    remark: '跨洲决赛首回合国际米兰 0-1 桑托斯，第二回合未举行，桑托斯夺冠。'
  },
  {
    year: 1969,
    host: '南美洲',
    quantity: 3,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '佩纳罗尔',
    runnerUp: '竞赛',
    remark: '欧洲球队未参赛，无最终跨洲决赛；按南美区最终积分记录佩纳罗尔冠军、竞赛亚军。'
  }
];

export function buildIntercontinentalChampionsSupercupStandings(
  result: FinalOnlyCompetitionResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
