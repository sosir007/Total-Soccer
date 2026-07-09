import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const FIFA_INTERCONTINENTAL_CUP_METADATA: CompetitionDataMetadata = {
  competitionCode: 'FIFA_INTERCONTINENTAL_CUP',
  name: '国际足联洲际杯',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'global',
  sources: [
    {
      label: 'FIFA Intercontinental Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/FIFA_Intercontinental_Cup',
      remark: '用于核对 2024 起新国际足联洲际杯赛制和历届冠亚军。'
    },
    {
      label: '2024 FIFA Intercontinental Cup final - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2024_FIFA_Intercontinental_Cup_final',
      remark: '用于核对 2024 决赛皇家马德里 3-0 帕丘卡。'
    },
    {
      label: '2025 FIFA Intercontinental Cup - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/2025_FIFA_Intercontinental_Cup',
      remark: '用于核对 2025 决赛巴黎圣日耳曼点球击败弗拉门戈。'
    }
  ],
  lastVerifiedAt: '2026-07-09',
  notes: [
    '本文件只录入 2024 起的新国际足联洲际杯，不包含 1960-2004 旧洲际杯/丰田杯。',
    '只录最终冠军和亚军；各阶段小奖杯不作为独立 standings 录入。',
    '2026 未完赛，不录入。'
  ]
};

export const FIFA_INTERCONTINENTAL_CUP_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1736', name: '皇家马德里', countryName: '西班牙', confederationCode: 'UEFA' },
  {
    uid: '116204',
    name: '帕丘卡',
    countryName: '墨西哥',
    confederationCode: 'CONCACAF',
    visibleInCatalog: false
  },
  { uid: '868', name: '巴黎圣日耳曼', countryName: '法国', confederationCode: 'UEFA' },
  { uid: '322', name: '弗拉门戈', countryName: '巴西', confederationCode: 'CONMEBOL' }
];

export const FIFA_INTERCONTINENTAL_CUP_RESULTS: FinalOnlyCompetitionResult[] = [
  {
    year: 2024,
    host: '卡塔尔卢赛尔',
    quantity: 6,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '皇家马德里',
    runnerUp: '帕丘卡',
    remark: '决赛皇家马德里 3-0 帕丘卡。'
  },
  {
    year: 2025,
    host: '卡塔尔赖扬',
    quantity: 6,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '巴黎圣日耳曼',
    runnerUp: '弗拉门戈',
    remark: '决赛 1-1，加时后巴黎圣日耳曼点球 2-1 弗拉门戈。'
  }
];

export function buildFifaIntercontinentalCupStandings(
  result: FinalOnlyCompetitionResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
