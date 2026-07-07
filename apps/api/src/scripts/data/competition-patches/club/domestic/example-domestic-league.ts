import { CompetitionEditionStandingMode, CompetitionStandingPlacement } from '@prisma/client';
import type { CompetitionDataMetadata } from '../../../competition-metadata.js';
import type { SeedClub, SeedCompetitionPatch } from '../../../../helpers/competition-seed.js';

export const EXAMPLE_PARTIAL_LEAGUE_METADATA: CompetitionDataMetadata = {
  competitionCode: 'EXAMPLE_DOMESTIC_LEAGUE',
  name: '示例国内联赛',
  dataKind: 'competition-patches',
  target: 'club',
  scope: 'domestic',
  sources: [],
  notes: ['仅作为俱乐部赛事按赛事文件补录的结构示例，不接入默认 seed 执行。']
};

export const EXAMPLE_PARTIAL_LEAGUE_CLUBS: SeedClub[] = [
  {
    uid: '-',
    name: '示例俱乐部',
    countryName: '英格兰',
    confederationCode: 'UEFA',
    exists: false
  }
];

export const EXAMPLE_PARTIAL_LEAGUE_PATCHES: SeedCompetitionPatch[] = [
  {
    competitionCode: 'EXAMPLE_DOMESTIC_LEAGUE',
    name: '1980年',
    year: 1980,
    season: '1979-80',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.CHAMPION,
        clubName: '示例俱乐部'
      }
    ]
  },
  {
    competitionCode: 'EXAMPLE_DOMESTIC_LEAGUE',
    name: '1981年',
    year: 1981,
    season: '1980-81',
    standingMode: CompetitionEditionStandingMode.LEAGUE_TOP_THREE,
    standings: [
      {
        placement: CompetitionStandingPlacement.RUNNER_UP,
        clubName: '示例俱乐部'
      },
      {
        placement: CompetitionStandingPlacement.THIRD_PLACE,
        clubName: '示例俱乐部'
      }
    ]
  }
];
