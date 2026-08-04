import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { SeedClub, SeedStanding } from '../../../../helpers/competition-seed.js';
import type { FinalOnlyCompetitionResult } from '../../../../helpers/competition-results.js';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';

export const UEFA_CONMEBOL_CLUB_CHALLENGE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'UEFA_CONMEBOL_CLUB_CHALLENGE',
  name: '欧足联-南美足联俱乐部挑战赛',
  dataKind: 'competition-results',
  target: 'club',
  scope: 'global',
  sources: [
    {
      label: 'UEFA-CONMEBOL Club Challenge - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/UEFA%E2%80%93CONMEBOL_Club_Challenge',
      remark: '用于核对赛事口径和 2023 届冠军、亚军。'
    },
    {
      label: 'UEFA CONMEBOL Club Challenge official page',
      url: 'https://www.uefa.com/uefaconmebolclubchallenge/',
      remark: '用于核对欧足联官方赛事页面和首届赛事信息。'
    }
  ],
  lastVerifiedAt: '2026-08-04',
  notes: [
    '本文件录入欧足联欧洲联赛冠军与南美杯冠军之间的跨足联俱乐部挑战赛。',
    '截至 2026-08-04 仅确认举办 2023 一届；2024、2025 未找到已举办记录。',
    '该赛事官方性质偏挑战赛，系统按俱乐部国际四级杯赛计分。',
    '只录最终冠军和亚军。'
  ]
};

export const UEFA_CONMEBOL_CLUB_CHALLENGE_REQUIRED_CLUBS: SeedClub[] = [
  { uid: '1759', name: '塞维利亚', countryName: '西班牙', confederationCode: 'UEFA' },
  {
    uid: '80001277',
    name: '山谷独立',
    countryName: '厄瓜多尔',
    confederationCode: 'CONMEBOL',
    visibleInCatalog: false
  }
];

export const UEFA_CONMEBOL_CLUB_CHALLENGE_RESULTS: FinalOnlyCompetitionResult[] = [
  {
    year: 2023,
    host: '西班牙塞维利亚拉蒙·桑切斯·皮斯胡安球场',
    quantity: 2,
    mode: CompetitionEditionStandingMode.FINAL_ONLY,
    champion: '塞维利亚',
    runnerUp: '山谷独立',
    remark: '决赛 1-1，塞维利亚点球 4-1 山谷独立。'
  }
];

export function buildUefaConmebolClubChallengeStandings(
  result: FinalOnlyCompetitionResult
): SeedStanding[] {
  return [
    { placement: CompetitionStandingPlacement.CHAMPION, clubName: result.champion },
    { placement: CompetitionStandingPlacement.RUNNER_UP, clubName: result.runnerUp }
  ];
}
